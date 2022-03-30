import { NavLink } from "remix";

export const About = () => {
  const aboutClasses = [
    "mt-4",
    "font-hamlin",
    "text-2xl",
    "font-light",
    "text-white-100",
  ].join(" ");

  const divClasses = ["max-w-[200mm]", "mb-4", "leading-[1.618em]"].join(" ");

  const navLinkClasses = [
    "font-hamlin",
    "text-2xl",
    "no-underline",
    "text-yellow-100",
    "hover:text-yellow-200",
  ].join(" ");

  return (
    <div className={aboutClasses}>
      <div className={divClasses}>
        I am interested in design systems, web3 and user experiences.
      </div>
      <div className={divClasses}>
        Feel free to check out my{" "}
        <NavLink prefetch="intent" to="/blog"  className={navLinkClasses}>
          blog
        </NavLink>
        .
      </div>
    </div>
  );
};
