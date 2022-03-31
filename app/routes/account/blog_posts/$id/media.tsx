import {
    ActionFunction,
    json,
    unstable_parseMultipartFormData as parseMultipartFormData,
    UploadHandler,
    useActionData,
    useLoaderData,
    Form
  } from 'remix';
import { useEffect } from "react";
import { requireUserId } from "~/session.server";

import { updateBlogPostImages, getBlogPostById } from "~/models/blog_post.server";
import type { PutObjectCommandInput } from '@aws-sdk/client-s3';
import { deleteObjectsFromS3, uploadToS3 } from '~/s3-upload.server';
import cuid from 'cuid';
  
  export const action: ActionFunction = async ({ request, context, params }) => {
    const userId = await requireUserId(request);
    const blogPostId = params.id;
    if (!blogPostId) return json(null, {status: 500});


    const uploadHandler: UploadHandler = async ({ name, filename, mimetype, encoding, stream }) => {
      if (name !== "imageFile") {
        stream.resume();
        return;
      }
      const key = `${process.env.S3_ENV_PREFIX}/user-${userId}/blog-${blogPostId}/${cuid()}`;

      const params: PutObjectCommandInput = {
        Bucket: process.env.S3_BUCKET ?? "",
        Key: key,
        Body: stream,
        ContentType: mimetype,
        ContentEncoding: encoding,
        Metadata: {
          filename: filename,
        },
      };

    
      try {
        
        await uploadToS3({params});

      } catch (e) {
        console.log(e);
      }
    
      return JSON.stringify({ filename, key });
    }

    let formData = await parseMultipartFormData(request, uploadHandler);
    let action = formData.get('_action');
    let images = formData.getAll("images");
    let currentImages = formData.getAll("_images");

    if (action === 'upload'){
      let imageFile = JSON.parse(formData.get('imageFile') as string);
      const results = await updateBlogPostImages({id:blogPostId, userId, images: [...currentImages, imageFile.key]})
      if (results?.errors) return json(null, {status: 400});
      return json(
        {
          images: results?.blogPost?.images
        },
        { status: results?.errors ? 400 : 200 }
      );
    }  else {
      if (action === 'delete') currentImages = currentImages.filter(image => !images.includes(image));
      const results = await updateBlogPostImages({id:blogPostId, userId, images: currentImages as string[]})
      if (results?.errors) return json(null, {status: 400});
      await deleteObjectsFromS3({keys: images as string[]})
      return json(
        {
          images: results?.blogPost?.images
        },
        { status: results?.errors ? 400 : 200 }
      );
    }

};

export const loader = async ({request, params}: any) => {
    await requireUserId(request);
    const id = params.id;
    if (!id) return json(null, {status: 500});
    const blogPost = await getBlogPostById({id});
    const envPrefix = process.env.S3_ENV_PREFIX;
    return json({blogPost, envPrefix}, {status: 200});
}

export default function S3Test() {
    const data = useLoaderData();
    const actionData = useActionData();
  
    useEffect(() => {
      console.log(actionData)
    }, [actionData])
  
  
      return (
        <div>
          <Form method="post" encType="multipart/form-data">
              <input type="file" name="imageFile" accept='image/png,image/webp'/>
              <button type="submit" className="btn" name="_action" value={'upload'}>upload</button>
              <button type="submit" className="btn" name="_action" value={'delete'}>delete</button>
              <div className="grid auto-rows-min grid-flow-row gap-6 my-6">
                {data?.blogPost?.images && data?.blogPost?.images?.map((imageKey: any, idx: any) => (
                  <div key={imageKey} className="flex items-center">
                    <div className="border-2 border-yellow-100 rounded-xl">
                      <img  
                        className="max-w-[200px] max-h-[200px]"
                        alt={imageKey} 
                        src={`https://blog-assets-84c274eb.s3.us-west-2.amazonaws.com/blog-assets-84c274eb/${imageKey}`}/>
                      <code className="font-mono text-pink-200 bg-gray-100">
                        {`<img src='https://blog-assets-84c274eb.s3.us-west-2.amazonaws.com/blog-assets-84c274eb/${data?.envPrefix}/${imageKey}'/>`}
                      </code>
                    </div>
                    <label className="checkbox text-base font-saygon text-yellow-100 flex items-center">
                      <input type="hidden" name="_images" value={imageKey}/>
                      <input 
                        type="checkbox"
                        name="images"
                        value={imageKey}
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