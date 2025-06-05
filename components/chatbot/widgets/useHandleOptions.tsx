import { useState } from "react";

interface Options {
  widget?: string;
  loading?: boolean;
  terminateLoading?: boolean;
  [key: string]: any;
}

const useHandleOptions = () => {
  const [messages, setMessages] = useState<any[]>([]);

  const handleOptions = (options?: Options): void => {
    const message = {
      id: `msg-${new Date().getTime()}`,
      message: "How can I help you? Below are some possible options.",
      widget: "options",
      loading: true,
      terminateLoading: true,
      ...options,
    };

    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return { handleOptions, messages };
};

export default useHandleOptions;
