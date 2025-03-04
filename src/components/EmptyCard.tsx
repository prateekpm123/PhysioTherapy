// import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface MyComponentProps {
  children: ReactNode; // Ensure children are included in the props
  className?: string;
}

const P_EmptyCard: React.FC<MyComponentProps> = ({ children, className }) => {
  return (
    <div className={"m-10 border-x-gray-300 bg-gray-600 h-3/4 p-8" + className}>
      <>{children}</>
    </div>
  );
};

export default P_EmptyCard;
