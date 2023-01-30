import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";
import type { MetaFunction, LinksFunction } from "@remix-run/server-runtime";


import { About } from "~/components/About/About";
import { ResumeTemplate } from "~/components/Resume/Resume";

export const links: LinksFunction = () => {
  return [{ rel: "icon", href: "/_static/favicon.png" }];
};


export const meta: MetaFunction = () => {
  const description = "My own dev blog for various topics.";
  const title = "Jon Crawford";
  return {
    title,
    description,
    keywords: "developer,dev,blog",
    "og:url": "https://joncrawford.me/",
    "og:type": "website",
    "og:title": title,
    "og:description": description,
    "og:image:type": "image/png",
    "og:image": "https://joncrawford.me/_static/og-preview.png",
    "twitter:image": "https://joncrawford.me/_static/og-preview.png",
    "twitter:url": "https://joncrawford.me/",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@jon_t_craw",
    "twitter:site": "@jon_t_craw",
    "twitter:title": title,
    "twitter:description": description,
  };
};

export default function Index() {


  return (
    <>
      <div className="grid-in-ga-sidebar w-full">
        <About />
      </div>
      <div className="grid-in-ga-content w-full">
        <Link to="/_static/jonathan_t_crawford_resume.pdf" reloadDocument target="_blank" className="font-saygon text-yellow-100 text-tiny">
          <FontAwesomeIcon icon={faLink} className="text-xs hover:no-underline"/>{" "}<span className="hover:underline">[jonathan_t_crawford_resume.pdf]</span>
        </Link>
        <ResumeTemplate/>
      </div>
    </>

  );
}
