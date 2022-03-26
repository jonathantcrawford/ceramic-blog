import { LoaderFunction, ActionFunction, useFormAction } from "remix";
import React from "react";
import ReactDOM from "react-dom";
import { redirect } from "remix";
import { json, useLoaderData, useCatch, Form, useFetcher, useActionData, Outlet } from "remix";
import invariant from "tiny-invariant";
import type { BlogPost } from "~/models/blog_post.server";
import { deleteBlogPost, getBlogPostById, updateBlogPost } from "~/models/blog_post.server";
import { requireUserId } from "~/session.server";
import Alert from "@reach/alert";

type ActionData = {
  blogPost?: Omit<BlogPost, "createdAt">,
  errors?: {
    title?: string;
    subTitle?: string;
    slug?: string;
    emoji?: string;
    body?: string;
  };
};

type LoaderData = {
  blogPost: Omit<BlogPost, "userId">;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);
  invariant(params.id, "blog_post_id not found");

  const blogPost = await getBlogPostById({ id: params.id });
  if (!blogPost) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ blogPost });
};

export const action: ActionFunction = async ({ request, context, params }) => {
  const userId = await requireUserId(request);
  invariant(params.id, "blog_post_id not found");

  console.log({request, context, params})

  const formData = await request.formData();
  const _action = formData.get("_action");
  const title = formData.get("title");
  const subTitle = formData.get("subTitle");
  const slug = formData.get("slug");
  const emoji = formData.get("emoji");
  const body = formData.get("body");

  switch (_action) {
    case 'delete':
        await deleteBlogPost({ id: params.id });
        return redirect("/account");
    case 'update':
    default:
      if (typeof title !== "string" || title.length === 0) {
        return json<ActionData>(
          { errors: { title: "Title is required" } },
          { status: 400 }
        );
      }
    
      if (typeof subTitle !== "string" || subTitle.length === 0) {
        return json<ActionData>(
          { errors: { subTitle: "Sub Title is required" } },
          { status: 400 }
        );
      }
    
      if (typeof slug !== "string" || slug.length === 0) {
        return json<ActionData>(
          { errors: { slug: "Slug is required" } },
          { status: 400 }
        );
      }
    
      if (typeof emoji !== "string" || emoji.length === 0) {
        return json<ActionData>(
          { errors: { emoji: "Emoji is required" } },
          { status: 400 }
        );
      }
    
      if (typeof body !== "string" || body.length === 0) {
        return json<ActionData>(
          { errors: { body: "Body is required" } },
          { status: 400 }
        );
      }

      const result = await updateBlogPost({ id: params.id, title, body, subTitle, slug, emoji, userId });
    
      if (result.errors) {
        return json<ActionData>(
          { errors: result?.errors },
          { status: 400 }
        );
      } else {
        return json<ActionData>(
          { blogPost: result.blogPost},
          { status: 200 }
        )
      }
    
  }
};

export default function EditBlogPostPage() {
  const {blogPost} = useLoaderData();

  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const subTitleRef = React.useRef<HTMLInputElement>(null);
  const slugRef = React.useRef<HTMLInputElement>(null);
  const emojiRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);


  const formPropationByPassRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.subTitle) {
      subTitleRef.current?.focus();
    } else if (actionData?.errors?.slug) {
      slugRef.current?.focus();
    } else if (actionData?.errors?.emoji) {
      emojiRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    } 
  }, [actionData]);

  React.useEffect(() => { 
    titleRef.current?.setAttribute("value", blogPost?.title);
    subTitleRef.current?.setAttribute("value", blogPost?.subTitle);
    slugRef.current?.setAttribute("value", blogPost?.slug);
    emojiRef.current?.setAttribute("value", blogPost?.emoji);
  }, []);

  const fetcher = useFetcher();


  return (
    <>
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
        <button
          name="_action"
          value="delete"
          type="submit"
          className="btn"
        >
          Delete
        </button>
      <div className="text-right">
        <button
          name="_action"
          value="update"
          type="submit"
          className="btn"
        >
          Save
        </button>
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span className="text-base text-yellow-100 font-saygon">Title: </span>
          <input
            ref={titleRef}
            name="title"
            className="bg-black-100 text-yellow-100 font-saygon text-lg focus:text-pink-200 focus:outline-none border-2 border-yellow-100  focus-visible:border-pink-200 rounded-lg p-2"
            aria-invalid={actionData?.errors?.title ? true : undefined}
            aria-errormessage={
              actionData?.errors?.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.title && (
          <Alert className="pt-1 text-red-100 font-saygon text-md" id="title=error">
            {actionData.errors.title}
          </Alert>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span className="text-base text-yellow-100 font-saygon">Sub Title: </span>
          <input
            ref={subTitleRef}
            name="subTitle"
            className="bg-black-100 text-yellow-100 font-saygon text-lg focus:text-pink-200 focus:outline-none border-2 border-yellow-100  focus-visible:border-pink-200 rounded-lg p-2"
            aria-invalid={actionData?.errors?.subTitle ? true : undefined}
            aria-errormessage={
              actionData?.errors?.subTitle ? "subtTitle-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.subTitle && (
          <Alert className="pt-1 text-red-100 font-saygon text-md" id="subTitle=error">
            {actionData.errors.subTitle}
          </Alert>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span className="text-base text-yellow-100 font-saygon">Slug: </span>
          <input
            ref={slugRef}
            name="slug"
            className="bg-black-100 text-yellow-100 font-saygon text-lg focus:text-pink-200 focus:outline-none border-2 border-yellow-100  focus-visible:border-pink-200 rounded-lg p-2"
            aria-invalid={actionData?.errors?.slug ? true : undefined}
            aria-errormessage={
              actionData?.errors?.slug ? "slug-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.slug && (
          <Alert className="pt-1 text-red-100 font-saygon text-md" id="slug=error">
            {actionData.errors.slug}
          </Alert>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span className="text-base text-yellow-100 font-saygon">Emoji: </span>
          <input
            ref={emojiRef}
            name="emoji"
            className="bg-black-100 text-yellow-100 font-saygon text-lg focus:text-pink-200 focus:outline-none border-2 border-yellow-100  focus-visible:border-pink-200 rounded-lg p-2"
            aria-invalid={actionData?.errors?.emoji ? true : undefined}
            aria-errormessage={
              actionData?.errors?.emoji ? "emoji-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.emoji && (
          <Alert className="pt-1 text-red-100 font-saygon text-md" id="emoji=error">
            {actionData.errors.emoji}
          </Alert>
        )}
      </div>

      <div className="flex">
        <div className="w-[50vw]">
          <label className="flex w-full flex-col gap-1">
            <span className="text-base text-yellow-100 font-saygon">Body: </span>
            <textarea
              ref={bodyRef}
              onChange={e => fetcher.submit({mdxSource: e.target.value}, {method: 'post', action: '/mdx'})}
              name="body"
              rows={8}
              className="w-full bg-black-100 text-yellow-100 font-saygon text-lg focus:text-pink-200 focus:outline-none border-2 border-yellow-100  focus-visible:border-pink-200 rounded-lg p-2"
              aria-invalid={actionData?.errors?.body ? true : undefined}
              aria-errormessage={
                actionData?.errors?.body ? "body-error" : undefined
              }
            >{blogPost?.body}</textarea>
          </label>
          {actionData?.errors?.body && (
            <Alert className="pt-1 text-red-100 font-saygon text-md" id="body=error">
              {actionData.errors.body}
            </Alert>
          )}
        </div>

        <div className="w-[50vw]" ref={formPropationByPassRef}></div>
      </div>
    </Form>
    {formPropationByPassRef?.current && ReactDOM.createPortal(<Outlet context={{code: fetcher?.data?.code, error: fetcher?.data?.error}}/>, formPropationByPassRef?.current)}
    </>
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
