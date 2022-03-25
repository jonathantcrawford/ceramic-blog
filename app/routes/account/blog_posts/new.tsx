import * as React from "react";
import { Form, json, redirect, useActionData, useFetcher } from "remix";
import type { ActionFunction } from "remix";
import Alert from "@reach/alert";

import { createBlogPost } from "~/models/blog_post.server";
import { requireUserId } from "~/session.server";
import { mdxComponents, getMDXComponent } from "~/mdx";

type ActionData = {
  errors?: {
    title?: string;
    subTitle?: string;
    slug?: string;
    emoji?: string;
    body?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const subTitle = formData.get("subTitle");
  const slug = formData.get("slug");
  const emoji = formData.get("emoji");
  const body = formData.get("body");
  const date = (new Date()).toDateString();


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

  await createBlogPost({ title, body, subTitle, slug, emoji, date, userId });

  return redirect(`/account`);
};

export default function NewNotePage() {
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const subTitleRef = React.useRef<HTMLInputElement>(null);
  const slugRef = React.useRef<HTMLInputElement>(null);
  const emojiRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  const fetcher = useFetcher();

  const Component = React.useMemo(() => fetcher?.data?.code ? getMDXComponent(fetcher.data.code) : () => null, [fetcher]);

  



  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div className="text-right">
        <button
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
              name="body"
              rows={8}
              onChange={(e) => fetcher.submit({mdxSource: e.target.value}, {method: 'post', action: '/mdx'})}
              className="w-full bg-black-100 text-yellow-100 font-saygon text-lg focus:text-pink-200 focus:outline-none border-2 border-yellow-100  focus-visible:border-pink-200 rounded-lg p-2"
              aria-invalid={actionData?.errors?.body ? true : undefined}
              aria-errormessage={
                actionData?.errors?.body ? "body-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.body && (
            <Alert className="pt-1 text-red-100 font-saygon text-md" id="body=error">
              {actionData.errors.body}
            </Alert>
          )}
        </div>

        <div className="w-[50vw]">
            <Component components={mdxComponents}/>
        </div>
      </div>
    </Form>
  );
}
