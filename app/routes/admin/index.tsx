import type { LinksFunction } from "remix";
import { useFetcher, useOutletContext, Link } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { compileMDX } from "~/compile-mdx.server";

import type { SelfID } from "@self.id/web";
import type { ModelTypes, BlogPostItem } from "~ceramic/models/types";
import type { ModelTypesToAliases } from "@glazed/types";

import { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";

import easyMDEStyles from "easymde/dist/easymde.min.css"




export const links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: easyMDEStyles },
    ];
  };

export default function Editor() {

    const {selfID}: {selfID: SelfID<ModelTypes> | undefined} = useOutletContext();

    const [blogPosts, setBlogPosts] = useState<BlogPostItem[]>([]);

    const [profileData, setProfileData] = useState(null);

    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [text, setText] = useState("");

    useEffect(() => {
        const syncProfileData = async () => {
            const basicProfileDefinitionID = await selfID?.client.dataModel.getDefinitionID("basicProfile");
            console.log({basicProfileDefinitionID})
            const doc = await selfID?.client.dataStore.getRecordDocument(
                basicProfileDefinitionID as string
            );
            doc?.subscribe((value: any) => setProfileData(value?.next?.content));
        }

        const syncBlogPosts = async () => {
            const blogPostDefinitionID =
              await selfID?.client.dataModel.getDefinitionID("blogPosts");
            const doc = await selfID?.client.dataStore.getRecordDocument(
              blogPostDefinitionID as string
            );
            doc?.subscribe((value) => {
                if (value?.next) {
                    setBlogPosts(value?.next?.content.blogPosts);
                } else {
                    setBlogPosts(value.content.blogPosts);
                }
            });
            console.log(doc)

            //const blogPosts = await selfID?.get("blogPosts");

            //setBlogPosts(blogPosts?.blogPosts);
            // if (blogPosts) {
            //       const blogPost = await self.client.tileLoader.load(blogPosts?.blogPosts[0].id);
            //      console.log(blogPost);
            //      //setBlogPosts(blogPost);
            // //}
        }
        if (selfID) {
            syncProfileData();
            syncBlogPosts();
        }
    },[selfID])


    return (
        <div className="h-5/6 grid grid-cols-[50vw_50vw]">
            <div>{JSON.stringify(profileData)}</div>
            <div className="flex flex-col">{blogPosts && blogPosts.map((blogPost) => (
                <Link key={blogPost.id.replace(/ceramic:\/\//g, '')} to={`editor/${blogPost.id.replace(/ceramic:\/\//g, '')}`}>{blogPost.title}</Link>
            ))}
                <Link key="new" to={'editor/new'}>new</Link>
            </div>
        </div>   
    )
}