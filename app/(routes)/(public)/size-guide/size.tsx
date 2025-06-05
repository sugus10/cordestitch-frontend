"use client";

import MeasurementGuide from "@/components/t-shirt'sSizeGuide/measurement-guide";
import SizeChart from "@/components/t-shirt'sSizeGuide/size-chart";
import SizeComparison from "@/components/t-shirt'sSizeGuide/size-comparision";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SizeGuidePage() {
  const router=useRouter();
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#3b3b3b]/10 bg-white">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
            <div className="flex cursor-pointer" onClick={()=>{router.back()}}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium" >Back to Store</span>
            </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-[#3b3b3b]">Size Guide</h1>
          <div className="w-24"></div> {/* Space balancer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-[#3b3b3b] text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Fit</h2>
            <p className="text-[#3b3b3b]/70 text-lg max-w-2xl mx-auto">
              Use our comprehensive size guide to ensure your custom t-shirt fits exactly how you want it to.
            </p>
          </div>

          <Tabs defaultValue="size-chart" className="mb-12">
            <TabsList className="w-full mb-8 bg-[#f5f5f5] p-1 h-auto flex flex-wrap">
              <TabsTrigger 
                value="size-chart" 
                className="flex-1 min-w-[140px] py-3 data-[state=active]:bg-white data-[state=active]:text-[#3b3b3b] data-[state=active]:shadow-md transition-all"
              >
                Size Chart
              </TabsTrigger>
              <TabsTrigger 
                value="measurement" 
                className="flex-1 min-w-[140px] py-3 data-[state=active]:bg-white data-[state=active]:text-[#3b3b3b] data-[state=active]:shadow-md transition-all"
              >
                How to Measure
              </TabsTrigger>
              <TabsTrigger 
                value="comparison" 
                className="flex-1 min-w-[140px] py-3 data-[state=active]:bg-white data-[state=active]:text-[#3b3b3b] data-[state=active]:shadow-md transition-all"
              >
                Size Comparison
              </TabsTrigger>
          
            </TabsList>
            
            <TabsContent value="size-chart" className="focus-visible:outline-none focus-visible:ring-0">
              <SizeChart />
            </TabsContent>
            
            <TabsContent value="measurement" className="focus-visible:outline-none focus-visible:ring-0">
              <MeasurementGuide />
            </TabsContent>
            
            <TabsContent value="comparison" className="focus-visible:outline-none focus-visible:ring-0">
              <SizeComparison />
            </TabsContent>
            
            {/* <TabsContent value="fit" className="focus-visible:outline-none focus-visible:ring-0">
              <FitInformation />
            </TabsContent> */}
          </Tabs>

          <div className="bg-[#f9f9f9] p-6 md:p-8 rounded-lg border border-[#3b3b3b]/10">
            <h3 className="text-xl font-semibold text-[#3b3b3b] mb-4">Still Not Sure?</h3>
            <p className="text-[#3b3b3b]/70 mb-4">
              If you're between sizes or have any questions about finding your perfect fit, 
              our customer service team is happy to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-[#3b3b3b] text-white rounded-md hover:bg-[#3b3b3b]/90 transition-colors">
                Contact Support
              </button>
              <button className="px-6 py-3 bg-white border border-[#3b3b3b] text-[#3b3b3b] rounded-md hover:bg-[#f5f5f5] transition-colors">
                Back to Customization
              </button>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
}