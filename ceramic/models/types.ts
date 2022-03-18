import type { ModelTypeAliases } from '@glazed/types'
import type { BasicProfile } from '@datamodels/identity-profile-basic'


export type BlogPost = {
    date: string
    text: string
    subTitle: string;
    slug: string;
  }
  
  export type BlogPostItem = {
    id: string
    title: string
  }
  
  export type BlogPosts = {
    blogPosts: Array<BlogPostItem>
  }
  
  export type ModelTypes = ModelTypeAliases<
    {
      BasicProfile: BasicProfile
      BlogPost: BlogPost
      BlogPosts: BlogPosts
    },
    {
      basicProfile: 'BasicProfile'
      blogPosts: 'BlogPosts'
    },
    { placeholderBlogPost: 'BlogPost' }
  >
  