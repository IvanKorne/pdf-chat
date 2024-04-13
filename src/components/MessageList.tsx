import React from "react";
import { Message } from "ai/react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type MessageProps = {
  messages: Message[];
  isLoading: boolean;
};
const MessageList = ({ messages, isLoading }: MessageProps) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="size-10 text-purple-700 animate-spin" />
      </div>
    );
  }
  if (!messages) {
    return <></>;
  }
  return (
    <div className="flex flex-col gap-2 px-4 ">
      {messages.map((msg) => (
        <div
          className={cn("flex", {
            "justify-end pl-10": msg.role === "user",
            "justify-start pr-10": msg.role === "assistant",
          })}
          key={msg.id}
        >
          <div
            className={cn(
              "rounded-lg text-sm px-3 shadow-md ring-1 py-1 ring-gray-900/10",
              { "bg-purple-700 text-white": msg.role === "user" }
            )}
          >
            <p>{msg.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
