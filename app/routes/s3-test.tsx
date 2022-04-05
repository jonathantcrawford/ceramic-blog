import {

  useActionData,
  Form,
  useFetcher,
  useLoaderData
} from '@remix-run/react';
import {
  json,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useEffect, useState, useRef } from "react";
import { createUploadHandler } from '~/s3-upload.server';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { S3Client } from '@aws-sdk/client-s3';
import cuid from 'cuid';

export const action: ActionFunction = async ({ request, context, params }) => {

  let formData = await parseMultipartFormData(request, createUploadHandler());

  // let formData;
  // try {
  //   formData = await parseMultipartFormData(request, s3UploadHandler);
  // } catch (error) {
  //   console.log('Caught: ', error);
  //   return json({ error }, { status: 400 });
  // }

  let result = JSON.parse(formData.get('imageFile') as string);

  return json(
    {
     ...result
    },
    { status: result ? 400 : 200 }
  );

};

export const loader = async ({request}: any) => {

  const key = `${process.env.S3_ENV_PREFIX}/${cuid()}`;

  try {

    const client = new S3Client({
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.AWS_BLOG_RUNTIME_ACCESS_KEY_ID ?? '',
          secretAccessKey: process.env.AWS_BLOG_RUNTIME_SECRET_ACCESS_KEY ?? '',
        }
      });


      const {url, fields} = await createPresignedPost(client, {
        Bucket: process.env.S3_BUCKET ?? "",
        Expires: 300,
        Key: key,
        Fields: {
          'Content-Type': 'image/png'
        }
      })

    return {url, fields}
  } catch {
    return {error: 'Invalid element or syntax.'}
  }
}
export default function S3Test() {

    const {url, fields} = useLoaderData();



    return (
      <>
        <form method="post" action={`${url}`} encType="multipart/form-data">

            {fields && Object.entries(fields).map(([k,v]: any) => (<input key={k} type="hidden" name={k} value={v}/>))}
            <input type="file" name="file" accept='image/png'/>
            <button type="submit" className="btn">submit</button>
        </form>
        {/* {fetcher?.data?.fields && Object.entries(fetcher?.data?.fields).map(([k,v]) => (<div className="text-yellow-100">{k}{v}</div>))} */}
        {/* {actionData?.key && <img src={`https://blog-assets-84c274eb.s3.us-west-2.amazonaws.com/blog-assets-84c274eb/${actionData?.key}`}/>} */}
      </>
    )
}