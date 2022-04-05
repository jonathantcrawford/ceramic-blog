import {

  useActionData,
  Form
} from '@remix-run/react';
import {
  json,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/node';
import type { ActionFunction } from "@remix-run/node";
import { useEffect } from "react";
import { createUploadHandler } from '~/s3-upload.server';


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
export default function S3Test() {

  const actionData = useActionData();

  useEffect(() => {
    console.log(actionData)
  }, [actionData])


    return (
      <>
        <Form method="post" encType="multipart/form-data">
            <input type="file" name="imageFile" accept='image/png'/>
            <button type="submit" className="btn">submit</button>
        </Form>
        {actionData?.key && <img src={`https://blog-assets-84c274eb.s3.us-west-2.amazonaws.com/blog-assets-84c274eb/${actionData?.key}`}/>}
      </>
    )
}