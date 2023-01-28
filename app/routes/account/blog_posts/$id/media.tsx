import {
  Form,
  useFetcher,
  useLoaderData
} from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { useMemo, useCallback } from "react";
import { requireUserId } from "~/session.server";
import { createPresignedS3Upload, deleteObjectsFromS3} from '~/aws/s3-upload.server';
import { getBlogPostById, updateBlogPostMedia } from "~/models/blog_post.server";

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const blogPostId = params.id;
  if (!blogPostId) return json(null, {status: 500});

  let formData = await request.formData();
  let action = formData.get('_action');

  if (action === 'delete') {
    let media = formData.getAll("_media");
    let mediaToDelete = formData.getAll("mediaToDelete");
    let newMedia = media.filter(m => !mediaToDelete.includes(m));
    const results = await updateBlogPostMedia({id: blogPostId, userId, media: newMedia as string[] })
    if (results?.errors) return json(null, {status: 400});
    await deleteObjectsFromS3({keys: mediaToDelete as string[]})
    return json(
      {
        media: results?.blogPost?.media
      },
      { status: results?.errors ? 400 : 200 }
    );
  } else if (action === 'upload') {
    let key = formData.get('key') as string ?? '';
    const results = await updateBlogPostMedia({id:blogPostId, userId, media: key})
    if (results?.errors) return json(null, {status: 400});
    return json(
      {
        media: results?.blogPost?.media
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
    return {blogPost}
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
      }, {method: 'post'})
    }, [fetcher, fields])

    return (
      <div>        
        <form action={url} method="post" encType='multipart/form-data' onChange={handleChange} onSubmit={handleSubmit}>
            {fields && Object.entries(fields).map(([k,v]: any, idx) => (<input key={idx} type="hidden" name={k} value={v}/>))}
            <input 
              type="file" 
              name="file" 
              accept='image/png,image/webp,image/svg+xml,video/*'/>
            <button type="submit" className="btn" disabled={fetcher.state !== 'idle'}>submit</button>
        </form>


        <Form method="post" reloadDocument>
              <button type="submit" className="btn" name="_action" value={'delete'}>delete</button>
              <div className="grid auto-rows-min grid-flow-row gap-6 my-6">
                {data?.blogPost?.media && data?.blogPost?.media?.map((mediaKey: string, idx: any) => (
                  <div key={mediaKey} className="flex items-center">
                    <div className="border-2 border-yellow-100 rounded-xl">
                      {mediaKey.includes(".mov") ?  (
                        <>
                          <video 
                          controls 
                          className="w-full" 
                          src={`https://blog-assets-84c274eb.s3.us-west-2.amazonaws.com/${mediaKey}`}/>
                          <code className="font-mono text-pink-200 bg-gray-100">
                            {`<video controls src={'https://blog-assets-84c274eb.s3.us-west-2.amazonaws.com/${mediaKey}'}/>`}
                          </code>
                        </>

                      ) : (
                        <>
                          <img  
                          className="max-w-[200px] max-h-[200px]"
                          alt={mediaKey} 
                          src={`https://blog-assets-84c274eb.s3.us-west-2.amazonaws.com/${mediaKey}`}/>
                          <code className="font-mono text-pink-200 bg-gray-100">
                            {`<img src='https://blog-assets-84c274eb.s3.us-west-2.amazonaws.com/${mediaKey}'/>`}
                          </code>
                        </>
                      )}


                    </div>
                    <label className="checkbox text-base font-saygon text-yellow-100 flex items-center">
                      <input type="hidden" name="_media" value={mediaKey}/>
                      <input 
                        type="checkbox"
                        name="mediaToDelete"
                        value={mediaKey}
                        />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                ))}
              </div>
          </Form>
      </div>
    )
}