import type { LinksFunction, LoaderFunction } from "remix";
import { useFetcher, useOutletContext, Link, useLoaderData, useSubmit, Outlet } from "@remix-run/react";
import { json } from "remix";
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
        { rel: "stylesheet", href: easyMDEStyles }
    ];
};


export default function CreateBlogPost() {

    const submit = useSubmit();


    const {selfID}: {selfID: SelfID<ModelTypes> | undefined} = useOutletContext();

    const [blogPostItems, setBlogPostItems] = useState<BlogPostItem[]>([]);

    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [emoji, setEmoji] = useState("");

    useEffect(() => {
        const syncBlogPosts = async () => {
            const blogPostDefinitionID =
              await selfID?.client.dataModel.getDefinitionID("blogPosts");
            const doc = await selfID?.client.dataStore.getRecordDocument(
              blogPostDefinitionID as string
            );
            doc?.subscribe((value) => {
                if (value?.next) {
                    setBlogPostItems(value?.next?.content.blogPosts);
                    const title = value?.next?.content.blogPosts.find((blogPost: BlogPostItem) => blogPost.id === `ceramic://${blogPostId}`).title;
                    setTitle(title);
                } else {
                    setBlogPostItems(value.content.blogPosts);
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
            syncBlogPosts();
        }
    },[selfID])

    const fetcher = useFetcher();


    const easyMDE = useRef<any>();

    useEffect(()=> {
        const loadMDE = async () => {
            if (!easyMDE.current) {
                if (typeof document !== 'undefined') {
                    const module = await import('easymde');
                    //@ts-ignore
                    easyMDE.current = new module.default({
                        element: document.getElementById('text-editor'),
                        lineWrapping: false,
                        lineNumbers: true,
                        toolbar: false,
                        status: false
                    });

                    easyMDE.current.codemirror.on("change", () => {
                        fetcher.submit({mdxSource: easyMDE.current.value()}, {method: 'post', action: '/mdx'});
                    });
                }
            }
        }

        loadMDE()
    },[easyMDE]);

    const publish = async () => {
        if (typeof document !== "undefined") {
        
            const doc = await selfID?.client.dataModel.createTile(
                "BlogPost",
                {
                mdx: easyMDE.current.value(),
                }
            );
            if (doc) {
                await selfID?.set("blogPosts", {
                    blogPosts: [...blogPostItems, { 
                        id: doc.id.toUrl(), 
                        title: title,
                        date: new Date().toISOString(),
                        subTitle: subTitle,
                        emoji: emoji
                    }],
                });
                submit(null, {method: 'get', action: '/admin'});
            }


        }

    };

    return (
        <>
        <div className="flex-[1_1_auto]">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
            <input type="text" value={emoji} onChange={(e) => setEmoji(e.target.value)} />
            <button onClick={() => publish()}>publish</button>
        </div>
        <div className="flex-[8_8_auto] grid grid-cols-[50vw_50vw]">
            <div className="h-full">
                <textarea id="text-editor"></textarea>
            </div>
            <div className="h-full">
                <Outlet context={{code: fetcher?.data?.code, error: fetcher?.data?.error}}/>
            </div>
        </div>
        </>
    )
}