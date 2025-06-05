"use client";
import React, { useState } from "react";
import "react-chatbot-kit/build/main.css";
import { SiChatbot } from "react-icons/si";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import ChatbotWrapper from "../widgets/ChatbotWrapper";

interface ChatbotComponentProps {
  userType: string;
}

const ChatbotComponent: React.FC<ChatbotComponentProps> = ({ userType }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [isChatbotMinimized, setIsChatbotMinimized] = useState<boolean>(false);

  const toggleChatbot = () => {
    setIsChatbotOpen((prevState) => !prevState);
    if (!isChatbotOpen) setIsChatbotMinimized(false);
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
    setIsChatbotMinimized(false);
  };

  const minimizeChatbot = () => {
    setIsChatbotMinimized((prevState) => !prevState);
  };

  return (
    <>
      {!isChatbotOpen && (
   <button
   className="fixed bottom-20 md:bottom-4 right-4 p-2 bg-[#161616] text-white border-0 h-13 w-13 md:h-15 md:w-15 flex items-center justify-center rounded-full z-50 cursor-pointer"
   onClick={toggleChatbot}
 >
   <SiChatbot className="text-[24px] md:text-[28px] text-white" />
 </button>
      )}

      <AnimatePresence>
        {isChatbotOpen && (
          <motion.div
            initial={{ opacity: 0, y: "10%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "10%" }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-18 md:bottom-5 right-5 max-w-[750px] overflow-hidden bg-white border border-[#ccc] rounded-2xl shadow-lg transition-all duration-300 ease-in-out z-50 ${
              isChatbotMinimized
                ? "h-[50px] w-[80px] max-h-[50px] overflow-hidden z-10"
                : "max-h-screen"
            }`
          }

          >
            <button
              className="absolute top-2 right-2 bg-transparent border-none text-white text-[24px] cursor-pointer z-[99999999999999]"
              onClick={closeChatbot}
            >
              <IoClose className="text-white text-[24px]" />
            </button>

            <div className={`${isChatbotMinimized ? "hidden" : "block"}`}>
              <ChatbotWrapper userType={userType} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotComponent;
