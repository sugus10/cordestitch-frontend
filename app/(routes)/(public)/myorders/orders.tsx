"use client";
import { useRef, useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  Calendar,
  Search,
  Filter,
  Star,
  Upload,
  X,
  File,
  Video,
  Loader2Icon,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createReview,
  ReviewDataRequest,
  getOrders,
  uploadFileToS3,
  cancelOrder,
} from "@/app/services/data.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type StatusType =
  | "created"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface StatusBadgeProps {
  status: string;
  isSelected?: boolean;
}
interface ApiResponse {
  status: number;
  message: string;
  data: Order[];
}

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  colorId?: string;
  sizeQuantityList: Record<string, number>;
  totalAmount: number;
  text: Array<{
    inputText: string;
    textSize: number;
    textAlign: string;
    font: string;
    color: string;
    textX: number;
    textY: number;
    position: string;
  }>;
  image: Array<{
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
    imageX: number;
    imageY: number;
    position: string;
  }>;
  sizeOptions?: Record<string, number>;
}

interface Order {
  _id: string;
  userId: string;
  addressId?: string;
  items: OrderItem[];
  amountPaid: number;
  amountPending?: number;
  paymentMode?: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  hasReview:true;
  __v?: number;
}

const StatusBadge = ({ status, isSelected = false }: StatusBadgeProps) => {
  const statusStyles: Record<string, string> = {
    created: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    processing: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    shipped: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
    delivered: "bg-green-100 text-green-800 hover:bg-green-100",
    cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
  };

  const style = statusStyles[status] || "bg-gray-100 text-gray-800";

  return (
    <Badge
      variant="outline"
      className={`${style} border-none ${
        isSelected ? "ring-2 ring-offset-2 ring-gray-400" : ""
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const OrderItemCard = ({ item }: { item: OrderItem }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <img
            src={item.productImage}
            alt={item.productName}
            className="h-12 w-12 rounded-md object-contain border border-gray-200 bg-gray-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-product.png";
            }}
          />
          <h4 className="font-medium text-gray-900">{item.productName}</h4>
        </div>
        <span className="font-medium text-gray-900">
          ₹{item.totalAmount.toLocaleString("en-IN")}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">Sizes:</span>
            {Object.entries(item.sizeQuantityList).map(([size, qty]) => (
              <span key={size} className="text-gray-900">
                {size.toUpperCase()} ({qty})
              </span>
            ))}
          </div>
          
          {item.colorId && (
  <div className="flex items-center gap-2">
    <span className="font-medium">Color:</span>
  
    <span className="text-gray-900">#{item.colorId.slice(-6)}</span>
    <div 
      className="w-5 h-5 rounded-full border border-gray-300" 
      style={{ backgroundColor: `#${item.colorId.slice(-6)}` }}
    />
  </div>
)}

          
         
        </div>
        
        <div className="space-y-1">
          {item.text.length > 0 && (
            <div>
              <span className="font-medium">Custom Text: </span>
              <span className="text-gray-900">{item.text[0].inputText}</span>
            </div>
          )}
          
          {item.image.length > 0 && (
            <div>
              <span className="font-medium">Custom Image: </span>
              <span className="text-gray-900">Yes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);

const [cancelReason, setCancelReason] = useState<string>("");
const [isCancelling, setIsCancelling] = useState(false);
const [cancelError, setCancelError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders() as ApiResponse;
        console.log("API Response:", response);
        
        if (response?.status === 200 && Array.isArray(response.data)) {
          setOrders(response.data);
          sessionStorage.setItem('cartLength', response.data.length.toString());
          const cartLength = response.data.length.toString();
          sessionStorage.setItem('cartLength', cartLength);
                  } else {
          toast.error("Failed to fetch orders");
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error fetching orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    if (type === "image") {
      setImages((prev) => [...prev, ...newFiles]);
    } else {
      setVideos((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number, type: "image" | "video") => {
    if (type === "image") {
      setImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setVideos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const submitReview = async () => {
    if (!reviewOrderId || rating === 0 || !comment.trim()) return;
  
    setIsSubmittingReview(true);
    try {
      const order = orders.find((o) => o._id === reviewOrderId);
      if (!order) throw new Error("Order not found");
  
      const productId = order.items[0].productId;
  
      // Upload images and videos to S3
      const uploadedImages = await Promise.all(
        images.map(async (file) => {
          const url = await uploadFileToS3(file);
          return { url, fileName: file.name };
        })
      );
  
      const uploadedVideos = await Promise.all(
        videos.map(async (file) => {
          const url = await uploadFileToS3(file);
          return { url, fileName: file.name };
        })
      );
  
      const reviewData: ReviewDataRequest = {
        productId,
        rating,
        order_id: order._id,
       comment,
        images: uploadedImages.map(img => img.url),
        videos: uploadedVideos.map(vid => vid.url),
      };
  
      await createReview(reviewData);
      getOrders();
      // Update orders state to mark this order as reviewed
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o._id === order._id 
            ? { ...o, hasReview: true } 
            : o
        )
      );
  
      toast.success("Review Submitted Successfully");
      resetReviewForm();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };
  const router = useRouter();

  const resetReviewForm = () => {
    setReviewOrderId(null);
    setRating(0);
    setComment("");
    setImages([]);
    setVideos([]);
  };

  const filteredOrders = (Array.isArray(orders) ? orders : [])
  .filter(order => {
    // Status filter
    const statusMatch = activeFilter === "All" || order.orderStatus === activeFilter;
    
    // Search filter
    const searchMatch = searchQuery === "" || 
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.razorpayOrderId && order.razorpayOrderId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.items.some(item => 
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return statusMatch && searchMatch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getEstimatedDeliveryDate = (createdAt: string) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 7); // Adding 7 days for estimated delivery
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="mt-4 flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-6" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Mobile Header */}
        <div className="md:hidden bg-white py-3 px-4 border-b border-gray-200 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-900">My Orders</h1>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="hidden md:block text-2xl font-semibold text-gray-900">
              My Orders
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-9 w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Date range</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 3 months</DropdownMenuItem>
                  <DropdownMenuItem>Custom range</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Tabs for filtering */}
          <div className="mb-6 overflow-x-auto">
            <Tabs
              defaultValue="All"
              value={activeFilter}
              onValueChange={setActiveFilter}
              className="w-full"
            >
              <div className="border-b bg-muted/50">
                <TabsList className="h-12 bg-transparent w-full justify-start rounded-full">
                  <TabsTrigger
                    value="All"
                    className="relative h-12 px-4 rounded-none
                      data-[state=active]:shadow-none
                      data-[state=active]:before:content-['']
                      data-[state=active]:before:absolute
                      data-[state=active]:before:bottom-0
                      data-[state=active]:before:left-0
                      data-[state=active]:before:w-full
                      data-[state=active]:before:h-[2px]
                      data-[state=active]:before:bg-primary"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="processing"
                    className="relative h-12 px-4 rounded-none
                      data-[state=active]:shadow-none
                      data-[state=active]:before:content-['']
                      data-[state=active]:before:absolute
                      data-[state=active]:before:bottom-0
                      data-[state=active]:before:left-0
                      data-[state=active]:before:w-full
                      data-[state=active]:before:h-[2px]
                      data-[state=active]:before:bg-primary"
                  >
                    Processing
                  </TabsTrigger>
                  <TabsTrigger
                    value="shipped"
                    className="relative h-12 px-4 rounded-none
                      data-[state=active]:shadow-none
                      data-[state=active]:before:content-['']
                      data-[state=active]:before:absolute
                      data-[state=active]:before:bottom-0
                      data-[state=active]:before:left-0
                      data-[state=active]:before:w-full
                      data-[state=active]:before:h-[2px]
                      data-[state=active]:before:bg-primary"
                  >
                    Shipped
                  </TabsTrigger>
                  <TabsTrigger
                    value="delivered"
                    className="relative h-12 px-4 rounded-none
                      data-[state=active]:shadow-none
                      data-[state=active]:before:content-['']
                      data-[state=active]:before:absolute
                      data-[state=active]:before:bottom-0
                      data-[state=active]:before:left-0
                      data-[state=active]:before:w-full
                      data-[state=active]:before:h-[2px]
                      data-[state=active]:before:bg-primary"
                  >
                    Delivered
                  </TabsTrigger>
                  <TabsTrigger
                    value="cancelled"
                    className="relative h-12 px-4 rounded-none
                      data-[state=active]:shadow-none
                      data-[state=active]:before:content-['']
                      data-[state=active]:before:absolute
                      data-[state=active]:before:bottom-0
                      data-[state=active]:before:left-0
                      data-[state=active]:before:w-full
                      data-[state=active]:before:h-[2px]
                      data-[state=active]:before:bg-primary"
                  >
                    Cancelled
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>

          <div className="mt-4">
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <Card
                    key={order._id}
                    className={`overflow-hidden hover:border-gray-300 transition-colors ${
                      activeFilter !== "All" &&
                      order.orderStatus === activeFilter
                        ? "border-l-4 border-l-primary"
                        : ""
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-100">
                        <div className="flex items-center space-x-2 sm:space-x-4 mb-2 sm:mb-0">
                          <p className="font-medium text-sm sm:text-base text-gray-700">
                            {order.razorpayOrderId
                              ? `#${order._id}`
                              : `#${order._id.slice(-8)}`}
                          </p>
                          <StatusBadge
                            status={order.orderStatus}
                            isSelected={
                              activeFilter !== "All" &&
                              order.orderStatus === activeFilter
                            }
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleOrderDetails(order._id)}
                          >
                            {expandedOrder === order._id ? (
                              <ChevronDown size={18} />
                            ) : (
                              <ChevronRight size={18} />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={order.items[0].productImage}
                              alt="Product thumbnail"
                              className="h-16 w-16 rounded-md object-contain border border-gray-200 bg-gray-100"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder-product.png";
                              }}
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                                  {order.items.length}{" "}
                                  {order.items.length === 1 ? "item" : "items"}
                                </p>
                                <div>
  <h3 className="text-sm sm:text-base font-medium text-gray-900">
    {order.items[0].productName}
  </h3>
  {order.items.length > 1 && (
    <p
      className="text-xs sm:text-sm text-gray-500 mt-1 cursor-help"
      title={order.items.slice(1).map(item => item.productName).join(', ')}
    >
      +{order.items.length - 1} more
    </p>
  )}
</div>



                              </div>
                              <p className="font-medium text-base sm:text-lg">
                                ₹{order.amountPaid.toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Order Details */}
                        {expandedOrder === order._id && (
                          <div className="mt-6 space-y-6">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 mb-3">
                                Order Items
                              </h3>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <OrderItemCard key={idx} item={item} />
                                ))}
                              </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                              <h3 className="text-sm font-medium text-gray-900 mb-3">
                                Order Summary
                              </h3>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Subtotal</span>
                                  <span className="text-sm font-medium">
                                    ₹{order.amountPaid.toLocaleString("en-IN")}
                                  </span>
                                </div>
                                {order.paymentMode && (
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Payment Mode</span>
                                    <span className="text-sm font-medium capitalize">
                                      {order.paymentMode}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-gray-100">
                                  <span className="text-sm font-medium text-gray-900">
                                    Total Paid
                                  </span>
                                  <span className="text-sm font-bold text-gray-900">
                                    ₹{order.amountPaid.toLocaleString("en-IN")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                              <h3 className="text-sm font-medium text-gray-900 mb-2">
                                Order Status & Tracking
                              </h3>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Status: </span>
                                  <span className="capitalize">
                                    {order.orderStatus}
                                  </span>
                                </p>
                                <p className="text-sm text-gray-600">
                                  {order.orderStatus === "delivered" ? (
                                    <span>Delivered on {formatDate(order.updatedAt)}</span>
                                  ) : (
                                    <span>
                                      Estimated Delivery: {getEstimatedDeliveryDate(order.createdAt)}
                                    </span>
                                  )}
                                </p>
                                {order.razorpayPaymentId && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Payment ID: </span>
                                    <span>{order.razorpayPaymentId}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    {order.orderStatus !== "cancelled" && (
                      <CardFooter className="bg-white px-4 sm:px-6 py-4 border-t border-gray-100 flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs sm:text-sm px-3"
                        >
                          Track Order
                        </Button>
                        <Button
      variant="outline"
      size="sm"
      className="text-xs sm:text-sm px-3"
      onClick={() => router.push('/contact')}
    >
      Contact Support
    </Button>
    {(order.orderStatus === "delivered" || order.orderStatus === "created") && !order.hasReview && (
  <Button
    variant="outline"
    size="sm"
    className="text-xs sm:text-sm px-3"
    onClick={() => setReviewOrderId(order._id)}
  >
    Write Review
  </Button>
)}


{!["cancelled", "delivered"].includes(order.orderStatus) && (
  <Button
    variant="outline"
    size="sm"
    className="text-xs sm:text-sm px-3"
    onClick={() => setCancelOrderId(order._id)}
  >
    Cancel Order
  </Button>
)}

                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 sm:p-12 text-center bg-white">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Filter className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">
                    No orders found
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm max-w-xs">
                    {searchQuery
                      ? "No orders match your search criteria. Try a different search."
                      : "No orders match your current filter. Try changing your filter settings."}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
{/* Cancel Order Dialog */}
{/* Cancel Order Dialog */}
<Dialog
  open={!!cancelOrderId}
  onOpenChange={(open) => {
    if (!open) {
      setCancelOrderId(null);
      setCancelReason("");
      setCancelError(null);
    }
  }}
>
  <DialogContent className="sm:max-w-[500px] rounded-lg">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold text-gray-900">Cancel Order</DialogTitle>
      <DialogDescription className="text-sm text-gray-500 mt-1">
        Please select a reason for cancelling this order.
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-6 py-2">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="cancel-reason" className="text-sm font-medium text-gray-700">
            Reason for cancellation
          </Label>
          <Select
            value={cancelReason}
            onValueChange={(value) => setCancelReason(value)}
          >
            <SelectTrigger className="w-full border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 rounded-md transition-colors">
              <SelectValue placeholder="Select a reason" className="placeholder-gray-400" />
            </SelectTrigger>
            <SelectContent className="border-gray-200 shadow-lg rounded-md">
              <SelectItem value="changed-mind" className="hover:bg-gray-50 cursor-pointer py-2">
                Changed my mind
              </SelectItem>
              <SelectItem value="found-better-price" className="hover:bg-gray-50 cursor-pointer py-2">
                Found better price elsewhere
              </SelectItem>
              <SelectItem value="shipping-delay" className="hover:bg-gray-50 cursor-pointer py-2">
                Shipping will take too long
              </SelectItem>
              <SelectItem value="ordered-by-mistake" className="hover:bg-gray-50 cursor-pointer py-2">
                Ordered by mistake
              </SelectItem>
              <SelectItem value="other" className="hover:bg-gray-50 cursor-pointer py-2">
                Other reason
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {cancelReason === "other" && (
          <div className="space-y-2">
            <Label htmlFor="other-reason" className="text-sm font-medium text-gray-700">
              Please specify
            </Label>
            <Textarea
              id="other-reason"
              placeholder="Enter your reason here..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="min-h-[100px] border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 rounded-md"
            />
          </div>
        )}
      </div>

      {cancelError && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-start">
          <ExclamationTriangleIcon className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
          <span>{cancelError}</span>
        </div>
      )}
    </div>

    <DialogFooter className="mt-4">
      <Button
        variant="outline"
        onClick={() => {
          setCancelOrderId(null);
          setCancelReason("");
          setCancelError(null);
        }}
        disabled={isCancelling}
        className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
      >
        Cancel
      </Button>
      <Button
        onClick={async () => {
          if (!cancelReason) {
            setCancelError("Please select a reason for cancellation");
            return;
          }

          try {
            setIsCancelling(true);
            setCancelError(null);
            
       const res=await cancelOrder(cancelOrderId!, cancelReason);
            
          if (res){
            setCancelOrderId(null);
            setCancelReason("");
            getOrders();
          }
            
          

          } catch (error) {
            setCancelError(error instanceof Error ? error.message : "Failed to cancel order");
          } finally {
            setIsCancelling(false);
          }
        }}
        disabled={isCancelling}
        className="bg-[#161616] hover:bg-[#161616] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 text-white transition-colors"
      >
        {isCancelling ? (
          <span className="flex items-center">
            <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
            Cancelling...
          </span>
        ) : (
          "Confirm Cancellation"
        )}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
        {/* Review Dialog */}
        <Dialog
          open={!!reviewOrderId}
          onOpenChange={(open) => !open && resetReviewForm()}
        >
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                <Label>Rating</Label>
                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid w-full gap-1.5">
                <Label>Comment</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this order..."
                  className="min-h-[120px]"
                />
              </div>

              <div>
                <Label>Upload Images</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, "image")}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Select Images
                  </Button>
                  {images.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-3">
                        {images.map((file, index) => (
                          <div
                            key={index}
                            className="relative group w-24 h-24 rounded-md overflow-hidden border"
                          >
                            {file.type.startsWith("image/") ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <File className="h-8 w-8 text-gray-400" />
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => removeFile(index, "image")}
                              className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-1 transition-opacity opacity-0 group-hover:opacity-100"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </button>

                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                              {file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Upload Videos</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, "video")}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "video/*";
                      input.multiple = true;
                      input.onchange = (e) =>
                        handleFileUpload(
                          e as unknown as React.ChangeEvent<HTMLInputElement>,
                          "video"
                        );
                      input.click();
                    }}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Select Videos
                  </Button>
                  {videos.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-3">
                        {videos.map((file, index) => (
                          <div
                            key={index}
                            className="relative group w-24 h-24 rounded-md overflow-hidden border"
                          >
                            {file.type.startsWith("video/") ? (
                              <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
                                <Video className="h-8 w-8 text-gray-400" />
                                <span className="text-xs mt-1">Video</span>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <File className="h-8 w-8 text-gray-400" />
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => removeFile(index, "video")}
                              className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-1 transition-opacity opacity-0 group-hover:opacity-100"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </button>

                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                              {file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={resetReviewForm}
                disabled={isSubmittingReview}
              >
                Cancel
              </Button>
              <Button
                onClick={submitReview}
                disabled={isSubmittingReview || rating === 0 || !comment.trim()}
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}