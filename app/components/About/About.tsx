import { NavLink } from "@remix-run/react";

export const About = () => {
  const aboutClasses = [
    "mt-2",
    "font-hamlin",
    "text-2xl",
    "md:text-6xl",
    "font-light",
    "text-white-100",
  ].join(" ");

  const divClasses = ["max-w-[200mm]", "mb-4", "leading-[1.618em]"].join(" ");

  const navLinkClasses = [
    "font-hamlin",
    "text-2xl",
    "md:text-6xl",
    "no-underline",
    "text-yellow-100",
    "hover:text-yellow-200",
  ].join(" ");

  return (
    <div className={aboutClasses}>
      <div className={divClasses}>
        ux.
        <br/>
        design.
        <br/>
        full stack.
        <br/>
        check out my{" "}
        <NavLink prefetch="none" to="/blog"  className={navLinkClasses}>
          blog
        </NavLink>
        .
      </div>
    </div>
  );
};
