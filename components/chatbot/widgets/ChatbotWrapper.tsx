import React from "react";
import Chatbot from "react-chatbot-kit";
import config from "./Config";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";


interface ChatbotWrapperProps {
  userType: string;
}

const ChatbotWrapper: React.FC<ChatbotWrapperProps> = ({ userType }) => {

  const helperFn = config();

  return (
    <>
     
     <Chatbot
  // @ts-expect-error Config function returns an incompatible type
  config={helperFn}
  actionProvider={ActionProvider}
  messageParser={MessageParser}
/>

    </>
  );
};

export default ChatbotWrapper;
