import { useEffect, useState, useMemo } from "react";
import { Core, PublicID } from '@self.id/core';

import { json, useLoaderData } from "remix";
import type { LinksFunction } from "remix";

import publishedModel from "~ceramic/models/model.json";
import type { ModelTypes, BlogPost } from "~ceramic/models/types";
import type { ModelTypesToAliases } from "@glazed/types";

import { compileMDX } from "~/compile-mdx.server";

import { getMDXComponent } from "mdx-bundler/client";


import { PostHeader } from "~/components/PostHeader/PostHeader";


import styles from "@jontcrawford/snippets/dist/main.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};



export const loader = async ({ params }: any) => {


    const model: ModelTypesToAliases<ModelTypes> = publishedModel;
    const core = new Core<ModelTypes>({ ceramic: 'testnet-clay', model });
    const blogOwnerID = await new PublicID({core, id: 'did:3:kjzl6cwe1jw147j8id1v2ovge4mgdu7luvpuiw34qg5ixc4zixa0qpza4kpruf6'});
    const [blogPostsDocument] = await Promise.all([
      blogOwnerID.get('blogPosts'),
    ]);


    const blogPostDocument = blogPostsDocument?.blogPosts.find(blogPost => blogPost.id === `ceramic://${params.did}`);
    const {title, subTitle, date, emoji} = blogPostDocument ?? {title: '', subTitle: '', date: '', emoji: ''};

    const tileDocument = await core.tileLoader.load(params.did);
    const { code } = await compileMDX({mdxSource: tileDocument.content.mdx});
    return json({ code, title, subTitle, date, emoji });
};

export default function Did() {
    const { code, title, subTitle, date, emoji } = useLoaderData();

    const Component = useMemo(() => getMDXComponent(code), [code]);


    return (
        <div className="grid-in-ga-content w-100p markdown">
            <PostHeader info={{title, subTitle, date, emoji}}/>
            <Component/>
        </div>
    )
}