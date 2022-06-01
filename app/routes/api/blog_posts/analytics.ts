import type { ActionFunction } from "@remix-run/server-runtime";
import { getBlogPostById } from "~/models/blog_post.server";
import invariant from "tiny-invariant";
import { json } from "@remix-run/server-runtime";

import { logPageView } from "~/models/analytics.server";


export const action: ActionFunction = async ({ request, params }) => {

    let formData = await request.formData();

    let id: string | null = formData.get('id') as string;
    invariant(id, "no blog_post id provided");
    if (id) {
  
      const blogPost = await getBlogPostById({ id });
      if (!blogPost) {
        throw new Response("Not Found", { status: 404 });
      }

      let utm_source = formData.get('utm_source') as string;
      await logPageView({blogPostId: id, utm_source});
    
      return json({}, {status: 200});
    } else {
      return json({
        error: 'blog_post_id not found',
        status: 500
      })
    }
  };