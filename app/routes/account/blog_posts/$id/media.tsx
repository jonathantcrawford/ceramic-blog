import {
  Form,
  useFetcher,
  useLoaderData
} from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { useMemo, useCallback } from "react";
import { requireUserId } from "~/session.server";
import { createPresignedS3Upload, deleteObjectsFromS3} from '~/s3-upload.server';
import { getBlogPostById, updateBlogPostImages } from "~/models/blog_post.server";

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const blogPostId = params.id;
  if (!blogPostId) return json(null, {status: 500});

  let formData = await request.formData();
  let action = formData.get('_action');

  if (action === 'delete') {
    let images = formData.getAll("_images");
    let imagesToDelete = formData.getAll("imagesToDelete");
    let newImages = images.filter(image => !imagesToDelete.includes(image));
    const results = await updateBlogPostImages({id: blogPostId, userId, images: newImages as string[]})
    if (results?.errors) return json(null, {status: 400});
    await deleteObjectsFromS3({keys: images as string[]})
    return json(
      {
        images: results?.blogPost?.images
      },
      { status: results?.errors ? 400 : 200 }
    );
  } else if (action === 'upload') {
    let key = formData.get('key') as string ?? '';
    let images = JSON.parse(formData.get("_images") as string ) as string[];
    const results = await updateBlogPostImages({id:blogPostId, userId, images: [...images, key]})
    if (results?.errors) return json(null, {status: 400});
    return json(
      {
        images: results?.blogPost?.images
      },
      { status: results?.errors ? 400 : 200 }
    );
  } else {
    let name = formData.get('name');
    let mimetype = (formData.get('mimetype') as string ?? '');
  
    const key = `${process.env.S3_ENV_PREFIX}/user-${userId}/blogPost-${blogPostId}/${name}`;
  
    const result = await createPresignedS3Upload({key, mimetype})
  
    return json({...result}, {status: result?.error ? 400 : 200})
  }

};


export const loader: LoaderFunction = async ({request, params}: any) => {
    await requireUserId(request);
    const id = params.id;
    if (!id) return json(null, {status: 500});
    const blogPost = await getBlogPostById({id});
    const envPrefix = process.env.S3_ENV_PREFIX;
    return {blogPost, envPrefix}
}

export default function BlogPostMedia() {

    const data = useLoaderData();
    const fetcher = useFetcher();

    const {url, fields} = useMemo(() => fetcher?.data ? ({url: fetcher?.data?.url, fields: fetcher?.data?.fields}) : ({url: null, fields: null}), [fetcher?.data]);

    const handleChange = (e: any) => {
      if (e?.target?.files?.length && e.target.files.length > 0) {
        fetcher.submit({
          name: e.target.files[0].name,
          mimetype: e.target.files[0].type
        }, {method: 'post'})
      }
    }

    const handleSubmit = useCallback((e: any) => {
      fetcher.submit({
        _action: 'upload',
        key: fields?.key,
        _images: JSON.stringify(data?.blogPost?.images),
      }, {method: 'post'})
    }, [fetcher, fields, data])

    return (
      <>        
        <form action={url} method="post" encType='multipart/form-data' onChange={handleChange} onSubmit={handleSubmit}>
            {fields && Object.entries(fields).map(([k,v]: any, idx) => (<input key={idx} type="hidden" name={k} value={v}/>))}
            <input 
              type="file" 
              name="file" 
              accept='image/png,image/webp'/>
            <button type="submit" className="btn">submit</button>
        </form>


        <Form method="post" reloadDocument>
              <button type="submit" className="btn" name="_action" value={'delete'}>delete</button>
              <div className="grid auto-rows-min grid-flow-row gap-6 my-6">
                {data?.blogPost?.images && data?.blogPost?.images?.map((imageKey: any, idx: any) => (
                  <div key={imageKey} className="flex items-center">
                    <div className="border-2 border-yellow-100 rounded-xl">
                      <img  
                        className="max-w-[200px] max-h-[200px]"
                        alt={imageKey} 
                        src={`https://blog-assets-84c274eb.s3.us-west-2.amazonaws.com/${imageKey}`}/>
                      <code className="font-mono text-pink-200 bg-gray-100">
                        {`<img src='https://blog-assets-84c274eb.s3.us-west-2.amazonaws.com/${data?.envPrefix}/${imageKey}'/>`}
                      </code>
                    </div>
                    <label className="checkbox text-base font-saygon text-yellow-100 flex items-center">
                      <input type="hidden" name="_images" value={imageKey}/>
                      <input 
                        type="checkbox"
                        name="imagesToDelete"
                        value={imageKey}
                        />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                ))}
              </div>
          </Form>
      </>
    )
}