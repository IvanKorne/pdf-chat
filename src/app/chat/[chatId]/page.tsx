import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ChatSidebar from "@/components/ChatSidebar";
import PDFViewer from "@/components/PDFViewer";
import ChatComponent from "@/components/ChatComponent";
import { checkSubscription } from "@/lib/subscription";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  const isPro = await checkSubscription();

  return (
    <section className="flex max-h-screen  ">
      <div className="flex w-full max-h-screen ">
        <div className="flex-[1] max-w-xs">
          <ChatSidebar chatId={parseInt(chatId)} chats={_chats} isPro={isPro} />
        </div>
        <div className="flex-[5] max-h-screen p-4">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        <div className="flex-[3] border-l-4 border-l-slate-300">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </section>
  );
};

export default ChatPage;
