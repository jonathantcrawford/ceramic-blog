import type { LinksFunction, LoaderFunction } from "remix";
import { useFetcher, useOutletContext, Link, useLoaderData, Outlet } from "@remix-run/react";
import { json, useSubmit, redirect } from "remix";
import { useEffect, useRef, useState } from "react";


import type { SelfID } from "@self.id/web";
import type { ModelTypes, BlogPostItem } from "~ceramic/models/types";
import type { ModelTypesToAliases } from "@glazed/types";


import easyMDEStyles from "easymde/dist/easymde.min.css"
import easyMDEFixStyles from "~/styles/misc/easymde-fix.css"



export const links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: easyMDEStyles },
        { rel: "stylesheet", href: easyMDEFixStyles}
    ];
};

export const loader: LoaderFunction = async ({ request, params }) => {

    return json({ blogPostId: params.blogPostId });
  };
  

export default function EditBlogPost() {

    const submit = useSubmit();

    const {blogPostId} = useLoaderData();

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
                    const blogPostItem = value?.next?.content.blogPosts.find((blogPost: BlogPostItem) => blogPost.id === `ceramic://${blogPostId}`)
                    const title = blogPostItem.title;
                    const subTitle = blogPostItem.subTitle;
                    const emoji = blogPostItem.emoji;
                    setTitle(title);
                    setSubTitle(subTitle);
                    setEmoji(emoji);
                } else {
                    setBlogPostItems(value.content.blogPosts);
                }
            });
            console.log(doc)



            const blogPost = await selfID?.client.tileLoader.load(blogPostId);
            easyMDE.current.value(blogPost?.content.mdx);

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

    const update = async () => {
        if (typeof document !== "undefined") {
        
        // const doc = await selfID?.client.dataModel.createTile(
        //     "BlogPost",
        //     {
        //     date: new Date().toISOString(),
        //     text: easyMDE.current.value(),
        //     }
        // );
        // if (doc) {
        //     selfID?.set("blogPosts", {
        //         blogPosts: [...blogPosts, { id: doc.id.toUrl(), title: title }],
        //     });
        // }

            const blogPost = await selfID?.client.tileLoader.load(blogPostId);

            blogPost?.update({
                ...blogPost?.content,
                mdx: easyMDE.current.value()
            })

            const blogPostItemsUpdates = blogPostItems.map((blogPostItem: BlogPostItem) => {
                if (blogPostItem.id === `ceramic://${blogPostId}`) {
                    return {
                        ...blogPostItem,
                        title: title,
                        subTitle: subTitle,
                        emoji: emoji,
                        date: new Date().toISOString()
                    }
                } else {
                    return blogPostItem
                }
            })

            await selfID?.set("blogPosts", {
                blogPosts: [...blogPostItemsUpdates]
            });

            submit(null, {method: 'get', action: '/admin'});
        
        }

    };



    

    return (
        <>
        <div className="flex-[1_1_auto]">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
            <input type="text" value={emoji} onChange={(e) => setEmoji(e.target.value)} />
            <button onClick={() => update()}>update</button>
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