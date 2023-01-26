import "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlask,
  faComputer,
  faBook,
  faCode,
  faGrip,
  faLink,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "@remix-run/react";

const skill_type_icon_map: Record<typeof skills[number]["type"], IconDefinition>  = {
  programming_language: faCode,
  framework: faGrip,
  library: faBook,
  dev_tool: faComputer,
  test_tool: faFlask
};


const skills = [
  { type: "programming_language", slug: ".js" },
  { type: "programming_language", slug: ".ts" },
  { type: "programming_language", slug: ".html" },
  { type: "programming_language", slug: ".css" },
  { type: "programming_language", slug: ".scss" },
  { type: "programming_language", slug: ".py" },
  { type: "programming_language", slug: ".cs" },
  { type: "programming_language", slug: ".cpp" },
  { type: "programming_language", slug: ".sql" },
  { type: "programming_language", slug: ".asp" },
  { type: "programming_language", slug: ".vbs" },
  { type: "framework", slug: "react" },
  { type: "framework", slug: "angular" },
  { type: "framework", slug: "remix" },
  { type: "library", slug: "juce" },
  { type: "library", slug: "handlebars" },
  { type: "dev_tool", slug: "git"},
  { type: "dev_tool", slug: "svn"},
  { type: "dev_tool", slug: "azure"},
  { type: "dev_tool", slug: "jira"},
  { type: "dev_tool", slug: "npm"},
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

const Section = ({ id, title, header = false,  children}: any) => {
  return (
    <section id={id}>
      {header ? <h1>{title}</h1> : <h2>{title}</h2>}
      {children}
    </section>
  );
}

const Degree = ({ institution, title, duration}: typeof degrees[number]) => {
  return (
    <span>
      {`${title}, ${institution} ${duration}`}
    </span>
  )
}

const WorkExperience = ({ company, location, role, duration, highlights}: typeof work_experiences[number]) => {
  return (
    <article>
      <h3>
        {`${role}: ${company}, ${location}`}
        <br/>
        {`${duration}`}
      </h3>
      <ul>
        {highlights.map((highlight, key) => (<li key={key}>{highlight}</li>))}
      </ul>
    </article>
  )
}

const Skills = () => {
  let languages: Array<typeof skills[number] | null> = skills.filter(skill => skill.type === "programming_language");
  let dev_tools: Array<typeof skills[number] | null> = skills.filter(skill => skill.type === "dev_tool")
  let frameworks: Array<typeof skills[number] | null> = skills.filter(skill => skill.type === "framework");
  let test_tools: Array<typeof skills[number] | null> = skills.filter(skill => skill.type === "test_tool");

  let columnCount = [languages.length, dev_tools.length, frameworks.length].sort((a, b) => a - b).pop();
  columnCount = (columnCount ?? 0) + 1; // bump column for spacing

  const language_columns = Array(columnCount).fill(null, 0).map((n, idx) => languages?.[idx] ? languages[idx] : null)
  const dev_tool_columns = Array(columnCount).fill(null, 0).map((n, idx) => dev_tools?.[idx] ? dev_tools[idx] : null)
  const framework_columns = Array(columnCount).fill(null, 0).map((n, idx) => frameworks?.[idx] ? frameworks[idx] : null)
  const test_tool_columns = Array(columnCount).fill(null, 0).map((n, idx) => test_tools?.[idx] ? test_tools[idx] : null)


  return (
    <table>
    <tr>
      <th><span><FontAwesomeIcon icon={skill_type_icon_map["programming_language"]} width="10" height="10"/> languages</span></th>
      <th><span><FontAwesomeIcon icon={skill_type_icon_map["dev_tool"]} width="10" height="10"/> dev tools</span></th>
      <th><span><FontAwesomeIcon icon={skill_type_icon_map["framework"]} width="10" height="10"/> frameworks</span></th>
      <th><span><FontAwesomeIcon icon={skill_type_icon_map["test_tool"]} width="10" height="10"/> test tools</span></th>
    </tr>
    {Array(columnCount).fill(null, 0).map((n, idx) => {
      const language_column = language_columns[idx];
      const dev_tool_column = dev_tool_columns[idx];
      const framework_column = framework_columns[idx];
      const test_tool_column = test_tool_columns[idx];
      return (
        <tr key={idx}>
          {language_column ? <td>{language_column.slug}</td> : <td/>}
          {dev_tool_column ? <td>{dev_tool_column.slug}</td> : <td/>}
          {framework_column ? <td>{framework_column.slug}</td> : <td/>}
          {test_tool_column ? <td>{test_tool_column.slug}</td> : <td/>}
        </tr>
      )
    })}
  </table>
  )
}

export const ResumeTemplate = ({includeHeader = false}) => {
   return (
      <div className="resume-template">
        {includeHeader && 
        <Section id="contact" title="Jon Crawford" header>
          <span>contact</span>
          <span>email</span>
          <span>social links</span>
          <span>website</span>
        </Section>
        }
        <Section id="work_experience" title="Work Experience">
          {work_experiences.map((work_experience, key) => (<WorkExperience key={key} {...work_experience}/>))}
        </Section>
        <Section id="degress" title="Degrees">
          {degrees.map((degree, key) => (<Degree key={key} {...degree}/>))}
        </Section>
        <Section id="skills" title="Skills">
          <Skills/>
        </Section>
      </div>
   )
}
