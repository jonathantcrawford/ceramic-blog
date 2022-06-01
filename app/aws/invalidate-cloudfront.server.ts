
import { 
    CloudFrontClient, 
    CreateInvalidationCommandInput, 
    CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';

    import cuid from "cuid";


export const createCloudfrontInvalidation = async ({paths}: {paths: string[]}) => {

  const params: CreateInvalidationCommandInput = {
    DistributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
    InvalidationBatch: {
        Paths: {
            Quantity: paths.length,
            Items: paths
        },
        CallerReference: cuid()
    }
  };

  try {

    const client = new CloudFrontClient({
      region: process.env.S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_BLOG_RUNTIME_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.AWS_BLOG_RUNTIME_SECRET_ACCESS_KEY ?? '',
      },
    });


  const results = await client.send(new CreateInvalidationCommand(params));

  return results

  } catch (err) {
      console.log(err)
    return {
      errors: {
        generic: 'could not invalidate cache'
      }
    }
  }
}