import { useEffect, useState } from "react";

const Progressbar = ({ spent }: {spent: number}) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(spent);
  }, [spent]);

  return (
    <div className="w-full overflow-hidden rounded-xl h-5 bg-[#eee]">
      <div
        className="h-full bg-[#3170dd] transition-all duration-500 "
        style={{
          width: `${width}%`,
        }}
      ></div>
    </div>
  );
};

export default Progressbar;
