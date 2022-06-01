

export const PostHeader = ({ info }: any) => {
  return (
    <div className="bg-pink-200 text-black-100 no-underline rounded-xl border-6 border-solid border-pink-200 p-[3vmin] flex flex-col mt-2 mb-4">
      <span className="text-4xl font-extrabold font-saygon pb-2 mobile:text-xl">
        {info.emoji} {info.title}
      </span>
      <span className="text-xl font-medium font-saygon pb-4 mobile:text-lg mobile:pb-2">
        {info.subTitle}
      </span>
      <span className="text-xl font-medium font-saygon text-right mobile:text-base">
        {new Date(info.updatedAt).toDateString()}
      </span>
    </div>
  );
};
