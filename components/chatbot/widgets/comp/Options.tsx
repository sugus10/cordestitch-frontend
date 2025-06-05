"use client"
import React from "react";
import { FaBus, FaClipboardList, FaGift, FaHeadset, FaSignOutAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { CiLogout } from "react-icons/ci";
import { RiLogoutBoxFill } from "react-icons/ri";
import { BiLogOutCircle } from "react-icons/bi";
import { selectAuth } from "@/components/redux/auth/authSlice";


interface Option {
  text: string;
  handler: () => void;
  id: number;
  icon: React.ReactElement;
}

interface OptionsProps {
  actionProvider: {
    handleBusSearch: () => void;
    handleBookingDetails: () => void;
    handleLoyaltyPoints: () => void;
    handleCustomerSupport: () => void;
    handleLogout: () => void;
  };
}

const Options: React.FC<OptionsProps> = ({ actionProvider }) => {
  const authData = useSelector(selectAuth);

  const options: Option[] = [
    { text: "Booking Details", handler: actionProvider.handleBookingDetails, id: 2, icon: <FaClipboardList /> },
    { text: "Customer Support", handler: actionProvider.handleCustomerSupport, id: 4, icon: <FaHeadset /> },
    ...(authData.isAuthenticated
      ? [{ text: "Logout", handler: actionProvider.handleLogout, id: 5, icon: <BiLogOutCircle  style={{ color: 'white', fontSize: '15px' }} />}]
      : []),
  ];

  return (
    <div className="flex flex-wrap justify-center gap-[6px] w-[250px] p-[8px]">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={option.handler}
          className="flex items-center gap-[4px] bg-[#3b3b3b] text-white border-none px-[8px] py-[4px] text-[10px] font-semibold rounded-[6px] cursor-pointer transition-all ease-in-out duration-300 w-[calc(50%-6px)] text-center justify-center min-h-[30px] whitespace-nowrap hover:bg-[#091b3d]"
        >
          {option.icon}
          <span>{option.text}</span>
        </button>
      ))}
    </div>
  );
};

export default Options;
