export const skills = [
  { type: "programming_language", slug: "javascript" },
  { type: "programming_language", slug: "typescript" },
  { type: "programming_language", slug: "html" },
  { type: "programming_language", slug: "vbscript" },
  { type: "programming_language", slug: "css" },
  { type: "programming_language", slug: "c#" },
  { type: "programming_language", slug: "python" },
  { type: "programming_language", slug: "c++" },
  { type: "programming_language", slug: "mssql" },
  { type: "programming_language", slug: "mongodb" },
  { type: "programming_language", slug: "postgres" },
  { type: "programming_language", slug: "graphql" },
  { type: "framework", slug: "react" },
  { type: "framework", slug: "angular" },
  { type: "framework", slug: "classic-asp" },
  { type: "framework", slug: "remix" },
  { type: "library", slug: "juce" },
  { type: "library", slug: "handlebars" },
  { type: "dev_tool", slug: "git"},
  { type: "dev_tool", slug: "svn"},
  { type: "dev_tool", slug: "azure-devops"},
  { type: "dev_tool", slug: "jira"},
  { type: "dev_tool", slug: "npm"},
  { type: "dev_tool", slug: "sass"},
  { type: "test_tool", slug: "vitest"},
  { type: "test_tool", slug: "playwright"},
] as const;

export const work_experiences = [
  {
    company: "Lunchbox",
    location: "Remote",
    role: "Sr. Software Engineer",
    duration: "April 2021 - Present",
    highlights:[
      "Lunchbox Live",
      "Year End Review",
      "Pulse",
      "BFF",
      "2.0"
    ],
    slug:"lunchbox"
  },
  {
    company:"Bryx",
    location:"Rochester, NY",
    role:"Software Engineer",
    duration:"Dec 2020 - March 2021",
    highlights:[
      "Migrated a hardware configuration component from internal tools site to a client admin management site."
    ],
    slug:"bryx"
  },
  {
    company:"CaterTrax",
    location:"Rochester, NY",
    role:"Jr. Software Engineer - Software Engineer",
    duration:"May 2018 - Dec 2020",
    highlights:[
      "Maintained a monolithic legacy Classic ASP code base.",
      "Worked in a scrum style agile environment.",
      "Was the main developer of a core site navigation ui component, a dynamic dropdown.","Worked on a custom UX/UI framework overhaul project which is used for over 4000 sites.",
      "Wrote a To-Do web app using Angular during off hours. Presented web app and framework to all engineers in continuous improvement meeting.",
      "Worked with an enterprise partner to integrate their wallet id validation system into our checkout process using a client provided external API using certificate authentication.",
      "Frequent collaborations with database team to remove and optimize inline SQL queries.","Built custom SQL reports as requested within a statement of work requirements.",
      "Created a communication system for our development teams, which increased transparency of resource availability and project ownership.",
      "Developed a new online ordering checkout workflow enhancement into a legacy Classic ASP application.","Led a successful campaign to promote proper documentaion for several C# .NET APIs using C# swagger documentation tools.",
      "Worked with C# .NET APIs for connecting with payment gateways, user authentication/authorization, data querying, printer hardware integration, internal customer support tools and backend procedure job queues.",
      "Onboarded several engineers.","I advocated and demonstrated the use of React while implementing the front end archticture of a new application. It was my intiative that introduced a newer technology to the company."
    ],
    slug:"catertrax"
  },
] as const;

export const degrees = [
  {
    institution: "R.I.T.",
    title: "B.S. Applied Arts & Sciences",
    duration: "2012-2017"
  }
] as const;