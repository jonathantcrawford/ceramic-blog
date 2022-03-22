import { NavLink } from "remix";

export const Header = () => {
  const navLinkClasses = [
    "font-december",
    "text-7xl",
    "no-underline",
    "flex",
    "flex-wrap",
  ];

  const notActiveClasses = ["text-yellow-100", "hover:text-yellow-200"];

  const activeClasses = ["text-yellow-100", "pointer-events-none"];

  return (
    <div className="w-full">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? [...navLinkClasses, ...activeClasses].join(" ")
            : [...navLinkClasses, ...notActiveClasses].join(" ")
        }
      >
        <span>Jon Crawford</span>
      </NavLink>
      <div className="mt-1 font-hamlin text-base text-white-100">
        <b>Software Engineer</b> <b>@</b>{" "}
        <a
          className="no-underline text-yellow-100 hover:text-yellow-200"
          rel="noreferrer"
          href="https://lunchbox.io/"
          target="_blank"
        >
          <b>Lunchbox</b>
        </a>
      </div>
    </div>
  );
};
