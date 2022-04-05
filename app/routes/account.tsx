import { Outlet, Link, Form } from "@remix-run/react";


export default function Account() {
    return (
        <div className="grid grid-areas-account grid-cols-account grid-rows-account min-h-screen bg-black-100">
            <div className="row-start-1 col-start-acc-sidebar-min span-1 border-r-2 border-pink-200 ">
                <div className="grid auto-rows-min grid-flow-row gap-6 p-6 sticky top-0">
                    <Link to="/account" className="text-yellow-100 font-saygon whitespace-nowrap">Account</Link>
                    <Link to="blog_posts" className="text-yellow-100 font-saygon whitespace-nowrap">Blog Posts</Link>
                    <Form action="/logout" method="post">
                    <button
                        type="submit"
                        className="text-yellow-100 font-saygon whitespace-nowrap"
                    >
                        Logout
                    </button>
                    </Form>
                </div>

            </div>
            <div className="row-start-1 col-start-acc-sidebar-max col-end-acc-route row-span-1">
                <Outlet/>
            </div>
        </div>
    )
}