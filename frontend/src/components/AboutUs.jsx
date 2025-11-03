import React from "react";

const AboutUs = () => {
  return (
    <section id="about" className="py-16 px-4 pt-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12 shadow-2xl">
          <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            About Docex
          </h2>

          <div className="space-y-6 text-white/80 leading-relaxed">
            <p className="text-lg">
              Docex is a revolutionary collaborative document editing platform
              designed for the modern workspace. We believe that great ideas
              emerge when people can work together seamlessly, regardless of
              their location.
            </p>

            <p>
              Our platform combines the power of real-time collaboration with
              cutting-edge AI assistance to create an unparalleled writing and
              editing experience. Whether you're crafting a simple note or
              developing complex documentation, Docex provides the tools and
              intelligence to help you succeed.
            </p>

            <p>
              Built with privacy and security at its core, Docex ensures that
              your documents remain safe while enabling powerful collaboration
              features. Our cloud-based infrastructure provides reliability and
              accessibility, while our AI assistant helps enhance productivity
              and content quality.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Our Mission
                </h3>
                <p className="text-white/70">
                  To democratize collaborative writing by making powerful
                  document editing tools accessible to everyone, everywhere.
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Our Vision
                </h3>
                <p className="text-white/70">
                  A world where geographic boundaries don't limit creative
                  collaboration, and where AI enhances human creativity rather
                  than replacing it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
