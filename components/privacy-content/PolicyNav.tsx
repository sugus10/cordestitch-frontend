"use client";

import { motion } from "framer-motion";
import { FileText, Truck, RotateCcw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PolicyNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function PolicyNav({ activeTab, setActiveTab }: PolicyNavProps) {
  const tabs = [
    { id: "privacy", label: "Privacy Policy", icon: FileText },
    { id: "shipping", label: "Shipping Policy", icon: Truck },
    { id: "refund", label: "Refund Policy", icon: RotateCcw },
    { id: "cancellation", label: "Cancellation Policy", icon: XCircle },
  ];
  
  return (
    <nav className="bg-card rounded-xl shadow-sm border overflow-hidden">
      <div className="space-y-0.5 p-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg relative transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/5" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-policy-tab"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}