import { useEffect, useState } from "react";

const Progressbar = ({ spent, state }: {spent: number, state: boolean}) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(spent);
  }, [spent]);

  return (
    <div className="w-full overflow-hidden rounded-xl h-5 bg-[#eee]">
      <div
        className={`h-full ${state ? "bg-[#3170dd] " : "bg-[#e33131]"} transition-all duration-500`}
        style={{
          width: `${width}%`,
        }}
      ></div>
    </div>
  );
};

export default Progressbar;
