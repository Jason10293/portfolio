import React from "react";
import Terminal from "../components/Terminal";

type Project = {
  name: string;
  stack: string;
  year: string;
  description: string;
  link?: string;
};

type ProjectSection = {
  title: string;
  projects: Project[];
};

const ProjectCard = ({
  project,
  primaryText,
  secondaryText,
  accentText,
}: {
  project: Project;
  primaryText: string;
  secondaryText: string;
  accentText: string;
}) => (
  <article className="group">
    <div className="flex items-baseline justify-between mb-2">
      <h3
        className={`font-medium text-base ${primaryText} group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors`}
      >
        <span className="flex items-center gap-2">
          {project.name}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              aria-label={`Open ${project.name}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          )}
        </span>
      </h3>
      <span className={`${accentText} text-xs`}>{project.year}</span>
    </div>
    <div className="pl-4 border-l border-neutral-200 dark:border-neutral-800 ml-1">
      <p className={`${secondaryText} mb-2 leading-relaxed max-w-2xl`}>
        {project.description}
      </p>
      <p className={`${accentText} text-xs uppercase tracking-wider`}>
        {project.stack}
      </p>
    </div>
  </article>
);

const Page = () => {
  const primaryText = "text-neutral-900 dark:text-neutral-100";
  const secondaryText = "text-neutral-500 dark:text-neutral-400";
  const accentText = "text-neutral-400 dark:text-neutral-500";

  const projectSections: ProjectSection[] = [
    {
      title: "club projects",
      projects: [
        {
          name: "Bonsai - Language Learning Platform",
          stack: "Next.js, Golang, PostgreSQL",
          year: "2025 - present",
          link: "https://www.bonsaistudy.com/",
          description: `Building a personalized language learning platform in a tech incubator with a cross-functional team. 
          Developed the user access system and contributed to core architecture alongside improvements 
          to the backend data model, API surface, and session handling.`,
        },
      ],
    },
    {
      title: "personal projects",
      projects: [
        {
          name: "GO Backend API",
          stack: "Golang, PostgreSQL",
          year: "2025",
          description: `Built a modular Go e-commerce API with versioned routes, JWT auth, and role based user and product management. 
            Integrated PostgreSQL through sqlc with automated migrations for safer, type checked queries.
             Reached over eighty percent test coverage using interface driven design, httptest mocks, and streamlined build workflows.`,
        },
        {
          name: "Redis Clone",
          stack: "C",
          year: "2024",
          description: `Built a Redis inspired high-performance in-memory key value store with durable append only persistence and optimized data structures. 
            Added a full Criterion test suite to validate behavior and edge cases.
             Improved performance by about fifty percent by profiling with Valgrind and eliminating memory leaks.`,
        },
      ],
    },
  ];

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

      <section className="mt-0 space-y-10">
        {projectSections.map(({ title, projects }) => (
          <div key={title}>
            <h2
              className={`text-xs uppercase tracking-widest ${accentText} mb-10`}
            >
              {title}
            </h2>
            <div className="space-y-12">
              {projects.map((project) => (
                <ProjectCard
                  key={project.name}
                  project={project}
                  primaryText={primaryText}
                  secondaryText={secondaryText}
                  accentText={accentText}
                />
              ))}
            </div>
          </div>
        ))}
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
