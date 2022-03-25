@app
ceramic-blog-4403

@http
/*
  method any
  src server

@ws

@static

@tables
user
  pk *String

password
  pk *String # user_id

blog_post
  pk *String  # user_id
  sk **String # blog_post_id
