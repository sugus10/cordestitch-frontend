"use client";

import { useState, useRef } from "react";
import { PencilIcon, SaveIcon, XIcon, CameraIcon, UserIcon, Loader2, CheckCircle, Mail, Phone, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileData, ProfileSection, ValidateOTPRequest } from "@/lib/type";
import UserProfileCard from "./UserProfileCard";
import { useUserAPIService } from "@/app/services/data.service";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { OTPInput } from "./ui/otp-input";
import { toast } from "sonner";

type Address = {
  id: number;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

type ProfileDatas = {
  name: string;
  email: string;
  phone: string;
  gender: string;
  avatar: string;
  statistics: {
    orders: number;
    wishlist: number;
    reviews: number;
    totalSpent: number;
  };
  addresses: Address[];
};

const mockProfileData: ProfileDatas = {
  name: "Jayanth Gowda",
  email: "jayanth.m003@gmail.com",
  phone: "6362815412",
  gender: "Male",
  avatar: "",
  statistics: {
    orders: 12,
    wishlist: 8,
    reviews: 4,
    totalSpent: 2580
  },
  addresses: [
    {
      id: 1,
      type: "Home",
      street: "123 Main Street",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001",
      country: "India",
      isDefault: true
    }
  ]
};

export default function ProfileContent() {
  const {
    updateEmailOrPhoneNumber,
    validateOTPForEmailOrPhoneNumber,
    getUserDetails,
    updateProfile,
  } = useUserAPIService();
  
  const [profileData, setProfileData] = useState<ProfileData>(mockProfileData);
  const [editSection, setEditSection] = useState<ProfileSection | null>(null);
  const [formData, setFormData] = useState({
    name: profileData.name,
    email: profileData.email,
    phone: profileData.phone,
    gender: profileData.gender,
    avatar: profileData.avatar
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // OTP Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState<string|null>("");
  const [otpTarget, setOtpTarget] = useState<"email" | "phone">("email");
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);

  const fetchProfileData = async () => {
    try {
      const profileData = await getUserDetails();
      setProfileData(prev => ({
        ...prev,
        name: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.emailAddress,
        phone: profileData.phoneNumber,
        gender: profileData.gender || "Male"
      }));
      setFormData(prev => ({
        ...prev,
        name: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.emailAddress,
        phone: profileData.phoneNumber,
        gender: profileData.gender || "Male"
      }));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const handleEditClick = (section: ProfileSection) => {
    setEditSection(section);
    setFormData({
      ...formData,
      [section]: profileData[section]
    });
  };

  const handleCancelEdit = () => {
    setEditSection(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async () => {
    if (!editSection) return;
  
    try {
      if (editSection === 'email') {
        // For email changes, initiate OTP flow
        setOtpTarget("email");
        setIsOtpModalOpen(true);
        await updateEmailOrPhoneNumber({ emailAddress: formData.email });
      } else if (editSection === 'phone') {
        // For phone changes, initiate OTP flow
        setOtpTarget("phone");
        setIsOtpModalOpen(true);
        await updateEmailOrPhoneNumber({ phoneNumber: formData.phone });
      } else {
        // For other fields, update directly
        const [firstName, lastName] = formData.name.split(' ');
        await updateProfile({
          email: formData.email, // include current email
          firstName,
          lastName,
          gender: formData.gender
        });
        
        setProfileData(prev => ({
          ...prev,
          [editSection]: formData[editSection as keyof typeof formData]
        }));
        setEditSection(null);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast("Please enter a valid 6-digit OTP.");
      return;
    }
  
    setIsOtpVerifying(true);
    try {
      const payload = {
        otpCode,
        [otpTarget === "email" ? "emailAddress" : "phoneNumber"]: 
          otpTarget === "email" ? formData.email : formData.phone,
      };
  
      console.log("Final payload:", payload);
  
      const otpResponse = await validateOTPForEmailOrPhoneNumber(payload);
      
      if (otpResponse) {
        toast.success(`${otpTarget === "email" ? "Email" : "Phone number"} updated!`);
        setIsOtpModalOpen(false);
        setEditSection(null);
        fetchProfileData();
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsOtpVerifying(false);
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
   
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, startIndex: number) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;
  
    const newOtp = otpCode?.split("")!;
    for (let i = 0; i < pasteData.length && startIndex + i < 6; i++) {
      newOtp[startIndex + i] = pasteData[i];
      const next = document.getElementById(`otp-box-${startIndex + i}`) as HTMLInputElement;
      if (next) next.value = pasteData[i];
    }
  
    setOtpCode(newOtp.join(""));
    const focusIndex = Math.min(startIndex + pasteData.length, 5);
    const finalInput = document.getElementById(`otp-box-${focusIndex}`) as HTMLInputElement;
    if (finalInput) finalInput.focus();
  };

  const getFieldIcon = (section: ProfileSection) => {
    switch (section) {
      case 'name': return <User className="w-5 h-5 text-gray-500" />;
      case 'email': return <Mail className="w-5 h-5 text-gray-500" />;
      case 'phone': return <Phone className="w-5 h-5 text-gray-500" />;
      case 'gender': return <UserIcon className="w-5 h-5 text-gray-500" />;
      default: return <User className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const renderFieldContent = (section: ProfileSection) => {
    if (editSection === section) {
      switch (section) {
        case 'gender':
          return (
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1">
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => handleSelectChange(value, 'gender')}
                >
                  <SelectTrigger className="w-full h-12 border-2 border-gray-200 focus:border-[#3b3b3b] focus:ring-2 focus:ring-[#3b3b3b]/20 rounded-xl bg-white shadow-sm transition-all duration-200">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-gray-200 rounded-xl shadow-lg">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSave} 
                  className="h-10 px-4 bg-[#3b3b3b] hover:bg-[#2a2a2a] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-0"
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleCancelEdit} 
                  className="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-0"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        default:
          return (
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1">
                <Input
                  name={section}
                  value={formData[section as keyof typeof formData] as string}
                  onChange={handleInputChange}
                  className="w-full h-12 border-2 border-gray-200 focus:border-[#3b3b3b] focus:ring-2 focus:ring-[#3b3b3b]/20 rounded-xl bg-white shadow-sm transition-all duration-200 text-[#3b3b3b] placeholder-gray-400"
                  placeholder={`Enter your ${section}`}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSave} 
                  className="h-10 px-4 bg-[#3b3b3b] hover:bg-[#2a2a2a] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-0"
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleCancelEdit} 
                  className="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-0"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
      }
    } else {
      return (
        <div className="flex items-center justify-between p-[5px] bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 group hover:shadow-md">
          <div className="flex items-center gap-3">
            {getFieldIcon(section)}
            <span className="text-[#3b3b3b] font-medium text-[14px]">
              {profileData[section]}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditClick(section)}
            className="opacity-60 group-hover:opacity-100 text-gray-500 hover:text-[#3b3b3b] hover:bg-gray-100 rounded-lg transition-all duration-200 h-9 w-9 p-0"
          >
            <PencilIcon className="w-4 h-4" />
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#3b3b3b] mb-3">
            Profile Settings
          </h1>
          <p className="text-gray-600 text-lg">Manage your personal information and preferences</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
            <div className="relative">
              <div className="w-16 h-16 bg-[#3b3b3b] rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#3b3b3b] rounded-full border-3 border-white shadow-md flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-[#3b3b3b]">Personal Information</h2>
              <p className="text-gray-500 text-[16px]">Keep your details up to date</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                {renderFieldContent('name')}
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                {renderFieldContent('email')}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                {renderFieldContent('phone')}
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Gender
                </label>
                {renderFieldContent('gender')}
              </div>
            </div>
          </div>
        </div>

        {/* OTP Verification Modal */}
        <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
          <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl bg-white">
            <DialogHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto w-16 h-16 bg-[#3b3b3b] rounded-2xl flex items-center justify-center shadow-lg">
                {otpTarget === "email" ? (
                  <Mail className="w-8 h-8 text-white" />
                ) : (
                  <Phone className="w-8 h-8 text-white" />
                )}
              </div>
              <DialogTitle className="text-2xl font-bold text-[#3b3b3b]">
                Verify {otpTarget === "email" ? "Email" : "Phone Number"}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base leading-relaxed">
                We've sent a 6-digit verification code to your {otpTarget === "email" ? "email" : "phone number"}.
                Please enter it below to complete the verification.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex justify-center gap-3 py-8">
              {Array(6).fill("").map((_, index) => (
                <Input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="text-center h-14 w-12 md:w-14 text-2xl font-bold border-2 border-gray-200 focus:border-[#3b3b3b] focus:ring-2 focus:ring-[#3b3b3b]/20 rounded-xl bg-white shadow-sm text-[#3b3b3b] transition-all duration-200"
                  value={otpCode![index] || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!/^\d$/.test(val)) {
                      e.target.value = "";
                      return;
                    }

                    const newOtp = [...otpCode!];
                    newOtp[index] = val;
                    setOtpCode(newOtp.join(""));

                    const next = document.getElementById(`otp-box-${index + 1}`) as HTMLInputElement;
                    if (next) next.focus();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otpCode![index]) {
                      const prev = document.getElementById(`otp-box-${index - 1}`) as HTMLInputElement;
                      if (prev) prev.focus();
                    }
                  }}
                  onPaste={(e) => handlePaste(e, index)}
                  id={`otp-box-${index}`}
                />
              ))}
            </div>
            
            <DialogFooter className="flex gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOtpModalOpen(false);
                  setOtpCode(null);
                }}
                className="flex-1 h-12 rounded-xl border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-600 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleOtpSubmit}
                disabled={isOtpVerifying || otpCode?.length !== 6}
                className="flex-1 h-12 bg-[#3b3b3b] hover:bg-[#2a2a2a] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-0"
              >
                {isOtpVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Verify OTP
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}