
import React from "react";
import { Loader } from "lucide-react";

interface LoaderAnimationProps {
  size?: number;
  text?: string;
  fullScreen?: boolean;
  color?: "primary" | "white";
}

const LoaderAnimation: React.FC<LoaderAnimationProps> = ({
  size = 32,
  text = "Loading...",
  fullScreen = false,
  color = "primary"
}) => {
  const colorClasses = {
    primary: "text-[#3b3b3b]",
    white: "text-white"
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
          <div className="relative">
            <Loader 
              size={size} 
              className={`${colorClasses[color]} animate-spin-slow`} 
            />
          </div>
          {/* <p className="mt-4 font-medium text-[#3b3b3b] text-lg">{text}</p> */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        <Loader 
          size={size} 
          className={`${colorClasses[color]} animate-spin-slow`} 
        />
      </div>
      {text && <p className="mt-2 text-[#3b3b3b] text-sm">{text}</p>}
    </div>
  );
};

export default LoaderAnimation;
