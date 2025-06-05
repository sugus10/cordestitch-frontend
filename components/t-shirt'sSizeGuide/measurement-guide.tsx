"use client";

import { useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

const measurementSteps = [
  {
    title: "Chest Width",
    description: "Measure horizontally across the fullest part of your chest, keeping the tape measure flat against your body.",
    tips: "Make sure the tape is parallel to the floor and stays flat against your body without sagging.",
    imageUrl: "/chest-width.png"
  },
  {
    title: "Body Length",
    description: "Measure from the highest point of the shoulder (where a shoulder seam would sit) straight down to where you want the hem to end.",
    tips: "For most t-shirts, this typically falls at or slightly below your hips.",
    imageUrl: "/body-length.png"
  },
  {
    title: "Sleeve Length",
    description: "Measure from the shoulder seam down the outer arm to where you want the sleeve to end.",
    tips: "For short sleeves, this is typically mid-bicep. Keep your arm relaxed and slightly bent.",
    imageUrl: "/sleeve.png"
  },
  {
    title: "Shoulder Width",
    description: "Measure across your back from the edge of one shoulder to the other, where the sleeve seams would sit.",
    tips: "Make sure to stand up straight and keep your shoulders relaxed, not hunched or pulled back.",
    imageUrl: "/shoulder.png"
  }
];


export default function MeasurementGuide() {
  const [activeStep, setActiveStep] = useState(0);
  
  return (
    <div className="measurement-guide">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#3b3b3b] mb-4">How to Measure Yourself</h3>
        <p className="text-[#3b3b3b]/70">
          Follow these simple steps to take accurate measurements and find your perfect t-shirt size.
          All you need is a soft measuring tape and possibly a friend to help.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="sticky top-4">
            <div className="rounded-lg overflow-hidden border border-[#3b3b3b]/10 aspect-square relative mb-4">
              <Image
                src={measurementSteps[activeStep].imageUrl}
                alt={measurementSteps[activeStep].title}
                fill
                className="object-contain"
              />
          
            </div>
            
            <div className="bg-white border border-[#3b3b3b]/10 p-4 rounded-lg">
              <p className="text-[#3b3b3b]/80 text-sm italic">
                <strong>Tip:</strong> {measurementSteps[activeStep].tips}
              </p>
            </div>
          </div>
        </div>
        
        <div className="measurement-steps">
          {measurementSteps.map((step, index) => (
            <div 
              key={index}
              className={`p-5 mb-4 rounded-lg border transition-all cursor-pointer ${
                activeStep === index 
                  ? "border-[#3b3b3b] bg-[#f9f9f9] shadow-sm"
                  : "border-[#3b3b3b]/10 hover:border-[#3b3b3b]/30"
              }`}
              onClick={() => setActiveStep(index)}
            >
              <div className="flex items-center mb-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-3 text-sm font-medium ${
                  activeStep === index 
                    ? "bg-[#3b3b3b] text-white" 
                    : "bg-[#f5f5f5] text-[#3b3b3b]"
                }`}>
                  {index + 1}
                </div>
                <h4 className="text-lg font-semibold text-[#3b3b3b]">{step.title}</h4>
              </div>            </div>
          ))}
        </div>
      </div>
      
      <Separator className="my-8 bg-[#3b3b3b]/10" />
      
      <div className="measurement-faq">
        <h3 className="text-xl font-bold text-[#3b3b3b] mb-6">Frequently Asked Questions</h3>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-[#3b3b3b]/10">
            <AccordionTrigger className="text-[#3b3b3b] hover:text-[#3b3b3b] hover:no-underline font-medium">
              What if I'm between sizes?
            </AccordionTrigger>
            <AccordionContent className="text-[#3b3b3b]/70">
              If you're between sizes, we generally recommend sizing up for a more comfortable fit. 
              However, if you prefer a more fitted look, go with the smaller size. Consider the style 
              of the t-shirt as well - regular fit t-shirts offer a bit more room than slim fit styles.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-[#3b3b3b]/10">
            <AccordionTrigger className="text-[#3b3b3b] hover:text-[#3b3b3b] hover:no-underline font-medium">
              Do I need someone to help me measure?
            </AccordionTrigger>
            <AccordionContent className="text-[#3b3b3b]/70">
              While you can take most measurements yourself, having someone assist you will result 
              in more accurate measurements, especially for chest width and shoulder width. If measuring 
              alone, use a mirror to ensure the measuring tape is positioned correctly.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border-[#3b3b3b]/10">
            <AccordionTrigger className="text-[#3b3b3b] hover:text-[#3b3b3b] hover:no-underline font-medium">
              Should I measure over clothes or directly on my body?
            </AccordionTrigger>
            <AccordionContent className="text-[#3b3b3b]/70">
              For the most accurate measurements, measure directly over your body wearing only lightweight, 
              form-fitting clothes like a t-shirt. Avoid taking measurements over bulky clothing as this 
              will result in larger measurements and potentially an oversized fit.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border-[#3b3b3b]/10">
            <AccordionTrigger className="text-[#3b3b3b] hover:text-[#3b3b3b] hover:no-underline font-medium">
              What if I don't have a measuring tape?
            </AccordionTrigger>
            <AccordionContent className="text-[#3b3b3b]/70">
              If you don't have a soft measuring tape, you can use a piece of string or ribbon 
              and then measure it against a ruler or hard measuring tape. Alternatively, you can 
              measure a t-shirt that fits you well and compare those measurements to our size chart.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}