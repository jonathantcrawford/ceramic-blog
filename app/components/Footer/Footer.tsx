import { LoaderFunction, useLoaderData } from "remix";

import "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMediumM,
  faGithub,
  faTwitter,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

export const Footer = () => {
  const footerClasses = [
    "min-h-[40mm]",
    "flex",
    "flex-row",
    "justify-evenly",
    "items-center",
    "pb-16",
  ].join(" ");

  const iconClasses = [
    "text-4xl",
    "text-yellow-100",
    "hover:text-yellow-200",
  ].join(" ");

  return (
    <div className={footerClasses}>
      <a
        rel="noreferrer"
        href="https://medium.com/@jonathantcrawford"
        target="_blank"
      >
        <FontAwesomeIcon className={iconClasses} icon={faMediumM} />
      </a>
      <a
        rel="noreferrer"
        href="https://github.com/jonathantcrawford"
        target="_blank"
      >
        <FontAwesomeIcon className={iconClasses} icon={faGithub} />
      </a>
      <a rel="noreferrer" href="https://twitter.com/jon_t_craw" target="_blank">
        <FontAwesomeIcon className={iconClasses} icon={faTwitter} />
      </a>
      <a
        rel="noreferrer"
        href="https://www.linkedin.com/in/jonathantcrawford/"
        target="_blank"
      >
        <FontAwesomeIcon className={iconClasses} icon={faLinkedinIn} />
      </a>
    </div>
  );
};
