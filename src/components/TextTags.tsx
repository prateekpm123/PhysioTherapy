import React, { ReactNode } from "react";

interface TextTagsProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className?: string; // Add any custom props here
  ref?: React.RefObject<HTMLHeadingElement>
}

/**
 * ...rest: is basically me giving all the base properties access to my created components
 * All the base properties like id, className, events would be available to H1 as well
 * @param param0 
 * @returns 
 */
export const H1: React.FC<TextTagsProps> = ({children, className, ...rest}: TextTagsProps) => {
  return (<><span className={"text-9xl "+className} {...rest}>{children}</span><br></br></>);
};
export const H2 = ({children, className, ...rest}: TextTagsProps) => {
  return <span className={"text-8xl "+className} {...rest}>{children}</span>;
};
export const H3 = ({children, className, ...rest }: TextTagsProps) => {
  return (<><span className={"text-7xl "+className} {...rest}>{children}</span><br></br></>);
};
export const H4 = ({children, className, ...rest}: TextTagsProps) => {
  return (<><span className={"text-6xl "+className} {...rest}>{children}</span><br></br></>);
};
export const H5 = ({children, className, ...rest}: TextTagsProps) => {
  return <span className={"text-5xl "+className} {...rest}>{children}</span>;
};
export const H6 = ({children, className, ...rest}: TextTagsProps) => {
  return (<><span className={"text-4xl "+className} {...rest}>{children}</span><br></br></>);
  return <span className={"text-4xl "+className}>{children}</span>;
};
export const H7 = ({children, className, ...rest}: TextTagsProps) => {
  return <span className={"text-3xl "+className} {...rest}>{children}</span>;
};
export const H8 = ({children, className, ...rest}: TextTagsProps) => {
  return <span className={"text-2xl "+className} {...rest}>{children}</span>;
};
export const H9 = ({children, className, ...rest}: TextTagsProps) => {
  return (<><span className={"text-xl "+className} {...rest}>{children}</span><br></br></>);
  return <span className={"text-xl "+className}>{children}</span>;
};
