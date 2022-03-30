import {
  ActionFunction,
  json,
  unstable_parseMultipartFormData as parseMultipartFormData,
  UploadHandler,
  useActionData,
  Form
} from 'remix';
import { useEffect } from "react";
import { s3UploadHandler } from '~/s3-upload.server';


export const action: ActionFunction = async ({ request, context, params }) => {
  console.log(request.headers)
  console.log(params)
  let formData = await parseMultipartFormData(request, s3UploadHandler);

  // let formData;
  // try {
  //   formData = await parseMultipartFormData(request, s3UploadHandler);
  // } catch (error) {
  //   console.log('Caught: ', error);
  //   return json({ error }, { status: 400 });
  // }

  let cover = JSON.parse(formData.get('cover') as string);

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
            <input type="file" name="cover" accept='image/png'/>
            <button type="submit" className="btn">submit</button>
        </Form>
      </>
    )
}