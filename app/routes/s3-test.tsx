import { useEffect } from "react";
import { UploadHandler, ActionFunction, json } from "remix";
import { unstable_parseMultipartFormData, useActionData, Form } from "remix";

//import { getS3Instance } from "~/s3-upload.server";

import { s3Client, parallelUpload } from "~/s3-upload.server";

import stream, { Readable} from "stream"

export const action: ActionFunction = async ({
  request,
}) => {


  // function uploadStreamToS3 (readStream: Readable, key: any, callback?: any) {
  //   return new Promise((resolve, reject) => {
      
  //     const s3 = getS3Instance();
  //     const pass = new stream.PassThrough();

  //     const upload = s3.upload({
  //       Bucket: process.env.S3_BUCKET ?? "",
  //       Key: key,
  //       Body: pass
  //     });
    
  
  //     upload.on("httpUploadProgress", function (progress) {
  //       console.log(progress)
  //       //   if (result) {
  //       //     resolve(result);
  //       //   } else {
  //       //     reject(error);
  //       //   }
  //     })

  //     upload.send();
  
    
  //     // Pipe the Readable stream to the s3-upload-stream module.
  //     readStream.pipe(pass);
  //   })
  // }

  async function uploadStreamToS3 (readStream: Readable, key: any, callback?: any) {

      
      const pass = new stream.PassThrough();

      const uploader = parallelUpload({
        Bucket: process.env.S3_BUCKET ?? "",
        Key: key,
        Body: pass
      })
    
  
      uploader.on("httpUploadProgress", function (progress) {
        console.log(progress)
        //   if (result) {
        //     resolve(result);
        //   } else {
        //     reject(error);
        //   }
      })

      
  
    
      // Pipe the Readable stream to the s3-upload-stream module.
      readStream.pipe(pass);

      await uploader.done();

      return `${process.env.S3_ENDPOINT}/${key}`
  }

  const uploadHandler: UploadHandler = async ({
    name,
    stream,
    filename,

  }) => {
    // we only care about the file form field called "avatar"
    // so we'll ignore anything else
    // NOTE: the way our form is set up, we shouldn't get any other fields,
    // but this is good defensive programming in case someone tries to hit our
    // action directly via curl or something weird like that.
    if (name !== "file") {
      stream.resume();
      return;
    }

    const uploadedImage = await uploadStreamToS3(
      stream,
      filename
    );


    return uploadedImage
  };

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const imageUrl = formData.get("file");

  // because our uploadHandler returns a string, that's what the imageUrl will be.
  // ... etc

  return json(imageUrl, { status: 200})
};

export default function S3Test() {

  const actionData = useActionData();

  useEffect(() => {
    console.log(actionData)
  }, [actionData])


    return (
      <>
        {actionData && <img src={actionData} crossOrigin="anonymous"/>}
        <Form method="post" encType="multipart/form-data">
            <input type="file" name="file" />
            <button type="submit" className="btn">submit</button>
        </Form>
      </>
    )
}