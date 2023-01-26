import * as React from "react";
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
      {link: "https://live.lunchbox.dev", description: "Lunchbox Live - Public showcase of company data."},
      {link: "https://unboxed.lunchbox.io", description: "Year End Review - Annual recap of ordering statistics for each client and aggregated."} ,
      {link: null, description: "Pulse - Context marketing engine for subscribing to weather events that would trigger webhooks."},
    ],
    slug:"lunchbox"
  },
  {
    company:"Bryx",
    location:"Rochester, NY",
    role:"Software Engineer",
    duration:"Dec 2020 - March 2021",
    highlights:[
      {link: null, description: "Migrated a hardware configuration component from internal tools site to a client admin management site."}
    ],
    slug:"bryx"
  },
  {
    company:"CaterTrax",
    location:"Rochester, NY",
    role:"Jr. Software Engineer - Software Engineer",
    duration:"May 2018 - Dec 2020",
    highlights:[
      {link: null, description: "Maintained a monolithic legacy Classic ASP code base." },
      {link: null, description: "Worked in a scrum style agile environment." },
      {link: null, description: "Was the main developer of a core site navigation ui component, a dynamic dropdown." },
      {link: null, description: "Worked on a custom UX/UI framework overhaul project which is used for over 4000 sites." },
      {link: null, description: "Wrote a To-Do web app using Angular during off hours. Presented web app and framework to all engineers in continuous improvement meeting." },
      {link: null, description: "Worked with an enterprise partner to integrate their wallet id validation system into our checkout process using a client provided external API using certificate authentication." },
      {link: null, description: "Frequent collaborations with database team to remove and optimize inline SQL queries."},
      {link: null, description: "Built custom SQL reports as requested within a statement of work requirements." },
      {link: null, description: "Created a communication system for our development teams, which increased transparency of resource availability and project ownership." },
      {link: null, description: "Developed a new online ordering checkout workflow enhancement into a legacy Classic ASP application."},
      {link: null, description: "Led a successful campaign to promote proper documentaion for several C# .NET APIs using C# swagger documentation tools." },
      {link: null, description: "Worked with C# .NET APIs for connecting with payment gateways, user authentication/authorization, data querying, printer hardware integration, internal customer support tools and backend procedure job queues." },
      {link: null, description: "Onboarded several engineers."},
      {link: null, description: "I advocated and demonstrated the use of React while implementing the front end archticture of a new application. It was my intiative that introduced a newer technology to the company." }
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


const Section = ({ id, title,  children}: any) => {
  return (
    <section id={id} data-pdfmake={`{"marginBottom": 20}`}>
      <h1 data-pdfmake={`{"fontSize": 20}`}>{title}</h1>
      {children}
    </section>
  );
}

const Contact = () => {
  const { pdfMake } = useResumeTemplate();
  if (!pdfMake) return null;
  return (
    <Section id="contact" title="Jon Crawford">
      <span>(585)-520-6582 / jonathantcrawford@icloud.com / <a href="https://joncrawford.me">https://joncrawford.me</a></span>
    </Section>
  )
}

const Degrees = () => {

  const Degree = ({ institution, title, duration}: typeof degrees[number]) => {
    return (
      <span>
        {`${title}, ${institution} ${duration}`}
      </span>
    )
  }

  return (
    <Section id="degrees" title="Degree">
      {degrees.map((degree, key) => (<Degree key={key} {...degree}/>))}
    </Section>
  );

}

const WorkExperience = () => {
  const WorkExperienceItem = ({ company, location, role, duration, highlights}: typeof work_experiences[number]) => {
    return (
      <article data-pdfmake={`{"marginBottom": 10}`}>
        <h2>
          <p data-pdfmake={`{"fontSize": 14, "lineHeight": 0.25}`}>{`${role}: ${company}, ${location}`}</p>
          <p data-pdfmake={`{"fontSize": 12, "lineHeight": 0.25}`}>{`${duration}`}</p>
        </h2>
        <ul>
          {highlights.map(({ description, link}, key) => (<li key={key}>{description}{link && <>{" "}<a href={link}>[{link}]</a></>}</li>))}
        </ul>
      </article>
    )
  }
  return (
    <Section id="work_experience" title="Work Experience">
      {work_experiences.map((work_experience, key) => (<WorkExperienceItem key={key} {...work_experience}/>))}
    </Section>
  );
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
    <Section id="skills" title="Skills">
      <table data-pdfmake={`{"widths": ["25%", "25%", "25%", "25%"]}`}>
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
    </Section>
  )
}

type ResumeTemplateContext = {
  pdfMake: boolean;
};

export const resumeTemplateContext = React.createContext<ResumeTemplateContext>({ pdfMake: false });

export function useResumeTemplate() {
	return React.useContext(resumeTemplateContext);
}

export const ResumeTemplate = ({pdfMake = false}) => {
   return (
      <resumeTemplateContext.Provider value={{ pdfMake }}>
        <div className="resume-template">
          <Contact/>
          <Degrees/>
          <WorkExperience/>
          <Skills/>
        </div>
      </resumeTemplateContext.Provider>
   );
}
