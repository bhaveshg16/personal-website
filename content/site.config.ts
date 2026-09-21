/**
 * Central site configuration — edit this file to control the portfolio
 * and what the AI assistant is allowed to talk about.
 */
export const siteConfig = {
  name: "Bhavesh Gupta",
  role: "Software Engineer",
  tagline:
    "Backend engineer building communication and payment platforms for automotive dealerships.",
  // TODO: replace with your personal email before going live (avoid work email on a public site)
  email: "you@example.com",
  location: "India",
  socials: {
    // TODO: set your real GitHub/LinkedIn URLs
    github: "https://github.com/your-username",
    linkedin: "https://www.linkedin.com/in/your-handle",
  },

  /**
   * GitHub repos the AI assistant is allowed to know about ("owner/repo").
   * Only repos listed here are fetched at build time and exposed to visitors.
   * Example: "your-username/cool-project"
   */
  githubRepos: [] as string[],

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
