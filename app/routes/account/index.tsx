import { Form, json, useLoaderData, Outlet, Link, NavLink } from "remix";
import type { LoaderFunction } from "remix";

import { PostLinks } from "~/components/PostLinks/PostLinks";
 
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getBlogPostListItems } from "~/models/blog_post.server";

type LoaderData = {
  blogPostListItems: Awaited<ReturnType<typeof getBlogPostListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const blogPostListItems = await getBlogPostListItems({ userId });
  return json<LoaderData>({ blogPostListItems });
};

export default function NotesPage() {
  const data = useLoaderData() as LoaderData;
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-saygon">
          <Link to=".">Account</Link>
        </h1>
        <p>{user.email}</p>
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
        <div className="h-full w-full p-8">
          <Link to="blog_posts/new" className="block p-4 text-xl font-saygon text-yellow-100">
            + New Blog Post
          </Link>

          <hr />

          {data.blogPostListItems.length === 0 ? (
            <p className="p-4">No blog posts yet</p>
          ) : (
            <PostLinks linkPrefix={'blog_posts/edit/'} posts={data.blogPostListItems}/>
          )}
        </div>
      </main>
    </div>
  );
}
