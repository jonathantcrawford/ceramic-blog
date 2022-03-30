import { LoaderFunction, ActionFunction, useFormAction } from "remix";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { redirect } from "remix";
import { json, useLoaderData, useCatch, Form, useFetcher, useActionData, Outlet, Link } from "remix";
import invariant from "tiny-invariant";
import type { BlogPost } from "~/models/blog_post.server";
import { deleteBlogPost, getBlogPostById, updateBlogPost, createBlogPost } from "~/models/blog_post.server";
import { requireUserId } from "~/session.server";
import Alert from "@reach/alert";

import { useMemo } from "react";
import { getMDXComponent, mdxComponents } from "~/mdx";
import {ErrorBoundary as ComponentErrorBoundary} from "react-error-boundary";

import { MultiActionButton } from "~/components/MultiActionButton/MultiActionButton";



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
  formType: 'create'| 'update';
  blogPost: Pick<BlogPost, "body" | "title" | "subTitle" | "slug" | "emoji" | "status">;
};


const EmojiField = React.forwardRef<any, any>(({actionData}: any, ref) => {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (actionData?.errors?.emoji) setDirty(false)
  }, [actionData]);

  return (
    <div className="grid-in-bpf-emoji">
    <label className="flex w-full flex-col gap-1">
      <span className="text-base text-yellow-100 font-saygon">Emoji: </span>
      <input
        ref={ref}
        name="emoji"
        onChange={() => {if(!dirty) setDirty(true)}}
        className="bg-black-100 text-yellow-100 font-saygon text-base focus:text-pink-200 focus:outline-none border-2 border-yellow-100  focus-visible:border-pink-200 rounded-lg p-2"
        aria-invalid={actionData?.errors?.emoji ? true : undefined}
        aria-errormessage={
          actionData?.errors?.emoji ? "emoji-error" : undefined
        }
      />
    </label>
    {!dirty && actionData?.errors?.emoji && (
      <Alert className="pt-1 text-red-100 font-saygon text-base" id="emoji=error">
        {actionData.errors.emoji}
      </Alert>
    )}
  </div>
  )
});

const TitleField = React.forwardRef<any, any>(({actionData}: any, ref: any) => {

  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (actionData?.errors?.title) setDirty(false)
  }, [actionData]);

  return (
    <div className="grid-in-bpf-title">
    <label className="flex w-full flex-col gap-1">
      <span className="text-base text-yellow-100 font-saygon">Title: </span>
      <input
        ref={ref}
        name="title"
        onChange={() => {if(!dirty) setDirty(true)}}
        className="bg-black-100 text-yellow-100 font-saygon text-base focus:text-pink-200 focus:outline-none border-2 border-yellow-100  focus-visible:border-pink-200 rounded-lg p-2"
        aria-invalid={actionData?.errors?.title ? true : undefined}
        aria-errormessage={
          actionData?.errors?.title ? "title-error" : undefined
        }
      />
    </label>
    {!dirty && actionData?.errors?.title && (
      <Alert className="pt-1 text-red-100 font-saygon text-base" id="title=error">
        {actionData.errors.title}
      </Alert>
    )}
  </div>
  )
});

const SubTitleField = React.forwardRef<any, any>(({actionData}: any, ref: any) => {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (actionData?.errors?.subTitle) setDirty(false)
  }, [actionData]);


  return (
    <div className="grid-in-bpf-subTitle">
    <label className="flex w-full flex-col gap-1">
      <span className="text-base text-yellow-100 font-saygon">Sub Title: </span>
      <input
        ref={ref}
        name="subTitle"
        onChange={() => {if(!dirty) setDirty(true)}}
        className="bg-black-100 text-yellow-100 font-saygon text-base focus:text-pink-200 focus:outline-none border-2 border-yellow-100  focus-visible:border-pink-200 rounded-lg p-2"
        aria-invalid={actionData?.errors?.subTitle ? true : undefined}
        aria-errormessage={
          actionData?.errors?.subTitle ? "subtTitle-error" : undefined
        }
      />
    </label>
    {!dirty && actionData?.errors?.subTitle && (
      <Alert className="pt-1 text-red-100 font-saygon text-base" id="subTitle=error">
        {actionData.errors.subTitle}
      </Alert>
    )}
  </div>
  )
});

const SlugField = React.forwardRef<any, any>(({actionData}: any, ref: any) => {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (actionData?.errors?.slug) setDirty(false)
  }, [actionData]);

  return (
    <div className="grid-in-bpf-slug">
    <label className="flex w-full flex-col gap-1">
      <span className="text-base text-yellow-100 font-saygon">Slug: </span>
      <input
        ref={ref}
        name="slug"
        onChange={() => {if(!dirty) setDirty(true)}}
        className="bg-black-100 text-yellow-100 font-saygon text-base focus:text-pink-200 focus:outline-none border-2 border-yellow-100  focus-visible:border-pink-200 rounded-lg p-2"
        aria-invalid={actionData?.errors?.slug ? true : undefined}
        aria-errormessage={
          actionData?.errors?.slug ? "slug-error" : undefined
        }
      />
    </label>
    {!dirty && actionData?.errors?.slug && (
      <Alert className="pt-1 text-red-100 font-saygon text-base" id="slug=error">
        {actionData.errors.slug}
      </Alert>
    )}
  </div>
  )
})

const BodyField = React.forwardRef(({actionData, autoSizeTextArea, fetcher, defaultValue}: any, ref: any) => {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (actionData?.errors?.body) setDirty(false)
  }, [actionData]);

  return (
    <div className="grid-in-bpf-body">
      <label className="flex w-full flex-col gap-1 h-full">
        <span className="text-base text-yellow-100 font-saygon">Body: </span>
        <div className="autoresize-textarea w-full text-base font-saygon bg-black-100 text-yellow-100 h-full">
          <textarea
            ref={ref}
            onChange={e => {
              if(!dirty) setDirty(true)
              autoSizeTextArea(e.target.value);
              fetcher.submit({mdxSource: e.target.value}, {method: 'post', action: '/mdx'})
            }}
            name="body"
            rows={8}
            defaultValue={defaultValue}
            aria-invalid={actionData?.errors?.body ? true : undefined}
            aria-errormessage={
              actionData?.errors?.body ? "body-error" : undefined
            }
          />
        </div>
      </label>
      {!dirty && actionData?.errors?.body && (
        <Alert className="pt-1 text-red-100 font-saygon text-base" id="body=error">
          {actionData.errors.body}
        </Alert>
      )}
    </div>
  )
})

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  return (
    <div role="alert" className="flex flex-col justify-start">
      <div className="text-red-100 font-saygon text-lg whitespace-pre-wrap mb-3">{error.message}</div>
      <div className="text-white-100 font-saygon text-md mb-3">Check your syntax and try to recompile.</div>
      <button className="btn self-center m-8" onClick={resetErrorBoundary}>Recompile</button>
    </div>
  );
};

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);
  if (params.id !== 'new') {
    invariant(params.id, "blog_post_id not found");

    const blogPost = await getBlogPostById({ id: params.id });
    if (!blogPost) {
      throw new Response("Not Found", { status: 404 });
    }
  
    return json<LoaderData>({ formType: 'update', blogPost });
  } else {
    return json<LoaderData>({
      formType: 'create',
      blogPost: {
        title: '',
        subTitle: '',
        slug: '',
        emoji: '',
        body: '',
        status: 'draft',
      }
    })
  }
};

export const action: ActionFunction = async ({ request, context, params }) => {
  const userId = await requireUserId(request);
  invariant(params.id, "blog_post_id not found");

  const formData = await request.formData();
  const _action = formData.get("_action");
  const title = formData.get("title");
  const subTitle = formData.get("subTitle");
  const slug = formData.get("slug");
  const status = formData.get("status");
  const emoji = formData.get("emoji");
  const body = formData.get("body");

  switch (_action) {
    case 'delete':
        await deleteBlogPost({ id: params.id });
        return redirect("/account");
    case 'save':
    case 'publish':
    case 'create':
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

      if (typeof status !== "string" || status.length === 0) {
        return json<ActionData>(
          { errors: { body: "Invalid status" } },
          { status: 400 }
        );
      }

      if (_action === 'create') {
        const result = await createBlogPost({ title, body, subTitle, slug, emoji, userId, status: 'draft' });
        if (result.errors) {
          return json<ActionData>(
            { errors: result?.errors },
            { status: 400 }
          );
        } else {
          return redirect(`/account/blog_posts/${result?.blogPost?.id}`)
        }
      } else {
        const result = await updateBlogPost({ id: params.id, title, body, subTitle, slug, emoji, userId, status: _action === 'publish' ? 'published' : status });
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
      
  }
};

export default function EditBlogPostPage() {
  const {formType, blogPost} = useLoaderData();

  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const subTitleRef = React.useRef<HTMLInputElement>(null);
  const slugRef = React.useRef<HTMLInputElement>(null);
  const emojiRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);
  const formPropagationBypassRef = React.useRef<HTMLDivElement>(null);


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

  const autoSizeTextArea = (replicatedValue: string) => {
    if (bodyRef?.current) {
      bodyRef?.current?.parentElement?.setAttribute('data-replicated-value', replicatedValue)
    }
  }

  const fetcher = useFetcher();

  React.useEffect(() => { 
    titleRef.current?.setAttribute("value", blogPost?.title);
    subTitleRef.current?.setAttribute("value", blogPost?.subTitle);
    slugRef.current?.setAttribute("value", blogPost?.slug);
    emojiRef.current?.setAttribute("value", blogPost?.emoji);
    autoSizeTextArea(blogPost?.body);
    fetcher.submit({mdxSource: blogPost?.body}, {method: 'post', action: '/mdx'});
  }, []);

  
  const Component = useMemo(() => 
    fetcher?.data?.code
    ? getMDXComponent(fetcher?.data?.code) 
    : () => (
      <div className="h-full text-red-100 text-md font-saygon flex items-center justify-center">
          {fetcher?.data?.error}
      </div>
      )
    , [fetcher?.data?.code, fetcher?.data?.error]);


  return (
    <>
    <Form
      method="post"
      className="grid grid-areas-blog-post-form grid-cols-blog-post-form grid-rows-blog-post-form min-h-screen gap-4 p-8 w-screen"
    >
      <div className="flex items-center w-full justify-between grid-in-bpf-header mb-4">
        <Link to="/account" className="text-yellow-100 text-lg font-saygon underline-none">Back To Account</Link>
        <input name="status" value={blogPost?.status} type="hidden"/>
        {formType === 'create' 
        ?
        <button
              key="create"
              name="_action"
              value="create"
              type="submit"
              className="btn"
            >
            Create
        </button>
        : <MultiActionButton
            primary={({className}: any) => (
              <button
                key="save"
                name="_action"
                value="save"
                type="submit"
                className={className}
              >
              Save
            </button>
            )}
            options={({className}: any) => [
              (blogPost?.status === 'draft' ? [(<button
                key="publish"
                name="_action"
                value="publish"
                type="submit"
                className={className}
              >
              Publish
              </button>)] : []),
              (<button
                key="delete"
                name="_action"
                value="delete"
                type="submit"
                className={className}
                >
                Delete
              </button>),
            ]}
          />
        }
      </div>

      <EmojiField ref={emojiRef} actionData={actionData}/>
      <TitleField ref={titleRef} actionData={actionData}/>
      <SlugField ref={slugRef} actionData={actionData}/>
      <SubTitleField ref={subTitleRef} actionData={actionData}/>
      <BodyField ref={bodyRef} actionData={actionData} autoSizeTextArea={autoSizeTextArea} fetcher={fetcher} defaultValue={blogPost?.body}/>
      <div className="grid-in-bpf-preview mt-6 markdown" ref={formPropagationBypassRef}></div>

    </Form>
    {formPropagationBypassRef?.current && ReactDOM.createPortal(
      <ComponentErrorBoundary
        FallbackComponent={ErrorFallback}
      >
        <Component components={mdxComponents}/>
      </ComponentErrorBoundary>
    , formPropagationBypassRef?.current)}
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
