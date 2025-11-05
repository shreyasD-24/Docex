import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { FontFamily } from "@tiptap/extension-font-family";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import ToolbarButton from "./ToolbarButton";
import Collaboration from "@tiptap/extension-collaboration";
import { useEffect } from "react";

// ==================== CONSTANTS ====================

const FONT_SIZES = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
];

const LINE_HEIGHTS = ["1.0", "1.2", "1.4", "1.6", "1.8", "2.0"];

const FONT_FAMILIES = [
  "Arial, sans-serif",
  "Georgia, serif",
  "Times New Roman, serif",
  "Helvetica, sans-serif",
  "Verdana, sans-serif",
  "Trebuchet MS, sans-serif",
  "Impact, sans-serif",
  "Courier New, monospace",
  "Comic Sans MS, cursive",
];

const TEXT_COLORS = [
  { value: "#000000", label: "Black" },
  { value: "#FF0000", label: "Red" },
  { value: "#00FF00", label: "Green" },
  { value: "#0000FF", label: "Blue" },
  { value: "#FFFF00", label: "Yellow" },
  { value: "#FF00FF", label: "Magenta" },
  { value: "#00FFFF", label: "Cyan" },
  { value: "#FFA500", label: "Orange" },
  { value: "#800080", label: "Purple" },
  { value: "#008000", label: "Dark Green" },
  { value: "#800000", label: "Maroon" },
  { value: "#000080", label: "Navy" },
  { value: "#808080", label: "Gray" },
  { value: "#C0C0C0", label: "Silver" },
  { value: "#808000", label: "Olive" },
];

const DEFAULT_EDITOR_STATE = {
  currentColor: "#000000",
  currentLineHeight: "1.4",
  currentFontSize: "16px",
  isH1: false,
  isH2: false,
  isParagraph: false,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrike: false,
  isBulletList: false,
  isOrderedList: false,
  isAlignLeft: false,
  isAlignCenter: false,
  isAlignRight: false,
  isAlignJustify: false,
};

// ==================== CUSTOM EXTENSIONS ====================

// Custom extension to add line height and font size support
const CustomTextStyle = TextStyle.extend({
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) return {};
              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

// ==================== MAIN COMPONENT ====================

const TipTap = ({ ydoc, setEditor }) => {
  // Initialize editor with extensions

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable the default list extensions from StarterKit to avoid conflicts
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      CustomTextStyle,
      Color,
      Underline,
      FontFamily.configure({ types: ["textStyle"] }),
      TextAlign.configure({ types: ["heading", "paragraph", "listItem"] }),
      // Explicitly configure list extensions for better collaboration support
      BulletList.configure({
        HTMLAttributes: {
          class: "bullet-list",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "ordered-list",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "list-item",
        },
      }),
      Collaboration.configure({ document: ydoc }),
    ],
  });

  // Only set the parent's editor ref once the editor instance is ready.
  useEffect(() => {
    setEditor(editor);
  }, [editor, setEditor]);

  useEffect(() => {
    const id = "hide-remote-cursors";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
      .yjs-cursor, .yjs-selection, .prosemirror-yjs-cursor, .prosemirror-yjs-selection {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);

  // Reactive state management for toolbar buttons and dropdowns
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return DEFAULT_EDITOR_STATE;

      const attributes = editor.getAttributes("textStyle");
      return {
        currentColor: attributes.color || "#000000",
        currentLineHeight: attributes.lineHeight || "1.4",
        currentFontSize: attributes.fontSize || "16px",
        isH1: editor.isActive("heading", { level: 1 }),
        isH2: editor.isActive("heading", { level: 2 }),
        isParagraph: editor.isActive("paragraph"),
        isBold: editor.isActive("bold"),
        isItalic: editor.isActive("italic"),
        isUnderline: editor.isActive("underline"),
        isStrike: editor.isActive("strike"),
        isBulletList: editor.isActive("bulletList"),
        isOrderedList: editor.isActive("orderedList"),
        isAlignLeft: editor.isActive({ textAlign: "left" }),
        isAlignCenter: editor.isActive({ textAlign: "center" }),
        isAlignRight: editor.isActive({ textAlign: "right" }),
        isAlignJustify: editor.isActive({ textAlign: "justify" }),
      };
    },
  });

  // ==================== EVENT HANDLERS ====================

  const handleFontSizeChange = (fontSize) => {
    if (fontSize) {
      editor.chain().focus().setMark("textStyle", { fontSize }).run();
    } else {
      editor.chain().focus().unsetMark("textStyle").run();
    }
  };

  const handleLineHeightChange = (lineHeight) => {
    if (lineHeight) {
      editor.chain().focus().setMark("textStyle", { lineHeight }).run();
    } else {
      editor.chain().focus().unsetMark("textStyle").run();
    }
  };

  const handleFontFamilyChange = (fontFamily) => {
    if (fontFamily) {
      editor.chain().focus().setFontFamily(fontFamily).run();
    } else {
      editor.chain().focus().unsetFontFamily().run();
    }
  };

  const handleColorChange = (color) => {
    if (color) {
      editor.chain().focus().setColor(color).run();
    }
  };

  // ==================== TOOLBAR COMPONENTS ====================

  const TextFormattingGroup = () => (
    <div className="flex gap-1 mr-4">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editorState.isBold}
        title="Bold (Ctrl+B)"
      >
        <span className="font-bold text-sm">B</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editorState.isItalic}
        title="Italic (Ctrl+I)"
      >
        <span className="italic text-sm">I</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editorState.isUnderline}
        title="Underline (Ctrl+U)"
      >
        <span className="underline text-sm">U</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editorState.isStrike}
        title="Strikethrough"
      >
        <span className="line-through text-sm">S</span>
      </ToolbarButton>
    </div>
  );

  const HeadingsGroup = () => (
    <div className="flex gap-1 mr-4">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editorState.isH1}
        title="Heading 1 (Large heading)"
      >
        <span className="text-sm font-bold">H₁</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editorState.isH2}
        title="Heading 2 (Medium heading)"
      >
        <span className="text-sm font-bold">H₂</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editorState.isParagraph}
        title="Normal text (Paragraph)"
      >
        <span className="text-sm">P</span>
      </ToolbarButton>
    </div>
  );

  const ListsGroup = () => (
    <div className="flex gap-1 mr-4">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editorState.isBulletList}
        title="Bullet List"
      >
        <span className="text-sm">•</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editorState.isOrderedList}
        title="Numbered List"
      >
        <span className="text-sm">1.</span>
      </ToolbarButton>
    </div>
  );

  const UndoRedoGroup = () => (
    <div className="flex gap-1 mr-4">
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo (Ctrl+Z)"
      >
        <span className="text-sm">↶</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo (Ctrl+Y)"
      >
        <span className="text-sm">↷</span>
      </ToolbarButton>
    </div>
  );

  const FontSizeSelector = () => (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600 font-medium">Size:</label>
      <select
        onChange={(e) => handleFontSizeChange(e.target.value)}
        value={editorState.currentFontSize}
        className="w-16 px-1 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        title="Set font size"
      >
        <option value="">Default</option>
        {FONT_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );

  const LineHeightSelector = () => (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600 font-medium">Line:</label>
      <select
        onChange={(e) => handleLineHeightChange(e.target.value)}
        value={editorState.currentLineHeight}
        className="w-16 px-1 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        title="Set line height"
      >
        <option value="">Default</option>
        {LINE_HEIGHTS.map((height) => (
          <option key={height} value={height}>
            {height}
          </option>
        ))}
      </select>
    </div>
  );

  const FontFamilySelector = () => (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600 font-medium">Font:</label>
      <select
        onChange={(e) => handleFontFamilyChange(e.target.value)}
        className="w-24 px-1 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        title="Choose font family"
      >
        <option value="">Default</option>
        {FONT_FAMILIES.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font.split(",")[0]}
          </option>
        ))}
      </select>
    </div>
  );

  const ColorSelector = () => (
    <div className="flex items-center gap-2 mr-4">
      <div className="relative flex items-center">
        <div
          className="w-5 h-5 rounded border-2 border-gray-300 mr-1"
          style={{ backgroundColor: editorState.currentColor }}
          title="Current text color"
        />
        <select
          onChange={(e) => {
            handleColorChange(e.target.value);
            e.target.value = ""; // Reset dropdown
          }}
          className="w-6 px-0 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
          title="Choose text color"
        >
          <option value="">▼</option>
          {TEXT_COLORS.map((color) => (
            <option key={color.value} value={color.value}>
              {color.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const TextAlignmentGroup = () => (
    <div className="flex gap-1 mr-4">
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editorState.isAlignLeft}
        title="Align Left"
      >
        <span className="text-sm">≣</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editorState.isAlignCenter}
        title="Align Center"
      >
        <span className="text-sm">≡</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editorState.isAlignRight}
        title="Align Right"
      >
        <span className="text-sm">≤</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={editorState.isAlignJustify}
        title="Justify"
      >
        <span className="text-sm">≣</span>
      </ToolbarButton>
    </div>
  );

  const ToolbarDivider = () => (
    <div className="w-px h-8 bg-gray-300 mr-4"></div>
  );

  // Early return if editor is not ready
  if (!editor) return null;

  return (
    <div className="editor-container max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-black">
      {/* Toolbar */}
      <div className="toolbar bg-gray-50 border-b border-black p-2">
        <div className="flex flex-wrap gap-1 items-center">
          <TextFormattingGroup />
          <ToolbarDivider />
          <HeadingsGroup />
          <ToolbarDivider />
          <ListsGroup />
          <ToolbarDivider />
          <UndoRedoGroup />
          <ToolbarDivider />
          <FontSizeSelector />
          <ToolbarDivider />
          <LineHeightSelector />
          <ToolbarDivider />
          <FontFamilySelector />
          <ToolbarDivider />
          <ColorSelector />
          <ToolbarDivider />
          <TextAlignmentGroup />
        </div>
      </div>

      {/* Editor */}
      <div className="p-6 h-[70vh] overflow-hidden">
        <EditorContent
          editor={editor}
          className="h-full focus:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:h-full [&_.ProseMirror]:overflow-y-auto [&_.ProseMirror]:p-4 [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mb-4 [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-2 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-2 [&_.ProseMirror_li]:mb-1"
        />
      </div>
    </div>
  );
};

export default TipTap;
