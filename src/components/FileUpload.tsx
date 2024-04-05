"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Inbox, Loader2 } from "lucide-react";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

type MutateProps = {
  file_key: string;
  file_name: string;
};

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ file_key, file_name }: MutateProps) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      // If file is bigger than 10mb (max for s3)
      if (file.size > 10 * 1024 * 1024) {
        return toast.error("File Too Large");
      }
      try {
        setUploading(true);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data.file_name) {
          return toast.error("Something went wrong");
        }
        mutate(data, {
          onSuccess: (data) => {
            console.log(data);
            toast.success(data.message);
          },
          onError: (err) => {
            toast.error("Error creating chat");
          },
        });
      } catch (err) {
        console.log(err);
      } finally {
        setUploading(false);
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
        {uploading || isPending ? (
          <div className="flex flex-col items-center">
            <Loader2 className="size-10 text-purple-600 animate-spin" />
            <p className="mt-2 text-sm text-slate-400 font-semibold">
              Sending to GPT-4...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Inbox className="size-10 text-purple-600" />
            <p className="mt-1 text-sm font-semibold text-slate-400">
              Drop PDF here
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FileUpload;
