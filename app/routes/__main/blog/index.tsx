import type { LinksFunction, MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";



import { PostLinks } from "~/components/PostLinks/PostLinks";
import { useEffect, useState } from "react";


export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📖</text></svg>",
    },
  ];
};

export const meta: MetaFunction = () => {
  const title = "Jon Crawford | Blog";
  const description = "A blog for various web development topics.";

  return {
    title,
    description,
    keywords: "developer,dev,blog",
    "og:url": "https://joncrawford.me/blog",
    "og:type": "website",
    "og:title": title,
    "og:description": description,
    "og:image:type": "image/png",
    "og:image": "https://joncrawford.me/static/images/blog/og-preview.png",
    "twitter:image": "https://joncrawford.me/static/images/blog/og-preview.png",
    "twitter:url": "https://joncrawford.me/blog",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@jon_t_craw",
    "twitter:site": "@jon_t_craw",
    "twitter:title": title,
    "twitter:description": description,
  };
};

export default function Index() {


  return (
    <div className="grid-in-ga-content w-full">
      <PostLinks />
     </div>
  )
}
