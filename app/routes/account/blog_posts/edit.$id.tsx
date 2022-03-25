import type { LoaderFunction, ActionFunction } from "remix";
import { redirect } from "remix";
import { json, useLoaderData, useCatch, Form } from "remix";
import invariant from "tiny-invariant";
import type { BlogPost } from "~/models/blog_post.server";
import { deleteBlogPost } from "~/models/blog_post.server";
import { getBlogPost } from "~/models/blog_post.server";
import { requireUserId } from "~/session.server";

import { getMDXComponent, mdxComponents } from "~/mdx";
import { useMemo } from "react";

import { compileMDX } from "~/compile-mdx.server";

type LoaderData = {
  blogPost: BlogPost;
  code: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.id, "blog_post_id not found");

  const blogPost = await getBlogPost({ userId, id: params.id });
  if (!blogPost) {
    throw new Response("Not Found", { status: 404 });
  }
  const { code } = await compileMDX({mdxSource: blogPost.body});
  return json<LoaderData>({ code, blogPost });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.id, "blog_post_id not found");

  await deleteBlogPost({ userId, id: params.id });

  return redirect("/account");
};

export default function NoteDetailsPage() {
  const {code, blogPost} = useLoaderData() as LoaderData;

  const Component = useMemo(() => code ? getMDXComponent(code) : () => null, [code]);

  return (
    <div>
      <h3 className="text-2xl font-bold">{blogPost.title}</h3>
      <Component components={mdxComponents}/>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="btn"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Blog Post not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
