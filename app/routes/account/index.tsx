import { Form, json, useLoaderData, Outlet, Link, NavLink } from "remix";
import type { LoaderFunction } from "remix";

import { PostLinks } from "~/components/PostLinks/PostLinks";
 
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getBlogPostListItemsByUserId } from "~/models/blog_post.server";

type LoaderData = {
  blogPostListItems: Awaited<ReturnType<typeof getBlogPostListItemsByUserId>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const blogPostListItems = await getBlogPostListItemsByUserId({ userId });
  return json<LoaderData>({ blogPostListItems });
};

export default function NotesPage() {
  const data = useLoaderData() as LoaderData;
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col p-8">
      <header className="flex items-center justify-between bg-slate-800 text-white mb-4">
        <div className="text-white-100 text-3xl font-saygon">
          <Link to=".">Account</Link>
        </div>
        <div className="text-white-100 text-2xl font-saygon">{user.email}</div>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="btn"
          >
            Logout
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-full">
          <Link to="blog_posts/new" className="mb-8 block text-lg font-saygon text-yellow-100">
            + New Blog Post
          </Link>

          {data.blogPostListItems.length === 0 ? (
            <p className="p-4">No blog posts yet</p>
          ) : (
            <PostLinks title={'Drafts'} linkPrefix={'blog_posts/'} posts={data.blogPostListItems.filter(blogPost => blogPost.status === 'draft')} linkAttribute={'id'}/>
          )}

          {data.blogPostListItems.length === 0 ? (
            <p className="p-4">No blog posts yet</p>
          ) : (
            <PostLinks title={'Published'} linkPrefix={'blog_posts/'} posts={data.blogPostListItems.filter(blogPost => blogPost.status === 'published')} linkAttribute={'id'}/>
          )}
        </div>
      </main>
    </div>
  );
}
