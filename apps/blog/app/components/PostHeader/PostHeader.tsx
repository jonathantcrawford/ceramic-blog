import { NavLink } from "remix";

export const PostHeader = ({ info }: any) => {
  return (
    <>
      <NavLink
        prefetch="intent"
        to="/blog"
        className="no-underline text-yellow-100 hover:text-yellow-200 font-saygon text-xl mb-2"
      >{`< all posts`}</NavLink>
      <div className="bg-pink-200 text-black-100 no-underline rounded-[2vmin] border-[0_05vmin] border-solid border-pink-200 p-[3vmin] flex flex-col">
        <span className="text-4xl font-extrabold font-saygon pb-2">
          {info.emoji} {info.title}
        </span>
        <span className="text-xl font-medium font-saygon pb-4">
          {info.subtitle}
        </span>
        <span className="text-xl font-medium font-saygon text-right">
          {info.date}
        </span>
      </div>
    </>
  );
};
