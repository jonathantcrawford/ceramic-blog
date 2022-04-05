import { Link, Outlet } from "@remix-run/react";

export default function BlogPostEntry () {
    return (
    <div className="grid grid-areas-blog-post-forms grid-cols-blog-post-forms grid-rows-blog-post-forms">
      <div className="grid-in-bpf-sections">
        <div className="sticky top-0 grid auto-rows-min grid-flow-row gap-6 p-6">
          <Link to={``} className="text-yellow-100 font-saygon">Content</Link>{/* title, subtitle, emoji, body  */}
          <Link to={`media`}  className="text-yellow-100 font-saygon">Media</Link>{/* images  */}
          <Link to={`seo`}  className="text-yellow-100 font-saygon">Seo</Link>{/* og-tags, description, title, keywords */}
          <Link to={`analytics`}  className="text-yellow-100 font-saygon">Analytics</Link>{/* og-tags, description, title, keywords */}
          <Link to={`publish`}  className="text-yellow-100 font-saygon">Publish</Link>{/* slug, publish date, hooks */}
        </div>
      </div>
      <Outlet/>
    </div>
    )
}