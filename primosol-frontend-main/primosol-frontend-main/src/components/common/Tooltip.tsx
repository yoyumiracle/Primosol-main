import { FC, useState } from "react";

interface TooltipProps {
  position?: string;
  content: React.ReactNode;
  children: React.ReactNode;
}

const Tooltip: FC<TooltipProps> = ({ position, content, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="hidden relative md:flex items-center">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsHovered((prev) => !prev)}
      >
        {children}
      </div>
      {isHovered && (
        <div className={`absolute z-10 w-auto min-w-[200px] leading-tight p-2 transform translate-y-2 border rounded-md text-gray text-xs border-light-gray bg-mid-gray top-4 backdrop-blur-sm font-[400] text-center px-3 py-2 ${position === 'left' ? 'right-0' : position === 'right' ? 'left-0' : 'left-1/2 -translate-x-1/2'}`}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
