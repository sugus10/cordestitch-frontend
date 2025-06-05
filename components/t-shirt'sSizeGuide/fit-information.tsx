// "use client";

// import Image from "next/image";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// const fitStyles = [
//   {
//     id: "classic",
//     name: "Classic Fit",
//     description: "Our classic fit offers a comfortable, relaxed silhouette with room in the chest and waist. The sleeves are slightly longer and the overall length provides good coverage.",
//     idealFor: "Those who prefer a traditional, looser fit with plenty of room to move. Great for all body types.",
//     characteristics: [
//       "Relaxed through chest and waist",
//       "Straight cut from chest to hem",
//       "Comfortable, non-restrictive fit",
//       "Slightly longer sleeves"
//     ],
//     imageUrl: "https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&w=600"
//   },
//   {
//     id: "modern",
//     name: "Modern Fit",
//     description: "Our modern fit offers a middle ground between classic and slim fits. It provides a cleaner silhouette while still maintaining comfort through the body.",
//     idealFor: "Those looking for a contemporary silhouette without the tightness of a slim fit. Versatile for most body types.",
//     characteristics: [
//       "Slightly tapered through the waist",
//       "More defined shape than classic fit",
//       "Mid-length sleeves",
//       "Contemporary length"
//     ],
//     imageUrl: "https://images.pexels.com/photos/7691127/pexels-photo-7691127.jpeg?auto=compress&cs=tinysrgb&w=600"
//   },
//   {
//     id: "slim",
//     name: "Slim Fit",
//     description: "Our slim fit offers a contemporary, streamlined silhouette that sits closer to the body. The sleeves are slightly shorter and narrower, and the body is tapered at the waist.",
//     idealFor: "Those who prefer a more tailored, fashion-forward look. Best for lean to average body types.",
//     characteristics: [
//       "Fitted through chest and tapered at waist",
//       "Shorter, more fitted sleeves",
//       "Narrower shoulders",
//       "Slightly shorter length"
//     ],
//     imageUrl: "https://images.pexels.com/photos/6311652/pexels-photo-6311652.jpeg?auto=compress&cs=tinysrgb&w=600"
//   },
//   {
//     id: "oversized",
//     name: "Oversized Fit",
//     description: "Our oversized fit offers an intentionally loose, relaxed silhouette throughout. Features dropped shoulders, wider sleeves, and a longer body for that trending oversized look.",
//     idealFor: "Those who prefer a streetwear-inspired, fashion-forward look. Works for all body types.",
//     characteristics: [
//       "Extra room throughout the garment",
//       "Dropped shoulders",
//       "Wider, longer sleeves",
//       "Extended body length"
//     ],
//     imageUrl: "https://images.pexels.com/photos/9558583/pexels-photo-9558583.jpeg?auto=compress&cs=tinysrgb&w=600"
//   }
// ];

// const materialInfo = [
//   {
//     id: "cotton",
//     name: "100% Cotton",
//     description: "Our premium 100% cotton t-shirts offer unmatched comfort and breathability, perfect for everyday wear.",
//     properties: [
//       { name: "Weight", value: "Medium (5.3 oz/yd²)" },
//       { name: "Feel", value: "Soft, breathable, gets softer with washes" },
//       { name: "Shrinkage", value: "Minimal (pre-shrunk)" },
//       { name: "Care", value: "Machine wash cold, tumble dry low" }
//     ]
//   },
//   {
//     id: "cotton-poly",
//     name: "Cotton-Poly Blend",
//     description: "Our 50/50 cotton-polyester blend t-shirts offer great durability while maintaining comfort.",
//     properties: [
//       { name: "Weight", value: "Medium-light (4.3 oz/yd²)" },
//       { name: "Feel", value: "Smooth, less prone to wrinkles" },
//       { name: "Shrinkage", value: "Very minimal" },
//       { name: "Care", value: "Machine wash cold, tumble dry medium" }
//     ]
//   },
//   {
//     id: "tri-blend",
//     name: "Tri-Blend",
//     description: "Our premium tri-blend (50% polyester, 25% cotton, 25% rayon) t-shirts offer exceptional softness with a vintage feel.",
//     properties: [
//       { name: "Weight", value: "Light (3.8 oz/yd²)" },
//       { name: "Feel", value: "Ultra-soft, vintage texture, drapes well" },
//       { name: "Shrinkage", value: "Minimal" },
//       { name: "Care", value: "Machine wash cold, tumble dry low" }
//     ]
//   }
// ];

// export default function FitInformation() {
//   return (
//     <div className="fit-information">
//       <div className="mb-8">
//         <h3 className="text-2xl font-bold text-[#3b3b3b] mb-4">Understanding Our Fits & Materials</h3>
//         <p className="text-[#3b3b3b]/70">
//           We offer a variety of fits and materials to ensure you find the perfect t-shirt for your style and comfort preferences.
//         </p>
//       </div>
      
//       <Tabs defaultValue="fit-styles" className="mb-12">
//         <TabsList className="w-full max-w-md mx-auto mb-8 bg-[#f5f5f5] p-1 h-auto">
//           <TabsTrigger 
//             value="fit-styles" 
//             className="flex-1 py-3 data-[state=active]:bg-white data-[state=active]:text-[#3b3b3b] data-[state=active]:shadow-md transition-all"
//           >
//             Fit Styles
//           </TabsTrigger>
//           <TabsTrigger 
//             value="materials" 
//             className="flex-1 py-3 data-[state=active]:bg-white data-[state=active]:text-[#3b3b3b] data-[state=active]:shadow-md transition-all"
//           >
//             Materials
//           </TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="fit-styles" className="focus-visible:outline-none focus-visible:ring-0">
//           <Tabs defaultValue={fitStyles[0].id} orientation="vertical" className="flex flex-col md:flex-row gap-8">
//             <TabsList className="md:w-56 bg-[#f5f5f5] p-1 md:flex-col h-auto">
//               {fitStyles.map((style) => (
//                 <TabsTrigger 
//                   key={style.id}
//                   value={style.id} 
//                   className="flex-1 py-3 justify-start text-left data-[state=active]:bg-white data-[state=active]:text-[#3b3b3b] data-[state=active]:shadow-md transition-all"
//                 >
//                   {style.name}
//                 </TabsTrigger>
//               ))}
//             </TabsList>
            
//             {fitStyles.map((style) => (
//               <TabsContent 
//                 key={style.id}
//                 value={style.id} 
//                 className="flex-1 focus-visible:outline-none focus-visible:ring-0"
//               >
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="rounded-lg overflow-hidden border border-[#3b3b3b]/10 aspect-[4/5] relative">
//                     <Image
//                       src={style.imageUrl}
//                       alt={style.name}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
                  
//                   <div>
//                     <h3 className="text-2xl font-bold text-[#3b3b3b] mb-4">{style.name}</h3>
//                     <p className="text-[#3b3b3b]/70 mb-6">{style.description}</p>
                    
//                     <div className="mb-6">
//                       <h4 className="text-lg font-semibold text-[#3b3b3b] mb-2">Ideal For</h4>
//                       <p className="text-[#3b3b3b]/70">{style.idealFor}</p>
//                     </div>
                    
//                     <div>
//                       <h4 className="text-lg font-semibold text-[#3b3b3b] mb-2">Characteristics</h4>
//                       <ul className="space-y-2">
//                         {style.characteristics.map((characteristic, i) => (
//                           <li key={i} className="flex items-start">
//                             <span className="inline-block w-2 h-2 rounded-full bg-[#3b3b3b] mt-1.5 mr-2"></span>
//                             <span className="text-[#3b3b3b]/70">{characteristic}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </TabsContent>
//             ))}
//           </Tabs>
//         </TabsContent>
        
//         <TabsContent value="materials" className="focus-visible:outline-none focus-visible:ring-0">
//           <div className="grid md:grid-cols-3 gap-6">
//             {materialInfo.map((material) => (
//               <div 
//                 key={material.id}
//                 className="bg-white rounded-lg border border-[#3b3b3b]/10 overflow-hidden hover:shadow-md transition-shadow"
//               >
//                 <div className="p-6">
//                   <h3 className="text-xl font-bold text-[#3b3b3b] mb-3">{material.name}</h3>
//                   <p className="text-[#3b3b3b]/70 mb-6">{material.description}</p>
                  
//                   <div className="space-y-3">
//                     {material.properties.map((property, i) => (
//                       <div key={i} className="flex justify-between">
//                         <span className="text-sm font-medium text-[#3b3b3b]">{property.name}</span>
//                         <span className="text-sm text-[#3b3b3b]/70">{property.value}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="mt-10 bg-[#f9f9f9] p-6 rounded-lg border border-[#3b3b3b]/10">
//             <h3 className="text-lg font-semibold text-[#3b3b3b] mb-4">Material Care Instructions</h3>
            
//             <div className="space-y-4">
//               <div>
//                 <h4 className="font-medium text-[#3b3b3b] mb-2">Washing</h4>
//                 <p className="text-[#3b3b3b]/70 text-sm">
//                   For all materials, we recommend washing inside out in cold water with similar colors. 
//                   Avoid using bleach or harsh detergents which can break down fabrics and affect prints.
//                 </p>
//               </div>
              
//               <div>
//                 <h4 className="font-medium text-[#3b3b3b] mb-2">Drying</h4>
//                 <p className="text-[#3b3b3b]/70 text-sm">
//                   Tumble dry on low heat or hang dry for the best longevity of both the fabric and any custom prints.
//                   Remove promptly from the dryer to minimize wrinkles.
//                 </p>
//               </div>
              
//               <div>
//                 <h4 className="font-medium text-[#3b3b3b] mb-2">Ironing</h4>
//                 <p className="text-[#3b3b3b]/70 text-sm">
//                   If ironing is necessary, turn the garment inside out and iron on a low-medium setting. 
//                   For printed areas, place a thin cloth between the iron and the garment to protect the design.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }