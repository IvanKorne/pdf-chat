"use client";
import { Chat } from "@/lib/db/schema";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import SubscriptionButton from "./SubButton";

type ChatProps = {
  chats: Chat[];
  chatId: number;
  isPro: boolean;
};
const ChatSidebar = ({ chats, chatId, isPro }: ChatProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="w-full h-screen p-4 text-gray-300 bg-gray-900">
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="size-4 mr-1" />
          New Chat
        </Button>
      </Link>
      <div className="flex flex-col gap-2  mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn(
                "rounded-lg p-3  text-slate-300 flex items-center ",
                {
                  "bg-purple-700 text-white ": chat.id === chatId,
                  "hover:text-white": chat.id !== chatId,
                }
              )}
            >
              <MessageCircle className="mr-1 size-4" />
              <p className="w-full overflow-hidden text-sm truncate text-ellipsis whitespace-nowrap">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="absolute bottom-4 left-2">
        <div className="flex flex-col gap-1 justify-center items-center">
          <div className="flex gap-1 items-center text-sm text-slate-600 flex-wrap">
            <Link href="/">Home</Link>
            <Link href="https://ivankorne.vercel.app/">Source</Link>
          </div>

          <SubscriptionButton isPro={isPro} />
        </div>
      </div>
    </section>
  );
};

export default ChatSidebar;
