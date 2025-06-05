"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define type literals for sizes and fit types
type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "3XL";
type FitType = "unisex" | "womens" | "mens";

// Define structure of individual size detail
interface SizeDetail {
  chest: number;
  length: number;
  shoulder: number;
}

// Declare shirt reference type with nested fit types and size info
type ShirtReferences = {
  [fit in FitType]: {
    [size in Size]?: SizeDetail;
  };
};

// Declare brand reference type with a modifier
type Brand = "Gildan" | "Bella+Canvas" | "Next Level" | "American Apparel" | "Champion" | "Hanes";
type BrandReferences = {
  [brand in Brand]: {
    modifier: number;
  };
};

// Now define your actual data with type safety
const shirtReferences: ShirtReferences = {
  unisex: {
    XS: { chest: 16.5, length: 27, shoulder: 16.5 },
    S: { chest: 18, length: 28, shoulder: 17.5 },
    M: { chest: 20, length: 29, shoulder: 18.5 },
    L: { chest: 22, length: 30, shoulder: 19.5 },
    XL: { chest: 24, length: 31, shoulder: 20.5 },
    XXL: { chest: 26, length: 32, shoulder: 21.5 },
    "3XL": { chest: 28, length: 33, shoulder: 22.5 },
  },
  womens: {
    XS: { chest: 15.5, length: 25, shoulder: 14.5 },
    S: { chest: 16.5, length: 25.5, shoulder: 15 },
    M: { chest: 17.5, length: 26, shoulder: 15.5 },
    L: { chest: 18.5, length: 26.5, shoulder: 16 },
    XL: { chest: 19.5, length: 27, shoulder: 16.5 },
    XXL: { chest: 20.5, length: 27.5, shoulder: 17 },
  },
  mens: { // Added mens data
    XS: { chest: 16.5, length: 27, shoulder: 16.5 },
    S: { chest: 18, length: 28, shoulder: 17.5 },
    M: { chest: 20, length: 29, shoulder: 18.5 },
    L: { chest: 22, length: 30, shoulder: 19.5 },
    XL: { chest: 24, length: 31, shoulder: 20.5 },
    XXL: { chest: 26, length: 32, shoulder: 21.5 },
    "3XL": { chest: 28, length: 33, shoulder: 22.5 },
  }
};

const brandReferences: BrandReferences = {
  Gildan: { modifier: 0 },
  "Bella+Canvas": { modifier: -1 },
  "Next Level": { modifier: -1 },
  "American Apparel": { modifier: -1 },
  Champion: { modifier: 1 },
  Hanes: { modifier: 0 },
};

export default function SizeComparison() {
  const [bodyMeasurements, setBodyMeasurements] = useState({
    height: 68, // 5'8" in inches
    weight: 160, // lbs
    chest: 38, // inches
  });
  
  const [fitPreference, setFitPreference] = useState("regular");
  const [currentStyle, setCurrentStyle] = useState<FitType>("unisex");
  const [currentBrand, setCurrentBrand] = useState<Brand>("Gildan");
  
  // Calculate recommended size based on chest measurement and fit preference
  const calculateRecommendedSize = (): Size => {
    // Convert body chest measurement (circumference) to shirt chest width (flat)
    const flatChestMeasurement = bodyMeasurements.chest / 2;
    
    // Determine tolerance based on fit preference
    const tolerance = fitPreference === "loose" ? 2 : 
                     fitPreference === "regular" ? 1 : 0;
    
    const fitType = currentStyle;
    const brandKey = currentBrand;
    
    // Account for brand differences
    const brandModifier = brandReferences[brandKey].modifier;
    
    // Get available sizes
    const sizes = Object.keys(shirtReferences[fitType]) as Size[];
    
    // Initialize recommendedSize with the smallest size
    let recommendedSize: Size = sizes[0];
    
    for (const size of sizes) {
      const shirtSize = shirtReferences[fitType][size];
      if (shirtSize && (flatChestMeasurement + tolerance <= shirtSize.chest + brandModifier)) {
        recommendedSize = size;
        break;
      }
    }
    
    return recommendedSize;
  };
  
  const recommendedSize = calculateRecommendedSize();
  const sizeKeys = Object.keys(shirtReferences[currentStyle]) as Size[];
  const sizeIndex = sizeKeys.indexOf(recommendedSize);
  
  const sizeUp = sizeIndex < sizeKeys.length - 1 ? sizeKeys[sizeIndex + 1] : null;
  const sizeDown = sizeIndex > 0 ? sizeKeys[sizeIndex - 1] : null;
    
  // Helper to convert inches to feet and inches display
  const inchesToFeetAndInches = (inches: number) => {
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };
  return (
    <div className="size-comparison">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-[#3b3b3b] mb-4">Size Comparison Tool</h3>
        <p className="text-[#3b3b3b]/70">
          Enter your measurements and preferences below to get a personalized size recommendation.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-[#f9f9f9] p-6 rounded-lg border border-[#3b3b3b]/10">
          <h4 className="text-lg font-semibold text-[#3b3b3b] mb-6">Your Information</h4>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[#3b3b3b]">
                  Height: {inchesToFeetAndInches(bodyMeasurements.height)}
                </label>
                <span className="text-sm text-[#3b3b3b]/60">{bodyMeasurements.height} inches</span>
              </div>
              <Slider
                value={[bodyMeasurements.height]}
                min={60} // 5'0"
                max={78} // 6'6"
                step={1}
                onValueChange={(value) => setBodyMeasurements({...bodyMeasurements, height: value[0]})}
                className="mb-4"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[#3b3b3b]">
                  Weight: {bodyMeasurements.weight} lbs
                </label>
                <span className="text-sm text-[#3b3b3b]/60">{Math.round(bodyMeasurements.weight * 0.453592)} kg</span>
              </div>
              <Slider
                value={[bodyMeasurements.weight]}
                min={100}
                max={250}
                step={5}
                onValueChange={(value) => setBodyMeasurements({...bodyMeasurements, weight: value[0]})}
                className="mb-4"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[#3b3b3b]">
                  Chest Circumference: {bodyMeasurements.chest} inches
                </label>
                <span className="text-sm text-[#3b3b3b]/60">{Math.round(bodyMeasurements.chest * 2.54)} cm</span>
              </div>
              <Slider
                value={[bodyMeasurements.chest]}
                min={30}
                max={50}
                step={1}
                onValueChange={(value) => setBodyMeasurements({...bodyMeasurements, chest: value[0]})}
                className="mb-4"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-[#3b3b3b] mb-2 block">Fit Preference</label>
              <RadioGroup 
                value={fitPreference} 
                onValueChange={setFitPreference}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fitted" id="fitted" />
                  <Label htmlFor="fitted" className="cursor-pointer">Fitted</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regular" id="regular" />
                  <Label htmlFor="regular" className="cursor-pointer">Regular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="loose" id="loose" />
                  <Label htmlFor="loose" className="cursor-pointer">Loose</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-[#3b3b3b] mb-2 block">Style</label>
                <Select 
                  value={currentStyle} 
                  onValueChange={(value) => setCurrentStyle(value as FitType)}                >
                  <SelectTrigger className="w-full bg-white border-[#3b3b3b]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unisex">Unisex</SelectItem>
                    <SelectItem value="womens">Women's</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-[#3b3b3b] mb-2 block">Brand Reference</label>
                <Select 
                  value={currentBrand} 
                  onValueChange={(value) => setCurrentBrand(value as Brand)}
                  >
                  <SelectTrigger className="w-full bg-white border-[#3b3b3b]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(brandReferences).map((brand) => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="bg-white p-6 rounded-lg border border-[#3b3b3b]/10 mb-6">
            <h4 className="text-lg font-semibold text-[#3b3b3b] mb-4">Your Recommended Size</h4>
            
            <div className="flex justify-center items-center my-6">
              <div className="w-32 h-32 rounded-full bg-[#3b3b3b] flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-3xl font-bold text-white">{recommendedSize}</span>
              </div>
            </div>
            
            <p className="text-center text-[#3b3b3b]/70 mb-6">
              Based on your measurements and preferences, we recommend size <strong>{recommendedSize}</strong> in our {currentStyle} t-shirts.
            </p>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              {sizeDown && (
                <div className="p-3 rounded border border-[#3b3b3b]/20 bg-[#f5f5f5]">
                  <p className="font-medium text-[#3b3b3b] mb-1">{sizeDown}</p>
                  <p className="text-xs text-[#3b3b3b]/60">Fitted</p>
                </div>
              )}
              
              <div className="p-3 rounded border-2 border-[#3b3b3b] bg-white col-start-2">
                <p className="font-bold text-[#3b3b3b] mb-1">{recommendedSize}</p>
                <p className="text-xs text-[#3b3b3b]/60">{fitPreference.charAt(0).toUpperCase() + fitPreference.slice(1)}</p>
              </div>
              
              {sizeUp && (
                <div className="p-3 rounded border border-[#3b3b3b]/20 bg-[#f5f5f5]">
                  <p className="font-medium text-[#3b3b3b] mb-1">{sizeUp}</p>
                  <p className="text-xs text-[#3b3b3b]/60">Looser</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-[#f5f5f5] p-6 rounded-lg border border-[#3b3b3b]/10">
            <h4 className="font-semibold text-[#3b3b3b] mb-3">How Your Size Is Determined</h4>
            <p className="text-sm text-[#3b3b3b]/70 mb-4">
              Our algorithm calculates your recommended size based on your chest measurements, 
              height, weight, and fit preference. The brand reference helps account for sizing 
              differences between popular t-shirt brands.
            </p>
            <div className="text-sm text-[#3b3b3b]/70">
              <p className="font-medium text-[#3b3b3b] mb-1">Key factors in your recommendation:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Chest measurement: Primary factor</li>
                <li>Fit preference: {fitPreference} fit selected</li>
                <li>Brand calibration: Based on {currentBrand}</li>
                <li>Body proportions: Height to weight ratio</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}