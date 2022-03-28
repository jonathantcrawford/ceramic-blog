import { useEffect, useState, useMemo } from "react";
import { Core, PublicID } from '@self.id/core';

import { json, useLoaderData } from "remix";
import type { LinksFunction, LoaderFunction, MetaFunction } from "remix";

import publishedModel from "~ceramic/models/model.json";
import type { ModelTypes, BlogPost } from "~ceramic/models/types";
import type { ModelTypesToAliases } from "@glazed/types";

import { compileMDX } from "~/compile-mdx.server";
import invariant from "tiny-invariant";
import { getMDXComponent, mdxComponents } from "~/mdx";


import { PostHeader } from "~/components/PostHeader/PostHeader";
import { getBlogPostBySlug } from "~/models/blog_post.server";


type LoaderData = {
  code: string;
  blogPost: Omit<Awaited<ReturnType<typeof getBlogPostBySlug>>, "body">;
};



export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.slug, "blog_post_id not found");
  const blogPost = await getBlogPostBySlug({slug: params.slug});

  if (!blogPost) {
    throw new Response("Not Found", { status: 404 });
  }

  const { code } = await compileMDX({mdxSource: blogPost.body});
  return json<LoaderData>({ code, blogPost: {title: blogPost.title, subTitle: blogPost.subTitle, date: blogPost.updatedAt, emoji: blogPost.emoji} });
};

export const meta: MetaFunction = ({data}) => {
  const { code, blogPost: {title, subTitle: description, date, emoji, slug} } = data;

  return {
    title,
    description,
    keywords: "developer,dev,blog",
    "og:url": `https://joncrawford.me/blog/${slug}`,
    "og:type": "website",
    "og:title": title,
    "og:description": description,
    "og:image:type": "image/png",
    "og:image": "https://joncrawford.me/static/images/blog/og-preview.png",
    "twitter:image": "https://joncrawford.me/static/images/blog/og-preview.png",
    "twitter:url": `https://joncrawford.me/blog/${slug}`,
    "twitter:card": "summary_large_image",
    "twitter:creator": "@jon_t_craw",
    "twitter:site": "@jon_t_craw",
    "twitter:title": title,
    "twitter:description": description
  };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📖</text></svg>",
    },
  ];
};

export default function Slug() {
    const { code, blogPost: {title, subTitle, date, emoji} } = useLoaderData();

    const Component = useMemo(() => getMDXComponent(code), [code]);


    return (
        <div className="grid-in-ga-content w-full">
            <PostHeader info={{title, subTitle, date, emoji}}/>
            <Component components={mdxComponents}/>
        </div>
    )
}