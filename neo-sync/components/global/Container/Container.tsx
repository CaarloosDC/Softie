import CustomSeparator from "@/components/custom/Overview/CustomSeparator";
import React, { ReactNode } from "react";
interface ContainerProps {
  children?: ReactNode;
}

//* Container that renders header and the child elements.
const Container: React.FC<ContainerProps> = ({ children }) => {
  //* Extract the first child as the header and the rest show content
  const childrenArray = React.Children.toArray(children);
  const header = childrenArray[0];
  const content = childrenArray.slice(1);

  return (
    <div className="flex flex-col gap-5 p-4 lg:gap-6 lg:p-6 mx-auto">
      {header}
      <CustomSeparator />
      <div className="flex flex-col gap-3 rounded-lg">{content}</div>
    </div>
  );
};

export default Container;
