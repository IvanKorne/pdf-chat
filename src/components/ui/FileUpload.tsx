"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Inbox } from "lucide-react";
import { uploadToS3 } from "@/lib/s3";

const FileUpload = () => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      // If file is bigger than 10mb (max for s3)
      if (file.size > 10 * 1024 * 1024) {
        return alert("Please submit a smaller file");
      }
      try {
        const data = await uploadToS3(file);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },
  });
  return (
    <section className="bg-white p-2 rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl bg-gray-50 py-8 flex justify-center items-center cursor-pointer flex-col",
        })}
      >
        <input type="text" {...getInputProps()} />
        <div className="flex flex-col items-center">
          <Inbox className="size-10 text-purple-600" />
          <p className="mt-1 text-sm font-semibold text-slate-400">
            Drop PDF here
          </p>
        </div>
      </div>
    </section>
  );
};

export default FileUpload;
