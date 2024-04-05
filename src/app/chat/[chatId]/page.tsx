import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = ({ params: { chatId } }: Props) => {
  return <div>{chatId}</div>;
};

export default ChatPage;
