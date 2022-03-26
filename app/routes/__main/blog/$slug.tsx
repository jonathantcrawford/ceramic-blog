import { useEffect, useState, useMemo } from "react";
import { Core, PublicID } from '@self.id/core';

import { json, useLoaderData } from "remix";
import type { LinksFunction, LoaderFunction } from "remix";

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
  return json<LoaderData>({ code, blogPost: {title: blogPost.title, subTitle: blogPost.subTitle, date: blogPost.date, emoji: blogPost.emoji} });
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