import React from "react";
import Terminal from "../components/Terminal";

const Page = () => {
  const primaryText = "text-neutral-900 dark:text-neutral-100";
  const secondaryText = "text-neutral-500 dark:text-neutral-400";
  const accentText = "text-neutral-400 dark:text-neutral-500";

  return (
    <div className="space-y-24 animate-[fadeIn_0.5s_ease-in-out]">
      {/* Intro */}
      <section className={secondaryText}>
        {/* Contact Links */}
        <div className="flex gap-4 text-xs uppercase tracking-widest mt-6">
          <a
            href="https://github.com/Jason10293"
            target="_blank"
            className="transition-colors border-b border-transparent hover:border-current text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            Github
          </a>
          <a
            href="https://www.linkedin.com/in/29jason-wu/"
            target="_blank"
            className="transition-colors border-b border-transparent hover:border-current text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            LinkedIn
          </a>
          <a
            href="mailto:jason.wu@queensu.ca"
            target="_blank"
            className="transition-colors border-b border-transparent hover:border-current text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            Email
          </a>
        </div>
      </section>

      {/* personal projects */}
      <section className="mt-0">
        <h2 className={`text-xs uppercase tracking-widest ${accentText} mb-10`}>
          personal projects
        </h2>
        <div className="space-y-12">
          {[
            {
              name: "E-Commerce Dashboard",
              stack: "React, Node, Tailwind",
              year: "2024",
              description:
                "A comprehensive dashboard for managing inventory and sales analytics. Features real-time data visualization via WebSockets and a highly customizable widget system for merchant reporting.",
            },
            {
              name: "Finance Tracker",
              stack: "Next.js, Prisma, PostgreSQL",
              year: "2023",
              description:
                "Personal finance application focused on privacy and speed. Implements double-entry bookkeeping logic on the client-side for immediate feedback, synced eventually-consistent to the edge.",
            },
            {
              name: "Generative AI Art Tool",
              stack: "WebGL, Python, TensorFlow",
              year: "2023",
              description:
                "Browser-based editor for chaining generative models. Users can build node-based pipelines to process images using custom trained LoRAs directly in the browser using WebGPU.",
            },
          ].map((project, idx) => (
            <article key={idx} className="group">
              <div className="flex items-baseline justify-between mb-2">
                <h3
                  className={`font-medium text-base ${primaryText} group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors`}
                >
                  {project.name}
                </h3>
                <span className={`${accentText} text-xs`}>{project.year}</span>
              </div>
              <div className="pl-4 border-l border-neutral-200 dark:border-neutral-800 ml-1">
                <p className={`${secondaryText} mb-2 leading-relaxed max-w-lg`}>
                  {project.description}
                </p>
                <p className={`${accentText} text-xs uppercase tracking-wider`}>
                  {project.stack}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* AI Terminal */}
      <section>
        <div className="flex items-center gap-2 mb-8">
          <h2 className={`text-xs uppercase tracking-widest ${accentText}`}>
            Terminal
          </h2>
          <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-grow"></div>
        </div>
        <Terminal />
      </section>

      <footer className={`text-xs ${accentText} pt-12 flex justify-between`}>
        <span>© {new Date().getFullYear()}</span>
        <span>
          Local Time:{" "}
          {new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </footer>
    </div>
  );
};

export default Page;
