import type { LoaderFunction, ActionFunction } from "@remix-run/server-runtime";
import { useFormAction, useLoaderData, useCatch, Form, useFetcher, useActionData, Outlet, Link } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { redirect, json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import type { BlogPost } from "~/models/blog_post.server";
import { deleteBlogPost, getBlogPostById, updateBlogPostContent } from "~/models/blog_post.server";
import { requireUserId } from "~/session.server";
import Alert from "@reach/alert";

import { useMemo } from "react";
import { getMDXComponent, mdxComponents } from "~/mdx";
import {ErrorBoundary as ComponentErrorBoundary} from "react-error-boundary";

import { MultiActionButton } from "~/components/MultiActionButton/MultiActionButton";

import "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";



type ActionData = {
  blogPost?: Pick<BlogPost, "title" | "subTitle" | "emoji" | "body">,
  errors?: {
    title?: string;
    subTitle?: string;
    emoji?: string;
    body?: string;
    slug?: string;
    previewImageMDX?: string;
  };
};

type LoaderData = {
  formType?: 'create'| 'update';
  blogPost?: Pick<BlogPost, "body" | "title" | "subTitle" | "slug" | "emoji" | "status">;
  error?: string;
};



const PreviewImageMDXField = React.forwardRef(({actionData, autoSizeTextArea, fetcher, defaultValue, blogPostId}: any, ref: any) => {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (actionData?.errors?.body) setDirty(false)
  }, [actionData]);

  return (
    <div className="grid-in-bpf-preview-img-mdx">
        <label className="flex w-full flex-col gap-1 h-full">
        <span className="text-base text-yellow-100 font-saygon">Preview Image MDX: </span>
        <div className="autoresize-textarea w-full text-tiny font-mono bg-black-100 text-yellow-100 h-full">
          <textarea
            ref={ref}
            onChange={e => {
              if(!dirty) setDirty(true)
              autoSizeTextArea(e.target.value);
              fetcher.submit({
                mdxSource: `<MetaData blogPostId={'${blogPostId}'} render={({title, subTitle, emoji}) => (<>${e.target.value}</>)}/>`
                }, {method: 'post', action: '/mdx'})
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
        error: 'error'
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
  const status = formData.get("status");
  const emoji = formData.get("emoji");
  const body = formData.get("body");

  switch (_action) {
    case 'delete':
        await deleteBlogPost({ id: params.id });
        return redirect("/account");
    case 'save':
    case 'publish':
    default:

      if (typeof emoji !== "string" || emoji.length === 0) {
        return json<ActionData>(
          { errors: { emoji: "Emoji is required" } },
          { status: 400 }
        );
      }

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

      const result = await updateBlogPostContent({ id: params.id, title, body, subTitle, emoji, userId, status: _action === 'publish' ? 'published' : status });
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

export default function PostPageSEO() {
  const {blogPost} = useLoaderData();

  const actionData = useActionData() as ActionData;
  const previewImageMDXRef = React.useRef<HTMLTextAreaElement>(null);
  const formPropagationBypassRef = React.useRef<HTMLDivElement>(null);


  React.useEffect(() => {
    if (actionData?.errors?.previewImageMDX) {
        previewImageMDXRef.current?.focus();
    } 
  }, [actionData]);

  const autoSizeTextArea = (replicatedValue: string) => {
    if (previewImageMDXRef?.current) {
        previewImageMDXRef?.current?.parentElement?.setAttribute('data-replicated-value', replicatedValue)
    }
  }

  const fetcher = useFetcher();

  React.useEffect(() => {
    previewImageMDXRef.current?.setAttribute("value", blogPost?.previewImageMDX);
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
      className="min-h-screen p-6 w-full grid grid-areas-blog-post-seo-form grid-cols-blog-post-seo-form grid-rows-blog-post-seo-form gap-6"
    >
      <input name="status" value={blogPost?.status} type="hidden"/>

      <PreviewImageMDXField ref={previewImageMDXRef} blogPostId={blogPost?.id} actionData={actionData} autoSizeTextArea={autoSizeTextArea} fetcher={fetcher} defaultValue={blogPost?.body}/>
      <div className="grid-in-bpf-preview-img mt-6 markdown grid" >
        <div id="og-image-preview" className="border-2 border-white-100 w-[1200px] h-[630px] place-self-center" ref={formPropagationBypassRef}></div>
      </div>

      <div className="grid-in-bpf-submit flex items-center w-full justify-end">
        <MultiActionButton
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
      </div>
      

    </Form>
    {formPropagationBypassRef?.current && ReactDOM.createPortal(
      <ComponentErrorBoundary
        FallbackComponent={ErrorFallback}>
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
