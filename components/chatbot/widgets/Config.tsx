import { createChatBotMessage } from "react-chatbot-kit";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";
import logo_img from "../../../public/cut2.png";

import headerImage from "../../../app/assests/images/picsvg_download.png";
import Options from "./comp/Options";
import BusSearch from "./comp/BusSearch";
import LoyaltyPointsForm from "./comp/LoyaltyPointsForm";
import { useDispatch, useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { selectAuth } from "@/components/redux/auth/authSlice";

interface MessageOptions {
  widget?: string;
  delay?: number;
  payload?: any;
}

interface Config {
  botName: string;

  initialMessages: any[];
  customComponents: {
    header: () => React.ReactElement;
    userAvatar: React.FC<any> | null;
  };
  widgets: {
    widgetName: string;
    widgetFunc: (props: any) => React.ReactElement;
    mapStateToProps?: string[];
  }[];
  state: Record<string, unknown>;
  messageParser: any;
  actionProvider: ActionProvider;
}

const config = (): Config => {

  const botName = "Cordestitch";
  const authData = useSelector(selectAuth); 
  const dispatch=useDispatch();
  const [state, setState] = useState({});

  const [setStateFunc, setSetStateFunc] = useState<(stateFunc: (prevState: any) => any) => void>();



  const initialMessages = [
    createChatBotMessage("Welcome to CordeStitch! How can I assist you today?", {
      widget: "options",
    }),
  ];

  const widgets = [
    {
      widgetName: "busSearch",
      widgetFunc: (props: any) => <BusSearch {...props} />,
    },
  
    {
      widgetName: "loyaltyPoints",
      widgetFunc: (props: any) => <LoyaltyPointsForm {...props} />,
    },
  
    {
      widgetName: "options",
      widgetFunc: (props: any) => <Options {...props} />,
    },
  ];
  const actionProvider = new ActionProvider(
    //@ts-ignore
    createChatBotMessage,
    setState,
  
  );
  

  return {
    botName,
    initialMessages,
    customComponents: {
      header: () => (
        <div className="bg-[#3B3B3B] p-2 rounded-none flex gap-1 items-center text-white font-bold">
          <img
            src={logo_img.src}
            alt="Header"
            className="w-5 object-contain ml-2"
          />
          <div>
            <p className="text-sm font-semibold">{botName}</p>
            <p className="text-[10px] -mt-1 text-gray-300">Online</p>
          </div>
        </div>
      ),
      userAvatar: null,
    },
    widgets,
    state: {},
    actionProvider,
    messageParser: new MessageParser(actionProvider, {}),
  };
};

export default config;
