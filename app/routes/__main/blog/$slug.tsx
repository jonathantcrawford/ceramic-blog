import { useEffect, useMemo } from "react";

import { useLoaderData, NavLink, useFetcher } from "@remix-run/react";
import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
 
import { compileMDX } from "~/compile-mdx.server";
import invariant from "tiny-invariant";
import { getMDXComponent, mdxComponents } from "~/mdx";

import { PostHeader } from "~/components/PostHeader/PostHeader";
import { BlogPost, getBlogPostBySlug } from "~/models/blog_post.server";



type LoaderData = {
  code: string;
  blogPost: Pick<BlogPost, "id"| "title" | "subTitle" | "updatedAt" | "emoji" | "slug" | "previewImageUrl">;
};



export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.slug, "blog_post_id not found");
  const blogPost = await getBlogPostBySlug({slug: params.slug});

  if (!blogPost) {
    throw new Response("Not Found", { status: 404 });
  }

  const { code } = await compileMDX({mdxSource: blogPost.body});
  return json<LoaderData>({ code, blogPost });
};

export const meta: MetaFunction = ({data}) => {
  
  if (data) {
    const { blogPost: {title, subTitle: description, slug, previewImageUrl} } = data;
    return {
      title,
      description,
      keywords: "developer,dev,blog",
      "og:url": `https://joncrawford.me/blog/${slug}`,
      "og:type": "website",
      "og:title": title,
      "og:description": description,
      "og:image:type": "image/png",
      "og:image": previewImageUrl,
      "twitter:image": previewImageUrl,
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
    const { code, blogPost: {id, title, subTitle, updatedAt, emoji} } = useLoaderData<LoaderData>();

    const fetcher = useFetcher();




    useEffect(() => {
      if (typeof document !== "undefined") {
        const params = new Proxy(new URLSearchParams(window.location.search), {
          get: (searchParams: any, prop: any) => searchParams.get(prop) ?? '',
        });
        fetcher.submit({id, utm_source: params.utm_source}, {method: 'post', action: '/api/blog_posts/analytics'})
      }
    }, [])


    const Component = useMemo(() => getMDXComponent(code), [code]);

    return (
      <>
        <NavLink
          prefetch="intent"
          to="/blog"
          className="grid-in-ga-sidebar no-underline text-yellow-100 hover:text-yellow-200 font-saygon text-lg mb-2"
        >{`< all posts`}</NavLink>
        <div className="grid-in-ga-content w-full markdown">
            <PostHeader info={{title, subTitle, updatedAt, emoji}}/>
            <Component components={mdxComponents}/>
        </div>
      </>
    )
}