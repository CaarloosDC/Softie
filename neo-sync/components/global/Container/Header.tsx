import { ReactNode } from "react";
interface HeaderProps {
  title: string;
  children?: ReactNode; // * Optional to pass children. Alert will only trigger when children are passed
}

//* Render the header of the main pages
const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <div className="flex justify-between">
      <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
      <div className="flex flex-row justify-between gap-3">{children}</div>
    </div>
  );
};

export default Header;
