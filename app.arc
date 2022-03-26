@app
ceramic-blog-4403

@http
/*
  method any
  src server

@ws

@static

@tables
arc-session
  _idx *String
  _ttl TTL

user
  pk *String

password
  pk *String

blog_post
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