"use client";

import { CircularProgress, Typography } from "@mui/material";
import React from "react";

const BlockingLoader: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div
      style={{ zIndex: 3000, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      className="fixed inset-0 flex flex-col justify-center items-center gap-4"
    >
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center">
        <CircularProgress size={48} thickness={4} color="primary" />
        {text && (
          <Typography
            variant="body1"
            className="text-white mt-4 text-center tracking-wide"
          >
            {text}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default BlockingLoader;
