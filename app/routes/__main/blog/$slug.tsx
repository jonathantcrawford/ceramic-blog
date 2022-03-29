import { useMemo } from "react";

import { json, useLoaderData } from "remix";
import type { LinksFunction, LoaderFunction, MetaFunction } from "remix";

import { compileMDX } from "~/compile-mdx.server";
import invariant from "tiny-invariant";
import { getMDXComponent, mdxComponents } from "~/mdx";

import { PostHeader } from "~/components/PostHeader/PostHeader";
import { BlogPost, getBlogPostBySlug } from "~/models/blog_post.server";


type LoaderData = {
  code: string;
  blogPost: Pick<BlogPost, "title" | "subTitle" | "updatedAt" | "emoji" | "slug">;
};



export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.slug, "blog_post_id not found");
  const blogPost = await getBlogPostBySlug({slug: params.slug});

  console.log(blogPost);
  if (!blogPost) {
    throw new Response("Not Found", { status: 404 });
  }

  const { code } = await compileMDX({mdxSource: blogPost.body});
  return json<LoaderData>({ code, blogPost: {title: blogPost.title, subTitle: blogPost.subTitle, updatedAt: blogPost.updatedAt, emoji: blogPost.emoji, slug: params.slug} });
};

export const meta: MetaFunction = ({data}) => {
  
  if (data) {
    const { blogPost: {title, subTitle: description, slug} } = data;
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
  } else {
    return {
      title: '',
      description: '',
      keywords: '',
      "og:url": '',
      "og:type": '',
      "og:title": '',
      "og:description": '',
      "og:image:type": '',
      "og:image": '',
      "twitter:image": '',
      "twitter:url": '',
      "twitter:card": '',
      "twitter:creator": '',
      "twitter:site": '',
      "twitter:title": '',
      "twitter:description": ''
    }
  }

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
    const { code, blogPost: {title, subTitle, updatedAt, emoji} } = useLoaderData();

    const Component = useMemo(() => getMDXComponent(code), [code]);

    return (
        <div className="grid-in-ga-content w-full">
            <PostHeader info={{title, subTitle, updatedAt, emoji}}/>
            <Component components={mdxComponents}/>
        </div>
    )
}