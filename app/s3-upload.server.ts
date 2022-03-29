// import aws from "aws-sdk";




// export const getS3Instance = () => {
//     aws.config.update({
//         region: process.env.S3_REGION,
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//       });
//     return  new aws.S3();
// }


import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";


const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
    }
})

const parallelUpload = (params: any) => {
    return new Upload({
        client: s3Client,
        params
      });
}

export { s3Client, parallelUpload}