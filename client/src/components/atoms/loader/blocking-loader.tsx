"use client";

import { ThreeDot } from "react-loading-indicators";
const BlockingLoader: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div
      style={{
        zIndex: 3000,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      className="fixed inset-0 flex justify-center items-center"
    >
      <div className="p-6">
        <ThreeDot
          variant="bounce"
          color="#006766"
          size="medium"
          text={text || "Loading"}
          textColor="#006766"
        />
      </div>
    </div>
  );
};
export default BlockingLoader;
