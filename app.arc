@aws
region us-east-1
apigateway httpv2

@app
blog

@http
/*
  method any
  src server

@ws

@static

@tables
arc-sessions
  _idx *String
  _ttl TTL

user
  pk *String

password
  pk *String

blog_post
  pk *String

analytics
  pk *String

@tables-indexes
user
  email *String
  name byEmail

blog_post
  userId *String
  name byUserId

blog_post
  slug *String
  name bySlug

analytics
  blogPostId *String
  name byBlogPostId