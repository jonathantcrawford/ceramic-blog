import "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlask,
  faKeyboard,
  faLaptop,
  faComputer,
  faBook,
  faCode,
  faGrip,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

const skill_type_icon_map: Record<typeof skills[number]["type"], IconDefinition>  = {
  programming_language: faCode,
  framework: faGrip,
  library: faBook,
  dev_tool: faComputer,
  test_tool: faFlask
};


const skills = [
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

const work_experiences = [
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

const degrees = [
  {
    institution: "R.I.T.",
    title: "B.S. Applied Arts & Sciences",
    duration: "2012-2017"
  }
] as const;


//"https://avatars.githubusercontent.com/u/18152659?s=460&u=e454d38be0b44f8972a298adefcb63b970c139f5&v=4"

const Section = ({ id, title, children}: any) => {
  return (
    <section id={id} className="pb-4 border-white-100 pt-4 first-of-type:pt-0">
      <h1 className="font-saygon text-5xl pb-2 font-bold">{title}</h1>
      {children}
    </section>
  );
}

const Degree = ({ institution, title, duration}: typeof degrees[number]) => {
  return (
    <h2 className="font-saygon text-xl pb-2">
      {`${title}, ${institution} ${duration}`}
    </h2>
  )
}

const WorkExperience = ({ company, location, role, duration, highlights}: typeof work_experiences[number]) => {
  return (
    <section className="pb-4">
      <h2 className="font-saygon text-xl pb-2">
        {`${role}: ${company}, ${location}`}
        <br/>
        {`${duration}`}
      </h2>
      <ul className="list-disc pl-4 leading-8">
        {highlights.map((highlight, key) => (<li key={key} className="font-saygon font-light">{highlight}</li>))}
      </ul>
    </section>
  )
}

const Skill = ({ type, slug }: typeof skills[number]) => {
  return (
    <span className="font-saygon font-light">
      <FontAwesomeIcon className="text-white-100 text-xs" icon={skill_type_icon_map[type]} /> {slug}
    </span>
  )
}


export default function Resume() {
  return (
    <div className="grid-in-ga-content w-full text-base text-white-100 hyphens divide-y-2">
      <Section id="degress" title="Degrees">
        {degrees.map((degree, key) => (<Degree key={key} {...degree}/>))}
      </Section>
      <Section id="work_experience" title="Work Experience">
        {work_experiences.map((work_experience, key) => (<WorkExperience key={key} {...work_experience}/>))}
      </Section>
      <Section id="skills" title="Skills">
        <div className="flex flex-wrap flex-row gap-4">
          {skills.map((skill, key) => (<Skill key={key} {...skill}/>))}
        </div>
      </Section>
    </div>
  );
}