import React, { useState } from "react";


import "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp
} from "@fortawesome/free-solid-svg-icons";



export const MultiActionButton = ({primary, options}: any) => {
  const [actionsVisible, setActionsVisible] = useState(false);

  const primaryActionButtonClasses = [
    "w-full",
    "bg-yellow-100",
    "py-2",
    "px-3",
    "font-saygon",
    "text-lg",
    "hover:bg-yellow-200",
    "text-left",
    "rounded-tl-lg",
    "border-2",
    "border-black-100",
    "border-r-0",
    ...(actionsVisible 
    ? [
      "rounded-bl-none",
      ]
    : [
      "rounded-bl-lg"
    ])
  ];

  const secondayActionsDropDownClasses = [
    "rounded-tr-lg",
    "bg-yellow-100",
    "flex",
    "items-center",
    "px-2",
    "py-3",
    "hover:bg-yellow-200",
    "hover:cursor-pointer",
    "border-2",
    "border-black-100",
    ...(actionsVisible 
      ? [
        "rounded-br-none",
        ]
      : [
        "rounded-br-lg"
      ])
  ];

  const secondaryActionButtonClasses = [
    "rounded-none", 
    "w-full", 
    "bg-yellow-100", 
    "hover:bg-yellow-200", 
    "font-saygon", 
    "text-lg", 
    "py-2", 
    "px-3", 
    "text-left",
    "border-2",
    "border-black-100",
    "border-t-0",
    "last:rounded-br-lg",
    "last:rounded-bl-lg",
    ...(actionsVisible 
      ? [
        "opacity-100",
        ]
      : [
        "opacity-0"
      ])
  ];



  return (
    <div className="w-[130px] relative">
      <div className="flex w-full">
        {primary({className: primaryActionButtonClasses.join(' ')})}
        {/* <button className={primaryActionButtonClasses.join(' ')}>update</button> */}
        <div
          onClick={() => setActionsVisible(!actionsVisible)}
          className={secondayActionsDropDownClasses.join(' ')}>
          {!actionsVisible && <FontAwesomeIcon icon={faChevronDown}/>}
          {actionsVisible && <FontAwesomeIcon icon={faChevronUp}/>}
        </div>
      </div>
      
      <div className="absolute w-full">
        {options({className: secondaryActionButtonClasses.join(' ')})}
          {/* <button className={secondaryActionButtonClasses.join(' ')}>publish</button>
          <button className={secondaryActionButtonClasses.join(' ')}>delete</button> */}
        </div>
    </div>
  )
}
