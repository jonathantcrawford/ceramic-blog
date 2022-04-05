// import {
//   UploadHandler,
// } from 'remix';
// import { S3, DeleteObjectsCommandInput, DeleteObjectsCommand, ObjectIdentifier } from '@aws-sdk/client-s3';
// import { Upload } from '@aws-sdk/lib-storage';
// import { Readable, PassThrough } from 'stream';
// import sharp from 'sharp';
// import cuid from 'cuid';
// import { UploadMeter } from './upload-meter.server';

// const s3Client = new S3({
//   forcePathStyle: true,
//   endpoint: process.env.S3_ENDPOINT,
//   region: process.env.S3_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_BLOG_RUNTIME_ACCESS_KEY_ID ?? '',
//     secretAccessKey: process.env.AWS_BLOG_RUNTIME_SECRET_ACCESS_KEY ?? '',
//   },
// });

// type S3UploadParams = {
//   key: string;
//   mime: string;
// };

// function s3Upload({ key, mime }: S3UploadParams) {
//   let stream = new PassThrough();
//   let upload = new Upload({
//     client: s3Client,
//     params: {
//       Bucket: process.env.S3_BUCKET,
//       Key: key,
//       ContentType: mime,
//       Body: stream,
//     },
//   });

//   return { stream, upload };
// }

// function getS3Key(filename: string) {
//   return `${process.env.S3_ENV_PREFIX}/${filename}`;
// }

// function getS3KeyUrl(key: string) {
//   return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;
// }

// type ImageStreamUploadResult = {
//   uploadId: string;
//   files: Array<{ size: number; key: string; url: string }>;
// };

// type ImageUploadOptions = {
//   maxFileSize: number;
//   sizes: number[];
//   format: 'jpeg' | 'jpg' | 'webp' | 'png';
// };

// export async function uploadImageStreamToS3(
//   file: Readable,
//   {
//     maxFileSize,
//     sizes,
//     format,
//   }: ImageUploadOptions
// ) {
//   return new Promise<ImageStreamUploadResult>((resolve, reject) => {
//     let id = cuid();
//     let meter = new UploadMeter(maxFileSize);
//     // let meta = sharp().metadata((_err, meta) => {
//     //   meta &&
//     //     console.log(`meta [${id}] format: ${meta.format} | size: ${meta.size}`);
//     // });

//     // Initialize root transform writestream
//     let transform = sharp();

//     let transforms = sizes.map((size) => {
//       let key = getS3Key(`${id}-${size}.${format}`);
//       let url = getS3KeyUrl(key);
//       let resizeStream = transform.clone().resize(size).toFormat(format);
//       let { stream: uploadStream, upload } = s3Upload({
//         key,
//         mime: `image/${format}`,
//       });
//       return { key, url, size, resizeStream, uploadStream, upload };
//     });

//     // Handle abort flow globally
//     function abort(reason: string) {
//       file.unpipe();
//       meter.unpipe();
//       //meta.unpipe();

//       transforms.forEach((t) => {
//         t.resizeStream.unpipe();
//         t.upload.abort();
//       });

//       transform.unpipe();
//       transform.removeAllListeners();

//       //meta.removeAllListeners();
//       meter.removeAllListeners();

//       file.resume();
//       reject(reason);
//     }

//     // Register event handlers
//     meter.on('limit', () => {
//       console.log('meter [ERROR]: File size limit exceeded');
//       abort('LIMIT_REACHED');
//     });

//     // meta.on('error', (err) => {
//     //   console.log('meta [ERROR]: ', err);
//     //   abort('INVALID_FILE');
//     // });

//     transform.on('error', (err) => {
//       console.log('transform [ERROR]: ', err);
//       abort('IMAGE_TRANSFORM_ERROR');
//     });

//     // Register transform substream uploads
//     transforms.forEach((t) => t.resizeStream.pipe(t.uploadStream));

//     // Kick off stream handling by piping it into the root transform sstream
//     //file.pipe(meter).pipe(meta).pipe(transform);
//     file.pipe(meter).pipe(transform);

//     // Wait for all streams being uploaded to S3
//     Promise.all(transforms.map((t) => t.upload.done()))
//       .then(() =>
//         resolve({
//           uploadId: id,
//           files: transforms.map(({ key, url, size }) => ({ key, url, size })),
//         })
//       )
//       .catch((err) => {
//         console.log('upload [ERROR]: ', err);
//         abort('S3_UPLOAD_ERROR');
//       });
//   });
// }

// export const s3UploadHandler: UploadHandler = async ({ name, stream }) => {
//   if (name !== 'imageFile') {
//     console.log(`Field [${name}] not accepted, skipping`);
//     stream.resume();
//     return;
//   }

//   // TODO: Check for `mimetype` here as well
//   // if (!['image/jpeg', 'image/jpg'].includes(mimetype)) {
//   //   console.log(`Field [${name}] not supported '${mimetype}', skipping`);
//   //   stream.resume();
//   //   return;
//   // }

//   console.log(`Field [${name}] starting upload...`);

//   try {
//     let upload = await uploadImageStreamToS3(stream, {
//       maxFileSize: 1_000_000,
//       sizes: [200, 600],
//       format: 'png'
//     });
//     console.log(`Field [${name}] finished upload`);
//     return JSON.stringify(upload);
//   } catch (error) {
//     console.log(`Field [${name}] failed upload: ${error}`);
//     return JSON.stringify({ error });
//   }
// };

import { PutObjectCommandInput, ObjectIdentifier, DeleteObjectsCommandInput, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3Client, DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { Upload } from '@aws-sdk/lib-storage';
import cuid from 'cuid';

import { S3 } from "aws-sdk";

import {
  UploadHandler,
} from '@remix-run/node';



export const createUploadHandler: () => UploadHandler = () => {
  return async ({ name, filename, mimetype, encoding, stream }) => {
    if (name !== "imageFile") {
      stream.resume();
      return;
    }
    
    const buffer = await new Promise<Buffer>(async (resolve, reject) => {
      const chunks: any = [];

      stream.on("data", (chunk: any) => {
        chunks.push(chunk);
      });

      stream.on("end", () => {
        console.log('end');
        return resolve(Buffer.concat(chunks));
      });
    });

    const client = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_BLOG_RUNTIME_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_BLOG_RUNTIME_SECRET_ACCESS_KEY ?? '',
      }
    });

    const key = `${process.env.S3_ENV_PREFIX}/${filename}`;



    try {


      const {url, fields} = await createPresignedPost(client, {
        Bucket: process.env.S3_BUCKET ?? "",
        Expires: 300,
        Key: key
      })

      const formData = new FormData();


      Object.entries(fields).forEach(([k,v]) => {
        formData.append(k,v);
      })


      const response = await fetch(url, {
        method: 'POST', 
        body: formData
      });
     
      console.log(response)

      return JSON.stringify({key, url: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`});

    } catch (e) {
      console.log(e)
      return JSON.stringify({ error: 'error' });
    }

    
  }
}

export const createPresignedS3Upload = async ({mimetype, filename}: any) => {
  const client = new S3({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_BLOG_RUNTIME_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.AWS_BLOG_RUNTIME_SECRET_ACCESS_KEY ?? '',
    },
  });

  //const randomID = Math.random() * 10000000
  const Key = `${process.env.S3_ENV_PREFIX}/${filename}.png`

  const params = {
    Bucket: process.env.S3_BUCKET ?? "",
    Key,
    Expires: 300,
    ContentType: mimetype
  }

  const uploadURL = await client.getSignedUrlPromise('putObject', params);
  return JSON.stringify({
    uploadURL: uploadURL,
    Key
  })
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