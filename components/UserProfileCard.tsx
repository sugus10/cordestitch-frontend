"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CameraIcon } from "lucide-react";
import { useState } from "react";
import { getInitials } from "@/lib/utils";
import { ProfileData } from "@/lib/type";

interface UserProfileCardProps {
  profileData: ProfileData;
}

export default function UserProfileCard({ profileData }: UserProfileCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="relative h-48 bg-[#3b3b3b]">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4">
          <div className="flex items-end gap-6">
            <div 
              className="relative group -mb-12"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Avatar className="h-24 w-24 border-4 border-white rounded-full">
                <AvatarImage src={profileData.avatar} alt={profileData.name} />
                <AvatarFallback className="text-xl bg-[#3b3b3b] text-white">
                  {getInitials(profileData.name)}
                </AvatarFallback>
              </Avatar>
              
              <button 
                className={`absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-opacity duration-200 cursor-pointer ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                onClick={() => console.log('Change photo')}
              >
                <CameraIcon className="h-8 w-8 text-white" />
              </button>
            </div>
            
            <div className="flex-1 mb-4">
              <h1 className="text-2xl font-bold text-white">{profileData.name}</h1>
              <p className="text-gray-200 text-sm">Member since 2024</p>
            </div>
            
            <div className="mb-4">
              {/* <Button 
                size="sm" 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Edit Profile
              </Button> */}
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <div className="text-2xl font-semibold text-[#3b3b3b]">{profileData.statistics.orders}</div>
            <div className="text-sm text-gray-500">Orders</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-semibold text-[#3b3b3b]">{profileData.statistics.wishlist}</div>
            <div className="text-sm text-gray-500">Wishlist</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-semibold text-[#3b3b3b]">{profileData.statistics.reviews}</div>
            <div className="text-sm text-gray-500">Reviews</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-semibold text-[#3b3b3b]">₹{profileData.statistics.totalSpent}</div>
            <div className="text-sm text-gray-500">Total Spent</div>
          </div>
        </div>
      </div>
    </div>
  );
}   