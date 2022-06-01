import type { LoaderFunction, ActionFunction } from "@remix-run/server-runtime";
import { useFormAction, useLoaderData, useCatch, Form, useFetcher, useActionData, Outlet, Link, useSubmit } from "@remix-run/react";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import { redirect, json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import type { BlogPost } from "~/models/blog_post.server";
import { deleteBlogPost, getBlogPostById, updateBlogPost } from "~/models/blog_post.server";
import { requireUserId } from "~/session.server";
import Alert from "@reach/alert";

import { getMDXComponent, mdxComponents } from "~/mdx";
import {ErrorBoundary as ComponentErrorBoundary} from "react-error-boundary";

import { MultiActionButton } from "~/components/MultiActionButton/MultiActionButton";

import "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

import debounce from "lodash.debounce";

// import * as htmlToImage from 'html-to-image';
import { toPng, getFontEmbedCSS, toJpeg } from 'html-to-image';



type ActionData = {
  blogPost?: Pick<BlogPost, "title" | "subTitle" | "emoji" | "body">,
  errors?: {
    title?: string;
    subTitle?: string;
    emoji?: string;
    body?: string;
    slug?: string;
    previewImageMDX?: string;
    previewImageUrl?: string;
  };
};

type LoaderData = {
  userId?: string;
  blogPost?: Pick<BlogPost, "previewImageMDX">;
  error?: string;
};



const PreviewImageMDXField = React.forwardRef(({actionData, autoSizeTextArea, fetcher, defaultValue, blogPostId}: any, ref: any) => {
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (actionData?.errors?.previewImageMDX) setDirty(false)
  }, [actionData]);

  const debouncedCompileMDX = useMemo(() => debounce((value) => {
    fetcher.submit({mdxSource: value}, {method: 'post', action: '/api/compile-mdx'})
  }, 300),[])

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
              debouncedCompileMDX(e.target.value);
            }}
            name="previewImageMDX"
            rows={8}
            defaultValue={defaultValue}
            aria-invalid={actionData?.errors?.previewImageMDX ? true : undefined}
            aria-errormessage={
              actionData?.errors?.previewImageMDX ? "body-error" : undefined
            }
          />
        </div>
        </label>
        {!dirty && actionData?.errors?.previewImageMDX && (
            <Alert className="pt-1 text-red-100 font-saygon text-base" id="previewImageMDX=error">
            {actionData.errors.previewImageMDX}
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
  
    return json<LoaderData>({ blogPost });
  } else {
    return json<LoaderData>({
        error: 'error'
    })
  }
};

export const action: ActionFunction = async ({ request, context, params }) => {
  const userId = await requireUserId(request);
  const id = params.id
  invariant(id, "blog_post_id not found");

  const formData = await request.formData();
  const _action = formData.get("_action");
  

  if (_action === 'save') {
    const previewImageMDX = formData.get("previewImageMDX");
    if (typeof previewImageMDX !== "string" || previewImageMDX.length === 0) {
        return json<ActionData>(
          { errors: { previewImageMDX: "Generate a og preview using MDX." } },
          { status: 400 }
        );
    }
      const result = await updateBlogPost({id, userId, previewImageMDX});
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
  } else if (_action === 'sync') {
    const previewImageUrl = formData.get("previewImageUrl");
    if (typeof previewImageUrl !== "string" || previewImageUrl.length === 0) {
        return json<ActionData>(
            { errors: { previewImageUrl: 'unable to sync preview image url' } },
            { status: 400 }
          );
    }

    const result = await updateBlogPost({id, userId, previewImageUrl});
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

  const syncImagePreview = useSubmit();


  React.useEffect(() => {
    previewImageMDXRef.current?.setAttribute("value", blogPost?.previewImageMDX);
    autoSizeTextArea(blogPost?.previewImageMDX);
    fetcher.submit({mdxSource: `<MetaData blogPostId={'${blogPost?.id}'} render={({title, subTitle, emoji, updatedAt}) => (<>${blogPost?.previewImageMDX}</>)}/>`}, {method: 'post', action: '/api/compile-mdx'});
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


  const submitHandler = async () => {
    const livePreview = document.getElementById('og-image-live-preview');
    if (livePreview) {
        const dataUrl = await toPng(livePreview, {height: 630, width: 1200, backgroundColor: '#000000'})

        const formData = new FormData();
        formData.append('mimetype', 'image/png');
        formData.append('blogPostId', blogPost?.id);
        formData.append('name', 'og-preview.png');
        formData.append('content-encoding', 'base64');
        const presignedResponse = await fetch('/api/s3/create-presigned-request',{
            method: 'POST',
            body: formData
        });
        const {url, fields} = await presignedResponse.json();
        console.log(url, fields);
        const uploadFormData = new FormData();
        Object.entries(fields).map(([k,v]: any, idx) => uploadFormData.append(k,v));
        
        const blob = await (await fetch(dataUrl)).blob();

        uploadFormData.append('file',blob);
        await fetch(url, {
            method: 'POST',
            body: uploadFormData
        });
        syncImagePreview({previewImageUrl: `${url}/${fields?.key}`, _action: 'sync'}, {method: 'post'});
    }
  }

  return (
    <>
    <Form
      method="post"
      className="min-h-screen p-6 w-full grid grid-areas-blog-post-seo-form grid-cols-blog-post-seo-form grid-rows-blog-post-seo-form gap-6"
      onSubmit={submitHandler}
    >   
        <div className="grid-in-bpf-og-img grid">
            <img alt="og-preview" src={blogPost?.previewImageUrl} style={{width: '600px', height: '315px'}}/>
        </div>
        
      <PreviewImageMDXField ref={previewImageMDXRef} blogPostId={blogPost?.id} actionData={actionData} autoSizeTextArea={autoSizeTextArea} fetcher={fetcher} defaultValue={blogPost?.previewImageMDX}/>
      <div className="grid-in-bpf-preview-img mt-6 markdown grid" >
          <div className="border-2 border-white-100 place-self-center">
            <div id="og-image-live-preview" style={{width: '1200px', height: '630px'}} ref={formPropagationBypassRef}></div>
          </div>
      </div>
    
      <div className="grid-in-bpf-submit flex items-center w-full justify-end">
            <button
                name="_action"
                value="save"
                type="submit"
                className="btn"
              >
              Save
            </button>
      </div>
      

    </Form>
    {formPropagationBypassRef?.current && ReactDOM.createPortal(
    <>
      <ComponentErrorBoundary
        FallbackComponent={ErrorFallback}>
        <Component components={mdxComponents}/>
      </ComponentErrorBoundary>
    </>
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
