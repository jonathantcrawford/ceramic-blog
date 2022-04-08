import { ObjectIdentifier, DeleteObjectsCommandInput } from '@aws-sdk/client-s3';
import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'


export const createPresignedS3Upload = async ({key, mimetype, contentEncoding}: any) => {
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
          'Content-Type': mimetype,
          ...(contentEncoding ? {'Content-Encoding': contentEncoding} : {}) 
        }
      })

    return {url, fields}
  } catch {
    return {error: 'Invalid element or syntax.'}
  }
}



export const deleteObjectsFromS3 = async ({keys}: {keys: string[]}) => {


  const objectIdentifiers: ObjectIdentifier[] = keys.map(key => ({Key: `${process.env.S3_BUCKET}/${process.env.S3_ENV_PREFIX}/${key}`}));
  
  const params: DeleteObjectsCommandInput = {
    Bucket: process.env.S3_BUCKET ?? "",
    Delete: {
      Objects: objectIdentifiers
    }
  };

  try {

    const client = new S3Client({
      forcePathStyle: true,
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_BLOG_RUNTIME_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_BLOG_RUNTIME_SECRET_ACCESS_KEY ?? '',
      },
    });


  const results = await client.send(new DeleteObjectsCommand(params));

  return results

  } catch (err) {
    return {
      errors: {
        generic: 'could not delete file'
      }
    }
  }
}