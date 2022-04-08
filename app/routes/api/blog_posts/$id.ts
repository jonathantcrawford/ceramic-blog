import type { LoaderFunction, ActionFunction } from "@remix-run/server-runtime";
import { getBlogPostById } from "~/models/blog_post.server";
import invariant from "tiny-invariant";
import type { BlogPost } from "~/models/blog_post.server";
import { json } from "@remix-run/server-runtime";

type LoaderData = Pick<BlogPost, "title" | "subTitle" | "slug" | "emoji" | "createdAt" | "updatedAt"> | {
    error?: string;
  };

export const loader: LoaderFunction = async ({ request, params }) => {

    invariant(params.id, "no blog_post id provided");
    if (params.id) {
      
  
      const blogPost = await getBlogPostById({ id: params.id });
      if (!blogPost) {
        throw new Response("Not Found", { status: 404 });
      }
    
      return json<LoaderData>({ ...blogPost });
    } else {
      return json<LoaderData>({
        error: 'blog_post_id not found'
      })
    }
  };