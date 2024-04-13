"use client";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";

type Props = {
  chatId: number;
};

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  useEffect(() => {
    const messageContainer = document.getElementById("container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);
  return (
    <section className="relative max-h-screen" id="container">
      <div className="sticky top-0 inset-x-0 p-2 h-fit bg-white">
        <h3 className="text-xl md:text-2xl font-bold">Chat</h3>
      </div>
      <MessageList messages={messages} isLoading={isLoading} />
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-4 py-2 bg-white  "
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            className="w-full"
            placeholder="Enter a question..."
          />
          <Button className="ml-2 bg-purple-700">
            <Send className="size-4" />
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ChatComponent;
