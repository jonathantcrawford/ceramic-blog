import type { LinksFunction } from "remix";
import { useFetcher, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { compileMDX } from "~/compile-mdx.server";

import { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";

import easyMDEStyles from "easymde/dist/easymde.min.css"

import styles from "@jontcrawford/snippets/dist/main.css";


import "@jontcrawford/snippets";


export const links: LinksFunction = () => {
    return [
        { rel: "stylesheet", href: easyMDEStyles },
        { rel: "stylesheet", href: styles },
    ];
  };

export default function Editor() {

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
                        overlayMode: {
                            mode: {},
                            combine: false
                        },
                        previewRender: (plainText, preview) => { // Async method
                            setTimeout(() => {
                                fetcher.submit({mdxSource: plainText}, {method: 'post', action: '/mdx'});
                            }, 250);
                    
                            return "Loading...";
                        },
                    });
                }
            }
        }

        loadMDE()
    },[easyMDE]);



    const Component = useMemo(() => fetcher?.data?.code ? getMDXComponent(fetcher?.data?.code) : () => <div></div>, [fetcher]);

    return (
        <div className="grid grid-rows-[10vh_90vh]">
            <div>profile</div>
            <div className="grid grid-cols-[10vw_45vw_45vw]">
                <div>posts</div>
                <textarea id="text-editor"></textarea>
                <div className="container">
                    <Component/>
                </div>
            </div>

        </div>
        
    )
}