import InfoCard, { ProjectInfo } from "@/components/custom/Overview/InfoCard";
import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  projectInfo?: ProjectInfo | null;
  children?: ReactNode; // * Optional to pass children. Alert will only trigger when children are passed
}

//* Render the header of the main pages
const Header: React.FC<HeaderProps> = ({ title, projectInfo, children }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col items-start justify-between gap-6 xl:flex-row ">
        <h1 className="text-lg font-semibold md:text-2xl w-full xl:max-w-[50%]">
          {title}
        </h1>
        <div className="flex flex-col w-full flex-wrap gap-3 xl:flex-row xl:justify-end">
          {children}
        </div>
      </div>
      {projectInfo && <InfoCard projectInfo={projectInfo} />}
    </div>
  );
};

export default Header;
