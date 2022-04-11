import type { LoaderFunction, ActionFunction } from "@remix-run/server-runtime";
import { useFormAction, useLoaderData, useCatch, Form, useFetcher, useActionData, Outlet, Link } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { redirect, json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import type { BlogPost } from "~/models/blog_post.server";
import { deleteBlogPost, getBlogPostById, updateBlogPost } from "~/models/blog_post.server";
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
    status?: string;
  };
};

type LoaderData = {
  formType: 'create'| 'update';
  blogPost: Pick<BlogPost, "body" | "title" | "subTitle" | "slug" | "emoji" | "status">;
};







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
  const slug = formData.get("slug");
  const status = formData.get("status");

  switch (_action) {
    case 'delete':
        await deleteBlogPost({ id: params.id });
        return redirect("/account");
    case 'save':
    case 'publish':
    default:


      if (typeof status !== "string" || status.length === 0) {
        return json<ActionData>(
          { errors: { status: "Invalid status" } },
          { status: 400 }
        );
      }

      if (typeof slug !== "string" || slug.length === 0) {
        return json<ActionData>(
          { errors: { slug: "Invalid slug" } },
          { status: 400 }
        );
      }

      const result = await updateBlogPost({ id: params.id, slug, userId, status: _action === 'publish' ? 'published' : status });
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
  const slugRef = React.useRef<HTMLInputElement>(null);



  React.useEffect(() => {
    if (actionData?.errors?.slug) {
      slugRef.current?.focus();
    } 
  }, [actionData]);


  return (
    <>
    <Form
      method="post"
      className="min-h-screen p-6 w-full grid grid-areas-blog-post-content-form grid-cols-blog-post-content-form grid-rows-blog-post-content-form gap-6"
    >
      <input name="status" value={blogPost?.status} type="hidden"/>

      <SlugField ref={slugRef} actionData={actionData}/>

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
