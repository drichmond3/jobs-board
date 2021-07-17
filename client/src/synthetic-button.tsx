import React, { ReactNode, useState } from "react";

interface Props {
  hoverClass?: string,
  clickClass?: string,
  children?: ReactNode
}

export default function SyntheticButton(props: Props): JSX.Element {
  let [hover, setHover] = useState<boolean>(false);
  let [click, setClick] = useState<boolean>(false);

  let additionalClasses = " ";
  additionalClasses += hover ? (props.hoverClass ?? "") : "";
  additionalClasses += click ? (props.clickClass ?? "") : "";

  let baseAdditionalProps = {
    onMouseDown: () => {
      setClick(true);
      setHover(false);
    },
    onMouseEnter: () => {
      setHover(true);
    },
    onMouseLeave: () => {
      setClick(false);
      setHover(false);
    },
    onMouseUp: () => {
      setHover(true);
      setClick(false);
    },
    className: additionalClasses
  }

  if (props.children != null) {
    return <>{
      React.Children.map(props.children, child => {
        let additionalProps = { ...baseAdditionalProps }
        if (React.isValidElement(child)) {
          additionalProps.className = child.props.className + additionalClasses;
          return React.cloneElement(child, additionalProps)
        }
        else {
          return React.cloneElement(<span>{child}</span>, baseAdditionalProps)
        }
      })
    }</>
  }
  return <></>;
}