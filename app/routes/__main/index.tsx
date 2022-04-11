import type { MetaFunction, LinksFunction } from "@remix-run/server-runtime";


import { About } from "~/components/About/About";

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
    <div className="row-start-4 row-end-5 col-start-2 col-end-4 w-full">
      <About />
    </div>
  );
}
