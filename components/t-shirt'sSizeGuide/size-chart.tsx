"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Size chart data
const sizeChartData = {
  mens: {
    unit: "inches",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    measurements: {
      "Chest Width": ["17", "18.5", "20.5", "22.5", "24.5", "26.5", "28.5"],
      "Body Length": ["27.5", "28.5", "29.5", "30.5", "31.5", "32.5", "33.5"],
      "Sleeve Length": ["8.5", "8.75", "9", "9.25", "9.5", "9.75", "10"],
      "Shoulder Width": ["17", "18", "19", "20", "21", "22", "23"],
      "Neck Width": ["14", "14.5", "15", "15.5", "16", "16.5", "17"],
    }
  },
  unisex: {
    unit: "inches",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    measurements: {
      "Chest Width": ["16.5", "18", "20", "22", "24", "26", "28"],
      "Body Length": ["27", "28", "29", "30", "31", "32", "33"],
      "Sleeve Length": ["8.25", "8.5", "8.75", "9", "9.25", "9.5", "9.75"],
      "Shoulder Width": ["16.5", "17.5", "18.5", "19.5", "20.5", "21.5", "22.5"],
    }
  },
  womens: {
    unit: "inches",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    measurements: {
      "Chest Width": ["15.5", "16.5", "17.5", "18.5", "19.5", "20.5"],
      "Body Length": ["25", "25.5", "26", "26.5", "27", "27.5"],
      "Sleeve Length": ["7", "7.25", "7.5", "7.75", "8", "8.25"],
      "Shoulder Width": ["14.5", "15", "15.5", "16", "16.5", "17"],
      "Waist Width": ["14", "15", "16", "17", "18", "19"],
    }
  },
  metric: {
    unit: "cm",
    sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
    measurements: {
      "Chest Width": ["41.9", "45.7", "50.8", "55.9", "61", "66", "71.1"],
      "Body Length": ["68.6", "71.1", "73.7", "76.2", "78.7", "81.3", "83.8"],
      "Sleeve Length": ["21", "21.6", "22.2", "22.9", "23.5", "24.1", "24.8"],
      "Shoulder Width": ["41.9", "44.5", "47", "49.5", "52.1", "54.6", "57.2"],
    }
  }
};

export default function SizeChart() {
  const [selectedStyle, setSelectedStyle] = useState("unisex");
  const [selectedUnit, setSelectedUnit] = useState("imperial");
  const [highlightedSize, setHighlightedSize] = useState<string | null>(null);
  
  const chartData = selectedUnit === "metric" ? sizeChartData.metric : 
    selectedStyle === "mens" ? sizeChartData.mens :
    selectedStyle === "unisex" ? sizeChartData.unisex : sizeChartData.womens;

  return (
    <div className="size-chart-container animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-40">
            <label className="block text-sm font-medium text-[#3b3b3b] mb-1">Fit Style</label>
            <Select 
              value={selectedStyle} 
              onValueChange={setSelectedStyle}
            >
              <SelectTrigger className="w-full bg-white border-[#3b3b3b]/20 hover:bg-[#f5f5f5] transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mens">Men's</SelectItem>
                <SelectItem value="unisex">Unisex</SelectItem>
                <SelectItem value="womens">Women's</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-40">
            <label className="block text-sm font-medium text-[#3b3b3b] mb-1">Measurement Unit</label>
            <Select 
              value={selectedUnit} 
              onValueChange={setSelectedUnit}
            >
              <SelectTrigger className="w-full bg-white border-[#3b3b3b]/20 hover:bg-[#f5f5f5] transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="imperial">Inches</SelectItem>
                <SelectItem value="metric">Centimeters</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-end">
          <p className="text-[#3b3b3b]/60 text-sm italic">
            All measurements are in {chartData.unit}
          </p>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-[#3b3b3b]/10 shadow-sm">
        <table className="w-full border-collapse">
          <thead className="bg-[#f5f5f5]">
            <tr>
              <th className="text-left p-4 border-b border-r border-[#3b3b3b]/10 min-w-[150px] font-semibold text-[#3b3b3b] sticky left-0 bg-[#f5f5f5]">
                Measurement
              </th>
              {chartData.sizes.map((size) => (
                <th 
                  key={size}
                  className={cn(
                    "p-4 border-b border-r last:border-r-0 border-[#3b3b3b]/10 min-w-[80px] font-semibold text-center transition-all duration-200",
                    highlightedSize === size ? "bg-[#3b3b3b] text-white" : "text-[#3b3b3b] hover:bg-[#3b3b3b]/5"
                  )}
                  onMouseEnter={() => setHighlightedSize(size)}
                  onMouseLeave={() => setHighlightedSize(null)}
                >
                  {size}
                </th>
                
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(chartData.measurements).map(([measurement, values], index) => (
              <tr key={measurement} className={index % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"}>
                <td className="p-4 border-b border-r border-[#3b3b3b]/10 font-medium text-[#3b3b3b] sticky left-0 bg-inherit">
                  {measurement}
                </td>
                {values.map((value, i) => (
                  <td 
                    key={i}
                    className={cn(
                      "p-4 text-center border-b border-r last:border-r-0 border-[#3b3b3b]/10 transition-all duration-200",
                      highlightedSize === chartData.sizes[i] ? "bg-[#3b3b3b]/90 text-white" : "text-[#3b3b3b]/80"
                    )}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 p-6 bg-[#f9f9f9] rounded-lg border border-[#3b3b3b]/10">
        <h3 className="text-xl font-semibold text-[#3b3b3b] mb-4">Size Chart Guide</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-[#3b3b3b] mb-2">How to Use This Chart</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#3b3b3b]/70">
              <li>Select your preferred fit style (Men's, Unisex, or Women's)</li>
              <li>Choose your measurement unit (inches or centimeters)</li>
              <li>Hover over sizes to highlight corresponding measurements</li>
              <li>Compare your measurements with the chart values</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-[#3b3b3b] mb-2">Important Notes</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-[#3b3b3b]/70">
              <li>Measurements may vary slightly between different fabrics</li>
              <li>For between sizes, consider your preferred fit (loose or fitted)</li>
              <li>All garments are pre-shrunk but may shrink slightly after washing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}