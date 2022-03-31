import {
  ActionFunction,
  json,
  unstable_parseMultipartFormData as parseMultipartFormData,
  UploadHandler,
  useActionData,
  Form
} from 'remix';
import { useEffect } from "react";
import { updateBlogPostImages, getBlogPostById } from "~/models/blog_post.server";
import type { PutObjectCommandInput } from '@aws-sdk/client-s3';
import { deleteObjectsFromS3, uploadToS3 } from '~/s3-upload.server';
import cuid from 'cuid';

export const action: ActionFunction = async ({ request, context, params }) => {
  const uploadHandler: UploadHandler = async ({ name, filename, mimetype, encoding, stream }) => {
    if (name !== "imageFile") {
      stream.resume();
      return;
    }
    const key = `${process.env.S3_ENV_PREFIX}/test`;

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

  // let formData;
  // try {
  //   formData = await parseMultipartFormData(request, s3UploadHandler);
  // } catch (error) {
  //   console.log('Caught: ', error);
  //   return json({ error }, { status: 400 });
  // }

  let cover = JSON.parse(formData.get('imageFile') as string);

  return json(
    {
      fields: { cover },
    },
    { status: cover.error ? 400 : 200 }
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
      </>
    )
}