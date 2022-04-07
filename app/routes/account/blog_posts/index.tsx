import { Form, useLoaderData, Outlet, Link, NavLink } from "@remix-run/react";

import { json, redirect } from "@remix-run/server-runtime"
import type { LoaderFunction, ActionFunction } from "@remix-run/server-runtime";

import { PostLinks } from "~/components/PostLinks/PostLinks";
 
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getBlogPostListItemsByUserId, createBlogPost } from "~/models/blog_post.server";

import cuid from "cuid";

type LoaderData = {
  blogPostListItems: Awaited<ReturnType<typeof getBlogPostListItemsByUserId>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const blogPostListItems = await getBlogPostListItemsByUserId({ userId });
  return json<LoaderData>({ blogPostListItems });
};

export const action: ActionFunction = async ({request}) => {
  const userId = await requireUserId(request);
  const result = await createBlogPost({userId, slug: cuid(), title: '', subTitle: '', emoji: '', body: '', status: 'draft'});
  if (result?.blogPost) {
    return redirect(`/account/blog_posts/${result?.blogPost?.id}`)
  } else {
    return json({ errors: result?.errors  }, {status: 500});
  }
}

export default function AllBlogPosts() {
  const data = useLoaderData() as LoaderData;

  return (
    <div className="flex h-full min-h-screen flex-col p-8">
          <Form method="post"> 
            <button type="submit" className="mb-8 block text-lg font-saygon text-yellow-100"> + New Blog Post</button>
          </Form>

          {data.blogPostListItems.length === 0 ? (
            <p className="p-4">No blog posts yet</p>
          ) : (
            <PostLinks title={'Drafts'} linkPrefix={''} posts={data.blogPostListItems.filter(blogPost => blogPost.status === 'draft')} linkAttribute={'id'}/>
          )}

          {data.blogPostListItems.length === 0 ? (
            <p className="p-4">No blog posts yet</p>
          ) : (
            <PostLinks title={'Published'} linkPrefix={''} posts={data.blogPostListItems.filter(blogPost => blogPost.status === 'published')} linkAttribute={'id'}/>
          )}
    </div>
  );
}
