"use client";
import { useState } from "react";
import { ChevronLeft, Download, Printer, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrivacyPolicyContent from "@/components/privacy-content/PrivacyPolicyContent";
import ShippingPolicyContent from "@/components/privacy-content/ShippingPolicyContent";
import RefundPolicyContent from "@/components/privacy-content/RefundPolicyContent";
import CancellationPolicyContent from "@/components/privacy-content/CancellationPolicyContent";
import PolicyLayout from "@/components/privacy-content/PolicyLayout";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const [activeTab, setActiveTab] = useState("privacy");
  const { toast } = useToast();
  
  const policyTabs = [
    { id: "privacy", label: "Privacy Policy" },
    { id: "shipping", label: "Shipping Policy" },
    { id: "refund", label: "Refund Policy" },
    { id: "cancellation", label: "Cancellation Policy" }
  ];
  
  const renderContent = () => {
    switch (activeTab) {
      case "privacy":
        return <PrivacyPolicyContent />;
      case "shipping":
        return <ShippingPolicyContent />;
      case "refund":
        return <RefundPolicyContent />;
      case "cancellation":
        return <CancellationPolicyContent />;
      default:
        return <PrivacyPolicyContent />;
    }
  };
  
  const handleDownloadPDF = () => {
    window.print();
    toast({
      title: "PDF Download Started",
      description: "Your browser's print dialog will open to save as PDF.",
      duration: 3000,
    });
  };
  
  return (
    <Layout>
      <div className="bg-gradient-to-b from-primary/5 to-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
            <div>
              <Button variant="ghost" size="sm" className="group mb-2" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  Back to Home
                </Link>
              </Button>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Our Policies
              </h1>
              
              <div className="flex items-center mt-2 text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <p>Last updated: June 28, 2025</p>
              </div>
            </div>
            
            <div className="flex gap-3 no-print">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleDownloadPDF}
              >
                <Download className="h-4 w-4 mr-2" />
                Save as PDF
              </Button>
            </div>
          </div>
          
          {/* Main Content Section */}
          <div className="bg-card rounded-xl shadow-md border overflow-hidden">
            {/* Tabs Navigation */}
            <div className="overflow-x-auto no-print">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="border-b bg-muted/50">
                  <TabsList className="h-12 bg-transparent w-full justify-start  rounded-none">
                    {policyTabs.map((tab) => (
                    <TabsTrigger
  key={tab.id}
  value={tab.id}
  className="h-12 px-4 rounded-none
    data-[state=active]:shadow-none
    data-[state=active]:border-b-2
    data-[state=active]:border-primary
    data-[state=active]:border-x-0
    data-[state=active]:border-t-0
    data-[state=active]:border-l-0"
>
  {tab.label}
</TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                {/* Tab Content */}
                <div className="p-6 md:p-8">
                  <TabsContent value={activeTab} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    {renderContent()}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
            
            {/* Print Only Header */}
            <div className="hidden print:block p-8">
              <h2 className="text-2xl font-bold mb-2">
                {policyTabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              <div className="text-sm text-muted-foreground mb-8">
                Cordestitch • Last updated: June 28, 2025
              </div>
              <div className="print:block">
                {renderContent()}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground no-print">
            <p>If you have any questions about our policies, please <Link href="/contact" className="text-primary hover:underline">contact us</Link>.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}