import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import type { BlogPost } from "~/models/blog_post.server";

type MetaDataProps = {
    blogPostId: string;
    render: ({...blogPost}: Pick<BlogPost, "title" | "subTitle" | "emoji" | "createdAt" | "updatedAt">) => JSX.Element;
}

export const MetaData = ({blogPostId, render}: MetaDataProps) => {
    const fetcher = useFetcher<BlogPost>();
    useEffect(() => {
        fetcher.load(`/api/blog_posts/${blogPostId}`);
    }, []);

    if (fetcher?.data) {
        return render({...fetcher?.data});
    } else {
        return render({
            title: '',
            subTitle: '',
            emoji: '',
            createdAt: '',
            updatedAt: '',
        })
    }

    
}