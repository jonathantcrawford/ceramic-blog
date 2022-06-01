




import type { ActionFunction } from "@remix-run/server-runtime";

import { json } from "@remix-run/server-runtime";
import { requireUserId } from "~/session.server";
import { createPresignedS3Upload } from '~/aws/s3-upload.server';



export const action: ActionFunction = async ({ request, params }) => {
    const userId = await requireUserId(request);
    let formData = await request.formData();

    let name = formData.get('name');
    let blogPostId = formData.get('blogPostId');
    let mimetype = (formData.get('mimetype') as string ?? '');
    let contentEncoding = (formData.get('contentencoding') as string ?? '');
    
    const key = `${process.env.S3_ENV_PREFIX}/user-${userId}/blogPost-${blogPostId}/${name}`;
    
    const presignedParams = contentEncoding === '' ? {key, mimetype} : {key, mimetype, contentEncoding};
    const result = await createPresignedS3Upload(presignedParams);
    
    return json({...result}, {status: result?.error ? 400 : 200});
  };