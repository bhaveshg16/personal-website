/**
 * Central site configuration — edit this file to control the portfolio
 * and what the AI assistant is allowed to talk about.
 */
export const siteConfig = {
  name: "Bhavesh Gupta",
  role: "Software Engineer",
  tagline:
    "Software Engineer building solutions to whatever problem comes in mind",
  email: "gupta.bhavesh.1602@gmail.com",
  location: "India",
  socials: {
    github: "https://github.com/bhaveshg16",
    linkedin: "https://www.linkedin.com/in/bhavesh-gupta-052951227/",
  },

  /**
   * GitHub repos the AI assistant is allowed to know about ("owner/repo").
   * Only repos listed here are fetched at build time and exposed to visitors.
   * Example: "your-username/cool-project"
   */
  githubRepos: [
    "bhaveshg16/budget-manager",
    "bhaveshg16/URL-shortener",
    "bhaveshg16/Lending-Sapphire",
  ] as string[],

  /** Starter questions shown as clickable chips in the chat. */
  suggestedQuestions: [
    "What kind of engineer is Bhavesh?",
    "What is his strongest backend work?",
    "Which technologies does he use day to day?",
    "Tell me about his current role.",
  ],

  nav: [
    { label: "Projects", href: "/projects" },
    { label: "Experience", href: "/experience" },
    { label: "About", href: "/about" },
    { label: "Ask AI", href: "/chat" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
