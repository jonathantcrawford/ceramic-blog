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
                    const blogPostItem = value?.content.blogPosts.find((blogPost: BlogPostItem) => blogPost.id === `ceramic://${blogPostId}`)
                    const title = blogPostItem.title;
                    const subTitle = blogPostItem.subTitle;
                    const emoji = blogPostItem.emoji;
                    setTitle(title);
                    setSubTitle(subTitle);
                    setEmoji(emoji);
                }
            });



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
        <div className="flex-[1_1_auto] flex flex-col items-center p-4">
            <div className="flex-[1_1_auto] flex flex-row w-full justify-between mb-4">
                <Link className="btn" to="../">back to admin</Link>
                <button className="btn" onClick={() => update()}>update</button>
            </div>
            
            <div className="flex-[1_1_auto] flex flex-row w-full">
                    <div className="flex flex-col flex-[0_0_auto] w-[60px] mr-8">
                        <label htmlFor="emoji" className="bg-black-100 text-yellow-100 font-saygon text-lg mb-2">Emoji</label>
                        <input name="emoji" type="text" className="text-center bg-black-100 text-yellow-100 font-saygon text-lg focus:text-pink-200 focus:outline-none border-2 border-yellow-100  focus-visible:border-pink-200 rounded-lg p-2" value={emoji} onChange={(e) => setEmoji(e.target.value)} />
                    </div>

                    <div className="flex flex-col flex-[1_1_auto] w-auto">
                        <label htmlFor="title" className="bg-black-100 text-yellow-100 font-saygon text-lg mb-2">Title</label>
                        <input name="title" type="text" className="bg-black-100 text-yellow-100 font-saygon text-lg focus:text-pink-200 focus:outline-none border-2 border-yellow-100  focus-visible:border-pink-200 rounded-lg p-2" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
            </div>
            <div className="flex-[1_1_auto] flex flex-col w-full">
                <label htmlFor="subTitle" className="bg-black-100 text-yellow-100 font-saygon text-lg mb-2">Subtitle</label>
                <input name="subTitle" type="text" className="bg-black-100 text-yellow-100 font-saygon text-lg focus:text-pink-200 focus:outline-none border-2 border-yellow-100  focus-visible:border-pink-200 rounded-lg p-2" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
            </div>

            
        </div>
        <div className="flex-[8_8_auto] grid grid-cols-[30vw_70vw]">
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