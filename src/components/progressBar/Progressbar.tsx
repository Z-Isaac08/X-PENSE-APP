import { useEffect, useState } from "react";

const Progressbar = ({ spent, state , even }: {spent: number, state: boolean, even: boolean }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(spent);
  }, [spent]);

  return (
    <div className="w-full overflow-hidden rounded-xl h-5 bg-[#eee]">
      <div
        className={`h-full ${state ? even ? "bg-[#3170dd] " : "bg-[#1f1f1f]" : "bg-[#e33131]"} transition-all duration-500`}
        style={{
          width: `${width}%`,
        }}
      ></div>
    </div>
  );
};

export default Progressbar;
