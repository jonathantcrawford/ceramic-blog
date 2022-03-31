import {
    ActionFunction,
    json,
    unstable_parseMultipartFormData as parseMultipartFormData,
    UploadHandler,
    useActionData,
    useLoaderData,
    Form
  } from 'remix';
  import { useEffect } from "react";
  import { requireUserId } from "~/session.server";
  import { updateBlogPostImages, getBlogPostById } from "~/models/blog_post.server";
  import { createUserBlogPostS3UploadHandler } from '~/s3-upload.server';
  
  
  export const action: ActionFunction = async ({ request, context, params }) => {
    const userId = await requireUserId(request);
    const blogPostId = params.id;
    if (!blogPostId) return json(null, {status: 500});
    
    let formData = await parseMultipartFormData(request, createUserBlogPostS3UploadHandler({userId, blogPostId}));
    
    // let formData;
    // try {
    //   formData = await parseMultipartFormData(request, s3UploadHandler);
    // } catch (error) {
    //   console.log('Caught: ', error);
    //   return json({ error }, { status: 400 });
    // }
  
    let imageFile = JSON.parse(formData.get('imageFile') as string);
    let images = formData.getAll("images");

    const results = await updateBlogPostImages({id:blogPostId, userId, images: [...images, imageFile.key]})

    if (results?.errors) return json(null, {status: 400});
  
    return json(
      {
        images: results?.blogPost?.images
      },
      { status: imageFile.error ? 400 : 200 }
    );
};

export const loader = async ({request, params}: any) => {
    await requireUserId(request);
    const id = params.id;
    if (!id) return json(null, {status: 500});
    const blogPost = await getBlogPostById({id});

    return json(blogPost, {status: 200});
}

export default function S3Test() {
    const blogPost = useLoaderData();
    const actionData = useActionData();
  
    useEffect(() => {
      console.log(actionData)
    }, [actionData])
  
  
      return (
        <div>
          <Form method="post" encType="multipart/form-data">
              <input type="file" name="imageFile" accept='image/png'/>
              <button type="submit" className="btn">submit</button>
              <div className="grid auto-rows-min grid-flow-row gap-6 my-6">
                {blogPost?.images && blogPost?.images?.map((imageKey: any, idx: any) => (
                  <div key={idx} className="flex items-center">
                    <div className="border-2 border-yellow-100 rounded-xl">
                      <img  
                        className="max-w-[200px] max-h-[200px]"
                        alt={imageKey} 
                        src={`https://blog-assets-84c274eb.s3.us-west-2.amazonaws.com/blog-assets-84c274eb/${imageKey}`}/>
                    </div>
                    <label className="checkbox text-base font-saygon text-yellow-100 flex items-center">
                      <input 
                        type="checkbox"
                        name="images"
                        value={imageKey}
                        />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                ))}
              </div>
          </Form>
        </div>
      )
  }