export function getEditPrompt(selectedText, userInstruction) {
  return `{
    Edit the text as per the provided instruction.
    Text: """${selectedText}""",
    Instruction: """${userInstruction}""",
    Option: Edit
    }`;
}

export function getAskPrompt(selectedText, userQuestion) {
  return `{
    Answer the question if it is related to the provided context or content in the document.
    Text: """${selectedText}""",
    Question: """${userQuestion}""",
    Option: Ask
    }`;
}

export function getGeneratePrompt(userInstruction) {
  return `{
    Generate content as per the provided instruction.
    Instruction: """${userInstruction}""",
    Option: Generate
    }`;
}
