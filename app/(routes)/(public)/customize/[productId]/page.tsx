"use client";
import { useState, useRef, useEffect, FC } from "react";
import {
  Text,
  Image as ImageIcon,
  Palette,
  Type,
  Move,
  Trash2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  RotateCcw,
  RotateCw,
  Undo2,
  Redo2,
  Save,
  Share2,
  Phone,
  HelpCircle,
  ShoppingCart,
  Settings,
  Underline,
  AlignJustify,
  CheckCircle,
  ThumbsUp,
  Camera,
  X,
  ZoomOut,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { TbRulerMeasure2 } from "react-icons/tb";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { Slider } from "@/components/ui/slider";
import {
  addToCart,
  AddToCartPayload,
  getPresignedUrl,
  getProductCustomizationDetails,
  getProductReviews,
  TextConfig,
} from "@/app/services/data.service";
import Link from "next/link";
import { ProductCustomizationResponse } from "@/lib/type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import { Menu } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { selectAuth } from "@/components/redux/auth/authSlice";
import { useLoginModal } from "@/app/context/login-context";
interface ImageConfig {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  imageX: number;
  imageY: number;
  position: "front" | "back" | "left" | "right";
}

// Add this near your other imports
import { Star, StarHalf } from "lucide-react";

interface Review {
  _id: string;
  rating: number;
  description?: string;
  comment?: string;
  images?: string[];
  videos?: string[];
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  review: Review;
}
const ImagePreviewModal: FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  review,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [showSidePanel, setShowSidePanel] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    onIndexChange(newIndex);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    onIndexChange(newIndex);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
    if (zoomLevel <= 1.5) {
      setImagePosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: any) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y,
      });
    }
  };

  const handleMouseMove = (e: any) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-full h-full flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Toggle Side Panel Button (Mobile) */}
        {!showSidePanel && (
          <button
            onClick={() => setShowSidePanel(true)}
            className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all md:hidden"
          >
            <Info className="w-6 h-6" />
          </button>
        )}

        {/* Main Image Area */}
        <div
          className={`flex-1 flex items-center justify-center relative ${
            showSidePanel ? "md:w-[calc(100%-20rem)]" : "w-full"
          }`}
        >
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-3 hover:bg-opacity-70 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Zoom Controls */}
          <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
          </div>

          {/* Main Image */}
          <div className="relative overflow-hidden w-full h-full flex items-center justify-center">
            <img
              src={images[currentIndex]}
              alt={`Review image ${currentIndex + 1}`}
              className={`max-w-full max-h-full object-contain transition-transform ${
                zoomLevel > 1 ? "cursor-move" : "cursor-default"
              }`}
              style={{
                transform: `scale(${zoomLevel}) translate(${
                  imagePosition.x / zoomLevel
                }px, ${imagePosition.y / zoomLevel}px)`,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              draggable={false}
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} of {images.length}
          </div>
        </div>

        {/* Right Panel - Review Details */}
        {showSidePanel && (
          <div className="w-full md:w-80 bg-white h-1/2 md:h-full overflow-y-auto relative">
            {/* Close Side Panel Button (Mobile) */}
            <button
              onClick={() => setShowSidePanel(false)}
              className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-all md:hidden"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-4 md:p-6">
              {/* User Info */}
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs md:text-sm mr-3">
                  {review.user.firstName.charAt(0)}
                  {review.user.lastName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base mr-2">
                      {review.user.firstName} {review.user.lastName}
                    </h3>
                    {["Rajesh", "Amit"].includes(review.user.firstName) && (
                      <div className="flex items-center bg-green-100 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
                        <CheckCircle className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-600 mr-0.5 md:mr-1" />
                        <span className="text-xxs md:text-xs text-green-700 font-medium">
                          Certified Buyer
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div
                  className={`flex items-center px-2 py-1 rounded text-white text-xs md:text-sm font-medium mr-2 md:mr-3 ${
                    review.rating >= 4
                      ? "bg-green-500"
                      : review.rating >= 3
                      ? "bg-orange-400"
                      : "bg-red-500"
                  }`}
                >
                  <span className="mr-1">{review.rating}</span>
                  <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 md:w-4 md:h-4 ${
                        star <= review.rating
                          ? "fill-orange-400 text-orange-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Title */}
              {review.description && (
                <h4 className="font-semibold text-gray-900 mb-3 text-base md:text-lg leading-tight">
                  {review.description}
                </h4>
              )}

              {/* Review Comment */}
              {review.comment && (
                <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base leading-relaxed">
                  {review.comment}
                </p>
              )}

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2 md:mb-3 text-sm md:text-base">
                    All Photos ({images.length})
                  </h5>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-1.5 md:gap-2">
                    {images.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => onIndexChange(idx)}
                        style={{ backgroundImage: `url(${image})` }}
                        className={`relative w-20 md:w-full h-16 md:h-20 rounded-lg overflow-hidden border-2 bg-center bg-contain bg-no-repeat transition-all hover:shadow-lg ${
                          idx === currentIndex
                            ? "border-blue-500 shadow-md"
                            : "border-gray-200"
                        }`}
                      >
                        {/* Only show <img> on md and up */}
                        <img
                          src={image}
                          alt={`Thumbnail ${idx + 1}`}
                          className="hidden md:block w-full h-full object-cover"
                        />
                        {idx === currentIndex && (
                          <div className="absolute inset-0  bg-opacity-90"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                <div className="flex items-center text-gray-500 text-xs md:text-sm">
                  <Camera className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  {images.length} photo{images.length > 1 ? "s" : ""} from this
                  review
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewsSection = ({ productId = "demo" }: { productId?: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState<Record<number, number>>({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [visibleReviews, setVisibleReviews] = useState(2);
  const [showAll, setShowAll] = useState(false);

  // Image preview modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  interface ReviewResponse {
    success: boolean;
    data: Review[];
    count?: number;
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = (await getProductReviews(productId)) as ReviewResponse;

        if (response?.success) {
          setReviews(response.data);

          if (response.data.length > 0) {
            const total = response.data.reduce(
              (sum, review) => sum + review.rating,
              0
            );
            const avg = total / response.data.length;
            setAverageRating(avg);

            const counts = response.data.reduce(
              (acc: Record<number, number>, review) => {
                acc[review.rating] = (acc[review.rating] || 0) + 1;
                return acc;
              },
              { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            );

            setRatingCounts(counts);
          }
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleImageClick = (review: Review, imageIndex: number) => {
    if (review.images) {
      setSelectedImages(review.images);
      setCurrentImageIndex(imageIndex);
      setSelectedReview(review);
      setIsModalOpen(true);
    }
  };

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    const sizeClasses = {
      sm: "w-3 h-3",
      md: "w-4 h-4",
      lg: "w-5 h-5",
    };

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className={`${sizeClasses[size]} fill-orange-400 text-orange-400`}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf
            key={i}
            className={`${sizeClasses[size]} fill-orange-400 text-orange-400`}
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            className={`${sizeClasses[size]} fill-gray-200 text-gray-200`}
          />
        );
      }
    }

    return stars;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-500";
    if (rating >= 3) return "bg-orange-400";
    return "bg-red-500";
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4) return "Very Good";
    if (rating >= 3) return "Good";
    if (rating >= 2) return "Average";
    return "Poor";
  };

  const isLoyalCustomer = (userFirstName: string) => {
    return ["Rajesh", "Amit"].includes(userFirstName);
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
    setVisibleReviews(showAll ? 2 : reviews.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 bg-red-50 rounded-lg border border-red-200">
        <div className="text-lg font-medium">{error}</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-xl">
        <div className="text-gray-600 mb-6 text-lg">No reviews yet</div>
      </div>
    );
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, visibleReviews);

  return (
    <>
      <section className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Ratings & Reviews
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Rating Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-32">
                {/* Overall Rating */}
                <div className="flex items-center mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center mr-6">
                    <span className="text-4xl font-bold text-gray-900 mr-2">
                      {averageRating.toFixed(1)}
                    </span>
                    <Star className="w-6 h-6 fill-orange-400 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-gray-600 text-lg font-medium mb-1">
                      {getRatingText(averageRating)}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {reviews.length.toLocaleString()} Ratings &{" "}
                      {reviews.length} Reviews
                    </div>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div
                      key={star}
                      className="flex items-center group cursor-pointer"
                    >
                      <div className="flex items-center w-8 mr-3">
                        <span className="text-sm text-gray-700 mr-1">
                          {star}
                        </span>
                        <Star className="w-3 h-3 fill-gray-400 text-gray-400" />
                      </div>
                      <div className="flex-1 mx-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full transition-all duration-300 group-hover:bg-orange-500"
                          style={{
                            width: `${
                              reviews.length > 0
                                ? (ratingCounts[star] / reviews.length) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="w-12 text-xs text-gray-500 text-right font-medium">
                        {ratingCounts[star]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Stats */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-green-700 font-bold text-lg">
                        {Math.round(
                          ((ratingCounts[5] + ratingCounts[4]) /
                            reviews.length) *
                            100
                        )}
                        %
                      </div>
                      <div className="text-green-600 text-xs">Positive</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-blue-700 font-bold text-lg">
                        {
                          reviews.filter((r) => r.images && r.images.length > 0)
                            .length
                        }
                      </div>
                      <div className="text-blue-600 text-xs">With Photos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {displayedReviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start">
                        {/* User Avatar */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm mr-4 flex-shrink-0">
                          {review.user.firstName.charAt(0)}
                          {review.user.lastName.charAt(0)}
                        </div>

                        <div className="flex-grow">
                          {/* User Info */}
                          <div className="flex items-center mb-2">
                            <h3 className="font-semibold text-gray-900 mr-2">
                              {review.user.firstName} {review.user.lastName}
                            </h3>
                            {isLoyalCustomer(review.user.firstName) && (
                              <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                                <span className="text-xs text-green-700 font-medium">
                                  Certified Buyer
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Rating and Date */}
                          <div className="flex items-center mb-3">
                            <div
                              className={`flex items-center px-2 py-1 rounded text-white text-xs font-medium mr-3 ${getRatingColor(
                                review.rating
                              )}`}
                            >
                              <span className="mr-1">{review.rating}</span>
                              <Star className="w-3 h-3 fill-current" />
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Review Title */}
                    {review.description && (
                      <h4 className="font-semibold text-gray-900 mb-3 text-base leading-tight">
                        {review.description}
                      </h4>
                    )}

                    {/* Review Comment */}
                    {review.comment && (
                      <p className="text-gray-700 mb-4 leading-relaxed text-sm">
                        {review.comment}
                      </p>
                    )}

                    {/* Review Images - Clickable */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {review.images.map((image, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleImageClick(review, idx)}
                            className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition-all hover:scale-105 relative group"
                          >
                            <img
                              src={image}
                              alt={`Review image ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                  <ZoomIn className="w-4 h-4 text-gray-700" />
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Review Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4"></div>
                      {review.images && review.images.length > 0 && (
                        <div className="flex items-center text-gray-400 text-xs">
                          <Camera className="w-3 h-3 mr-1" />
                          {review.images.length} photo
                          {review.images.length > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {reviews.length > 2 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={toggleShowAll}
                    className="px-4 py-2 border-2 border-[#3b3b3b] text-[#3b3b3b] rounded-lg hover:bg-blue-50 transition-colors font-medium shadow-sm"
                  >
                    {showAll
                      ? "Show Less Reviews"
                      : `View All ${reviews.length} Reviews`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={selectedImages}
        currentIndex={currentImageIndex}
        onIndexChange={setCurrentImageIndex}
        //@ts-ignore
        review={selectedReview}
      />
    </>
  );
};

const Customize = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState<
    ProductCustomizationResponse["data"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authState = useSelector(selectAuth);
  const { setOpen, open } = useLoginModal();
  const router = useRouter();

  type ResizeHandleStyle = React.CSSProperties & {
    position: "absolute";
    width: string;
    height: string;
    backgroundColor: string;
    border: string;
    zIndex: number;
    cursor: "nwse-resize" | "nesw-resize";
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  // T-shirt color and view options
  const [tshirtColor, setTshirtColor] = useState<string>("");
  // Load stored color on component mount
  useEffect(() => {
    if (product?._id) {
      const storedColor = sessionStorage.getItem(
        `product_${product._id}_color`
      );
      if (storedColor) {
        const { colorCode, colorName } = JSON.parse(storedColor);
        // Find the matching color in product.colors
        const matchingColor = product.colors.find(
          (c) => c.colorCode === colorCode && c.colorName === colorName
        );
        if (matchingColor) {
          setTshirtColor(matchingColor._id);
        }
      }
    }
  }, [product]);

  const handleColorSelect = (colorId: string) => {
    setTshirtColor(colorId);
  };
  const [tshirtView, setTshirtView] = useState<
    "front" | "back" | "left" | "right"
  >("front");

  // Design elements
  const [designElements, setDesignElements] = useState<
    Array<{
      id: string;
      type: "text" | "image";
      content: string;
      x: number;
      y: number;
      width: number;
      height: number;
      rotation: number;
      fontSize?: number;
      fontFamily?: string;
      fontWeight?: string;
      fontStyle?: string;
      textAlign?: string;
      color?: string;
      selected: boolean;
      textDecoration?: string;
      textEffect?: string;
    }>
  >([]);

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const designAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Define the type for a single design element
  type DesignElement = {
    id: string;
    type: "text" | "image";
    content: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    fontStyle?: string;
    textAlign?: string;
    color?: string;
    selected: boolean;
  };

  // Then declare your state like this:
  const [history, setHistory] = useState<DesignElement[][]>([]);
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>(
    {}
  );
  const [historyIndex, setHistoryIndex] = useState(-1);
  const fontFamilies = [
    { id: "sans", name: "Sans-Serif", value: "sans-serif" },
    { id: "serif", name: "Serif", value: "serif" },
    { id: "mono", name: "Monospace", value: "monospace" },
    { id: "poppins", name: "Poppins", value: '"Poppins", sans-serif' },
  ];

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const textColors = [
    { id: "white", name: "White", value: "#ffffff" },
    { id: "black", name: "Black", value: "#000000" },
    { id: "red", name: "Red", value: "#ff0000" },
    { id: "blue", name: "Blue", value: "#0000ff" },
    { id: "yellow", name: "Yellow", value: "#ffff00" },
    { id: "green", name: "Green", value: "#00ff00" },
  ];
  type TShirtView = "front" | "back" | "left" | "right";
  const [resizingElement, setResizingElement] = useState<string | null>(null);
  const [resizeDirection, setResizeDirection] = useState<
    "nw" | "ne" | "sw" | "se" | null
  >(null);
  const [resizeStartSize, setResizeStartSize] = useState({
    width: 0,
    height: 0,
  });
  const [resizeStartPosition, setResizeStartPosition] = useState({
    x: 0,
    y: 0,
  });
  const handleResizeMouseDown = (
    id: string,
    direction: "nw" | "ne" | "sw" | "se",
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.stopPropagation();
    const element = designElements.find((el) => el.id === id);
    if (!element) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setResizingElement(id);
    setResizeDirection(direction);
    setResizeStartSize({ width: element.width, height: element.height });
    setResizeStartPosition({ x: clientX, y: clientY });
  };
  const toggleUnderline = () => {
    if (!selectedElement || !selectedElementData) return;

    const newDecoration =
      selectedElementData.textDecoration === "underline" ? "none" : "underline";

    setDesignElements((prev) =>
      prev.map((el) =>
        el.id === selectedElement
          ? { ...el, textDecoration: newDecoration }
          : el
      )
    );
  };

  const setTextEffect = (effect: string) => {
    if (!selectedElement || !selectedElementData) return;

    setDesignElements((prev) => {
      return prev.map((el) => {
        if (el.id === selectedElement) {
          const updatedElement = {
            ...el,
            textEffect: effect,
          };

          // For circle effect, make height equal to width
          if (effect === "circle") {
            updatedElement.height = el.width;
          }

          return updatedElement;
        }
        return el;
      });
    });
  };

  // 4. Update your existing setTextAlign function to handle 'justify'

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (!resizingElement || !resizeDirection || !designAreaRef.current) return;

    const element = designElements.find((el) => el.id === resizingElement);
    if (!element) return;

    const deltaX = e.clientX - resizeStartPosition.x;
    const deltaY = e.clientY - resizeStartPosition.y;

    let newWidth = resizeStartSize.width;
    let newHeight = resizeStartSize.height;

    // Calculate new dimensions based on resize direction
    switch (resizeDirection) {
      case "se":
        newWidth = Math.max(20, resizeStartSize.width + deltaX);
        newHeight = Math.max(20, resizeStartSize.height + deltaY);
        break;
      case "sw":
        newWidth = Math.max(20, resizeStartSize.width - deltaX);
        newHeight = Math.max(20, resizeStartSize.height + deltaY);
        break;
      case "ne":
        newWidth = Math.max(20, resizeStartSize.width + deltaX);
        newHeight = Math.max(20, resizeStartSize.height - deltaY);
        break;
      case "nw":
        newWidth = Math.max(20, resizeStartSize.width - deltaX);
        newHeight = Math.max(20, resizeStartSize.height - deltaY);
        break;
    }

    updateElementSize(newWidth, newHeight);
  };

  const handleResizeMouseUp = () => {
    setResizingElement(null);
    setResizeDirection(null);
  };
  // Fetch product data on component mount
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await getProductCustomizationDetails(
          productId as string
        );
        if (response.status === 200) {
          setProduct(response.data);
          // Set the first color as default
          if (response.data.colors.length > 0) {
            setTshirtColor(response.data.colors[0]._id);
          }
        } else {
          setError("Failed to load product details");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);
  const saveToHistory = (currentElements: DesignElement[]) => {
    setHistory((prev) => {
      const newHistory =
        historyIndex !== prev.length - 1
          ? prev.slice(0, historyIndex + 1)
          : prev;

      return [...newHistory, currentElements.map((el) => ({ ...el }))];
    });
    setHistoryIndex((prev) => prev + 1);
  };
  const handleUndo = () => {
    if (historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setDesignElements(history[newIndex].map((el) => ({ ...el })));
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setDesignElements(history[newIndex].map((el) => ({ ...el })));
  };
  useEffect(() => {
    if (designElements.length > 0 && history.length === 0) {
      saveToHistory(designElements);
    }
  }, [designElements]);
  // Add text element
  const addTextElement = () => {
    const newElement = {
      id: `text-${Date.now()}`,
      type: "text" as const,
      content: "Add your text",
      x: 150,
      y: 150,
      width: 200,
      height: 50,
      rotation: 0,
      fontSize: 24,
      fontFamily: "sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "center",
      color: "#000000",
      selected: true,
    };

    const newElements = designElements
      .map((el) => ({ ...el, selected: false }))
      .concat(newElement);
    setDesignElements(newElements);
    setSelectedElement(newElement.id);
    saveToHistory(newElements);
  };

  // Add image element
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          const newElement = {
            id: `image-${Date.now()}`,
            type: "image" as const,
            content: e.target.result,
            x: 150,
            y: 150,
            width: 150,
            height: 150,
            rotation: 0,
            selected: true,
          };

          setDesignElements((prev) =>
            prev.map((el) => ({ ...el, selected: false })).concat(newElement)
          );
          setSelectedElement(newElement.id);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  // Select element
  const handleElementClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDesignElements((prev) =>
      prev.map((el) => ({ ...el, selected: el.id === id }))
    );
    setSelectedElement(id);
  };

  // Start dragging element
  // Update handleMouseDown to handle touch events
  const handleMouseDown = (
    id: string,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const element = designElements.find((el) => el.id === id);
    if (!element) return;

    setDragOffset({
      x: clientX - element.x,
      y: clientY - element.y,
    });

    setDraggedElement(id);
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (draggedElement && designAreaRef.current) {
        const designAreaRect = designAreaRef.current.getBoundingClientRect();
        const x = clientX - designAreaRect.left - dragOffset.x;
        const y = clientY - designAreaRect.top - dragOffset.y;

        setDesignElements((prev) =>
          prev.map((el) => {
            if (el.id === draggedElement) {
              return { ...el, x, y };
            }
            return el;
          })
        );
      } else if (resizingElement) {
        handleResizeMouseMove(e as MouseEvent);
      }
    };

    const handleUp = () => {
      if (draggedElement) {
        setDraggedElement(null);
      }
      if (resizingElement) {
        handleResizeMouseUp();
      }
    };

    // Add both mouse and touch listeners
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("touchmove", handleMove as EventListener);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("touchend", handleUp);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove as EventListener);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchend", handleUp);
    };
  }, [draggedElement, dragOffset, resizingElement, resizeDirection]);
  // Add this style for resize handles
  const baseResizeHandleStyle: ResizeHandleStyle = {
    position: "absolute",
    width: "8px",
    height: "8px",
    backgroundColor: "#3182ce",
    border: "1px solid white",
    zIndex: 20,
    cursor: "nwse-resize", // Default cursor
  };
  // Update your element rendering to include resize handles when selected

  // Clear design area when clicking on it
  const handleDesignAreaClick = () => {
    setDesignElements((prev) => prev.map((el) => ({ ...el, selected: false })));
    setSelectedElement(null);
  };

  // Update text content
  const updateTextContent = (content: string) => {
    if (!selectedElement) return;

    setDesignElements((prev) => {
      const newElements = prev.map((el) => {
        if (el.id === selectedElement && el.type === "text") {
          return { ...el, content };
        }
        return el;
      });
      saveToHistory(newElements);
      return newElements;
    });
  };

  // Update font family
  const updateFontFamily = (fontFamily: string) => {
    if (!selectedElement) return;

    setDesignElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedElement && el.type === "text") {
          return { ...el, fontFamily };
        }
        return el;
      })
    );
  };

  // Update font size
  const updateFontSize = (fontSize: number) => {
    if (!selectedElement) return;

    setDesignElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedElement && el.type === "text") {
          return { ...el, fontSize };
        }
        return el;
      })
    );
  };

  const toggleBold = () => {
    if (!selectedElement) return;

    setDesignElements((prev) => {
      const newElements = prev.map((el) => {
        if (el.id === selectedElement && el.type === "text") {
          const newWeight = el.fontWeight === "bold" ? "normal" : "bold";
          return { ...el, fontWeight: newWeight };
        }
        return el;
      });
      saveToHistory(newElements);
      return newElements;
    });
  };

  // Toggle italic
  const toggleItalic = () => {
    if (!selectedElement) return;

    setDesignElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedElement && el.type === "text") {
          const newStyle = el.fontStyle === "italic" ? "normal" : "italic";
          return { ...el, fontStyle: newStyle };
        }
        return el;
      })
    );
  };

  // Set text alignment
  const setTextAlign = (textAlign: string) => {
    if (!selectedElement) return;

    setDesignElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedElement && el.type === "text") {
          return { ...el, textAlign };
        }
        return el;
      })
    );
  };

  // Set text color
  const setTextColor = (color: string) => {
    if (!selectedElement) return;

    setDesignElements((prev) => {
      const newElements = prev.map((el) => {
        if (el.id === selectedElement && el.type === "text") {
          return { ...el, color };
        }
        return el;
      });
      saveToHistory(newElements);
      return newElements;
    });
  };

  // Delete selected element
  const deleteSelectedElement = () => {
    if (!selectedElement) return;

    setDesignElements((prev) => prev.filter((el) => el.id !== selectedElement));
    setSelectedElement(null);
  };

  // Resize element
  const updateElementSize = (width: number, height: number) => {
    if (!selectedElement) return;

    setDesignElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedElement) {
          return { ...el, width, height };
        }
        return el;
      })
    );
  };

  // Rotate element
  const rotateElement = (direction: "clockwise" | "counterclockwise") => {
    if (!selectedElement) return;

    setDesignElements((prev) =>
      prev.map((el) => {
        if (el.id === selectedElement) {
          const delta = direction === "clockwise" ? 5 : -5;
          return { ...el, rotation: (el.rotation + delta) % 360 };
        }
        return el;
      })
    );
  };

  // Move element to front
  const moveToFront = () => {
    if (!selectedElement) return;

    setDesignElements((prev) => {
      const elementIndex = prev.findIndex((el) => el.id === selectedElement);
      if (elementIndex === -1 || elementIndex === prev.length - 1) return prev;

      const element = prev[elementIndex];
      const newElements = [
        ...prev.slice(0, elementIndex),
        ...prev.slice(elementIndex + 1),
        element,
      ];

      return newElements;
    });
  };

  // Move element to back
  const moveToBack = () => {
    if (!selectedElement) return;

    setDesignElements((prev) => {
      const elementIndex = prev.findIndex((el) => el.id === selectedElement);
      if (elementIndex === -1 || elementIndex === 0) return prev;

      const element = prev[elementIndex];
      const newElements = [
        element,
        ...prev.slice(0, elementIndex),
        ...prev.slice(elementIndex + 1),
      ];

      return newElements;
    });
  };

  const pixelsToCm = (pixels: number): number => {
    const DPI = 96; // Standard screen DPI
    return (pixels * 2.54) / DPI;
  };
  // Save current view's elements before switching views
  // When saving positions (convert to percentages)
  const saveCurrentViewElements = () => {
    if (!designAreaRef.current) return;

    const designAreaRect = designAreaRef.current.getBoundingClientRect();
    const elementsWithRelativePositions = designElements.map((el) => ({
      ...el,
      xPercent: (el.x / designAreaRect.width) * 100,
      yPercent: (el.y / designAreaRect.height) * 100,
      widthPercent: (el.width / designAreaRect.width) * 100,
      heightPercent: (el.height / designAreaRect.height) * 100,
    }));

    sessionStorage.setItem(
      `design_${tshirtView}`,
      JSON.stringify(elementsWithRelativePositions)
    );
  };

  // When loading positions (convert back to pixels)
  const loadViewElements = (view: TShirtView) => {
    if (!designAreaRef.current) return;

    const designAreaRect = designAreaRef.current.getBoundingClientRect();
    const savedElements = sessionStorage.getItem(`design_${view}`);

    if (savedElements) {
      const elements = JSON.parse(savedElements).map((el: any) => ({
        ...el,
        x: (el.xPercent * designAreaRect.width) / 100,
        y: (el.yPercent * designAreaRect.height) / 100,
        width: (el.widthPercent * designAreaRect.width) / 100,
        height: (el.heightPercent * designAreaRect.height) / 100,
      }));
      setDesignElements(elements);
    } else {
      setDesignElements([]);
    }
  };

  // Load elements for the new view

  const selectedElementData = selectedElement
    ? designElements.find((el) => el.id === selectedElement)
    : null;
  const selectedColor = product?.colors.find(
    (color) => color._id === tshirtColor
  );
  useEffect(() => {
    console.log("Selected element updated:", selectedElementData);
  }, [selectedElementData]);
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
          <p className="ml-4">Loading product details...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            href="/"
            className="px-4 py-2 bg-brand-accent text-white rounded-lg"
          >
            Return to Home
          </Link>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center h-64">
          <p className="text-gray-500 mb-4">Product not found</p>
          <Link
            href="/"
            className="px-4 py-2 bg-brand-accent text-white rounded-lg"
          >
            Return to Home
          </Link>
        </div>
      </Layout>
    );
  }
  const availableSizes = Object.keys(product.sizeList || {});

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        {/* Header Toolbar */}
        {/* Header Toolbar */}
        <div className="bg-gray-100 py-3 px-4 sm:px-6 flex justify-between items-center border-b">
          <button
            onClick={() => (window.location.href = "/size-guide")}
            className="text-sm text-blue-800 hover:underline  cursor-pointer flex items-center gap-1"
          >
            <TbRulerMeasure2 className="w-4 h-4 opacity-70" />
            Size Guide
          </button>
          {/* Title - shrinks on mobile */}
          <h1 className="text-lg sm:text-xl hidden  lg:block font-bold">
            Personalize Your T-Shirt
          </h1>

          {/* Desktop Toolbar - unchanged */}
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              className="flex items-center gap-1 cursor-pointer"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
            >
              <Undo2 size={16} /> <span className="hidden md:inline">Undo</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-1 cursor-pointer"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo2 size={16} /> <span className="hidden md:inline">Redo</span>
            </Button>
            <Button variant="ghost" className="flex items-center gap-1">
              <Save size={16} /> <span className="hidden md:inline">Save</span>
            </Button>
          </div>

          {/* Mobile Toolbar - with Gear icon and "More" text */}
          <div className="hidden relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  <Settings size={18} />
                  <span className="sr-only">More actions</span>
                  <span className="text-sm">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="flex items-center gap-2"
                >
                  <Undo2 size={16} /> Undo
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="flex items-center gap-2"
                >
                  <Redo2 size={16} /> Redo
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Save size={16} /> Save Design
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-28">
            {/* Left Column - T-shirt preview area */}
            <div className="lg:col-span-2 bg-white rounded-lg p-2">
              {/* Desktop View (unchanged) */}
              <div className="mt-4 mb-6  gap-6 items-center hidden lg:flex ">
                <div className="flex  justify-between items-center mb-2">
                  <h2 className="font-medium text-gray-700">Select Color:</h2>
                </div>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color._id}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tshirtColor === color._id
                          ? "ring-2 ring-offset-2 ring-brand-accent"
                          : ""
                      }`}
                      style={{ backgroundColor: color.colorCode }}
                      onClick={() => handleColorSelect(color._id)}
                      title={color.colorName}
                      aria-label={`Select ${color.colorName} color`}
                    >
                      {tshirtColor === color._id && (
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 13L9 17L19 7"
                            stroke={
                              color.colorCode === "#ffffff" ? "black" : "white"
                            }
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="hidden lg:flex justify-between gap-12 items-start mb-4">
                <div className="flex flex-col items-center space-y-9 mt-10">
                  {(["front", "back", "right", "left"] as const).map((view) => (
                    <div
                      key={view}
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => {
                        saveCurrentViewElements();
                        setTshirtView(view);
                        loadViewElements(view);
                      }}
                    >
                      <div
                        className={`w-20 h-20 rounded-full border-2 flex items-center justify-center ${
                          tshirtView === view ? "border-blue-600" : "border"
                        }`}
                      >
                        <img
                          src={selectedColor!.colorImage[view]}
                          alt={`${view} view`}
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <span
                        className={`text-xs mt-2 ${
                          tshirtView === view
                            ? "text-gray-800 font-semibold"
                            : "text-gray-400"
                        }`}
                      >
                        {view.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="relative flex justify-center">
                  <div
                    ref={designAreaRef}
                    className="relative w-full max-w-lg aspect-[3/4] bg-gray-50 design-element"
                    onClick={handleDesignAreaClick}
                    onTouchStart={handleDesignAreaClick}
                    style={{
                      backgroundSize: "20px 20px",
                      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                      position: "relative",
                      overflow: "hidden",
                      touchAction: "none", // Prevent browser touch gestures
                    }}
                  >
                    {selectedColor && (
                      <img
                        src={selectedColor.colorImage[tshirtView]}
                        alt={`${selectedColor.colorName} t-shirt ${tshirtView} view`}
                        className="w-full h-full object-contain rounded-md"
                      />
                    )}
                    {designElements.map((element) => (
                      <div
                        key={element.id}
                        className={`absolute cursor-move ${
                          element.selected ? "outline-2 outline-blue-500" : ""
                        }`}
                        style={{
                          left: `${element.x}px`,
                          top: `${element.y}px`,
                          width: `${element.width}px`,
                          height: `${element.height}px`,
                          transform: `rotate(${element.rotation}deg)`,
                          textDecoration: element.textDecoration,
                          textDecorationColor: element.color,
                          position: "absolute",
                          zIndex: element.selected ? 10 : 1,
                          touchAction: "none", // Prevent default touch behavior
                        }}
                        onClick={(e) => handleElementClick(element.id, e)}
                        onMouseDown={(e) => handleMouseDown(element.id, e)}
                        onTouchStart={(e) => handleMouseDown(element.id, e)}
                      >
                        {element.type === "text" && (
                          <div
                            className="w-full h-full overflow-hidden z-10"
                            style={{
                              fontFamily: element.fontFamily,
                              fontSize: `${element.fontSize}px`,
                              fontWeight: element.fontWeight,
                              fontStyle: element.fontStyle,
                              textDecoration: element.textDecoration,
                              textDecorationColor: element.color,
                              textAlign: element.textAlign as any,
                              color: element.color,
                              transform:
                                element.textEffect === "curved"
                                  ? "rotate(-2deg)"
                                  : element.textEffect === "arch"
                                  ? "skewY(5deg)"
                                  : element.textEffect === "circle"
                                  ? "rotate(360deg)" // This is just an example; real circle text needs more
                                  : "none",
                            }}
                          >
                            {element.content}
                          </div>
                        )}
                        {element.type === "image" && (
                          <img
                            src={element.content}
                            alt="Custom design"
                            className="w-full h-full object-contain"
                          />
                        )}

                        {/* Resize handles - only visible when element is selected */}
                        {element.selected && (
                          <>
                            {/* Top-left handle */}
                            <div
                              style={
                                {
                                  ...baseResizeHandleStyle,
                                  top: "-4px",
                                  left: "-4px",
                                  cursor: "nwse-resize",
                                } as ResizeHandleStyle
                              }
                              onMouseDown={(e) =>
                                handleResizeMouseDown(element.id, "nw", e)
                              }
                            />

                            {/* Top-right handle */}
                            <div
                              style={
                                {
                                  ...baseResizeHandleStyle,
                                  top: "-4px",
                                  right: "-4px",
                                  cursor: "nesw-resize",
                                } as ResizeHandleStyle
                              }
                              onMouseDown={(e) =>
                                handleResizeMouseDown(element.id, "ne", e)
                              }
                            />

                            {/* Bottom-left handle */}
                            <div
                              style={
                                {
                                  ...baseResizeHandleStyle,
                                  bottom: "-4px",
                                  left: "-4px",
                                  cursor: "nesw-resize",
                                } as ResizeHandleStyle
                              }
                              onMouseDown={(e) =>
                                handleResizeMouseDown(element.id, "sw", e)
                              }
                            />

                            {/* Bottom-right handle */}
                            <div
                              style={
                                {
                                  ...baseResizeHandleStyle,
                                  bottom: "-4px",
                                  right: "-4px",
                                  cursor: "nwse-resize",
                                } as ResizeHandleStyle
                              }
                              onMouseDown={(e) =>
                                handleResizeMouseDown(element.id, "se", e)
                              }
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile View (new) */}
              <div className="lg:hidden">
                {/* Color Selection (top) */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-medium text-gray-700">Select Color:</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color._id}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tshirtColor === color._id
                            ? "ring-2 ring-offset-2 ring-brand-accent"
                            : ""
                        }`}
                        style={{ backgroundColor: color.colorCode }}
                        onClick={() => setTshirtColor(color._id)}
                        title={color.colorName}
                        aria-label={`Select ${color.colorName} color`}
                      >
                        {tshirtColor === color._id && (
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M5 13L9 17L19 7"
                              stroke={
                                color.colorCode === "#ffffff"
                                  ? "black"
                                  : "white"
                              }
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Design Area (middle) */}
                <div className="relative flex justify-center my-4">
                  <div
                    ref={designAreaRef}
                    className="relative w-full max-w-lg aspect-[3/4] bg-gray-50 design-element"
                    onClick={handleDesignAreaClick}
                    onTouchStart={handleDesignAreaClick}
                    style={{
                      backgroundSize: "20px 20px",
                      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                      position: "relative",
                      overflow: "hidden",
                      touchAction: "none", // Prevent browser touch gestures
                    }}
                  >
                    {selectedColor && (
                      <img
                        src={selectedColor.colorImage[tshirtView]}
                        alt={`${selectedColor.colorName} t-shirt ${tshirtView} view`}
                        className="w-full h-full object-contain rounded-md"
                      />
                    )}

                    {designElements.map((element) => (
                      <div
                        key={element.id}
                        className={`absolute cursor-move ${
                          element.selected ? "outline-2 outline-blue-500" : ""
                        }`}
                        style={{
                          left: `${element.x}px`,
                          top: `${element.y}px`,
                          width: `${element.width}px`,
                          height: `${element.height}px`,
                          transform: `rotate(${element.rotation}deg)`,
                          textDecoration: element.textDecoration,
                          textDecorationColor: element.color,
                          position: "absolute",
                          zIndex: element.selected ? 10 : 1,
                          touchAction: "none",
                        }}
                        onClick={(e) => handleElementClick(element.id, e)}
                        onMouseDown={(e) => handleMouseDown(element.id, e)}
                        onTouchStart={(e) => handleMouseDown(element.id, e)}
                      >
                        {element.type === "text" && (
                          <div
                            className="w-full h-full overflow-hidden z-10"
                            style={{
                              fontFamily: element.fontFamily,
                              fontSize: `${element.fontSize}px`,
                              fontWeight: element.fontWeight,
                              fontStyle: element.fontStyle,
                              textDecoration: element.textDecoration,
                              textDecorationColor: element.color,
                              textAlign: element.textAlign as any,
                              color: element.color,
                              transform:
                                element.textEffect === "curved"
                                  ? "rotate(-2deg)"
                                  : element.textEffect === "arch"
                                  ? "skewY(5deg)"
                                  : element.textEffect === "circle"
                                  ? "rotate(360deg)" // This is just an example; real circle text needs more
                                  : "none",
                            }}
                          >
                            {element.content}
                          </div>
                        )}
                        {element.type === "image" && (
                          <img
                            src={element.content}
                            alt="Custom design"
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* View Selection (bottom) */}
                <div className="mt-4">
                  <h3 className="font-medium text-gray-700 mb-2">
                    Select View:
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {(["front", "back", "right", "left"] as const).map(
                      (view) => (
                        <button
                          key={view}
                          className={`flex flex-col items-center p-2 rounded-md ${
                            tshirtView === view ? "bg-gray-100" : ""
                          }`}
                          onClick={() => {
                            saveCurrentViewElements();
                            setTshirtView(view);
                            loadViewElements(view);
                          }}
                        >
                          <img
                            src={selectedColor!.colorImage[view]}
                            alt={`${view} view`}
                            className="w-10 h-10 object-contain"
                          />
                          <span className="text-xs mt-1">
                            {view.charAt(0).toUpperCase() + view.slice(1)}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 lg:border-l border-gray-200">
              <h2 className="text-xl font-bold mb-4">Design Tools</h2>

              <div className="mb-6 flex flex-wrap gap-3">
                <Button
                  onClick={addTextElement}
                  className="flex items-center gap-1"
                >
                  <Text size={16} /> Add Text
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1"
                >
                  <ImageIcon size={16} /> Add Image
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger
                    value="edit"
                    className="flex items-center justify-center gap-1"
                  >
                    <Palette size={16} /> Edit Design
                  </TabsTrigger>
                  <TabsTrigger
                    value="arrange"
                    className="flex items-center justify-center gap-1"
                  >
                    <Move size={16} /> Arrange
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="pt-4">
                  {selectedElementData ? (
                    <>
                      {selectedElementData.type === "text" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              TEXT
                            </label>
                            <input
                              type="text"
                              value={selectedElementData.content}
                              onChange={(e) =>
                                updateTextContent(e.target.value)
                              }
                              placeholder="Your text here"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                FONT SIZE
                              </label>
                              <select
                                value={selectedElementData.fontSize || 24}
                                onChange={(e) =>
                                  updateFontSize(parseInt(e.target.value))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              >
                                <option value={12}>12</option>
                                <option value={14}>14</option>
                                <option value={16}>16</option>
                                <option value={18}>18</option>
                                <option value={20}>20</option>
                                <option value={24}>24</option>
                                <option value={28}>28</option>
                                <option value={32}>32</option>
                                <option value={36}>36</option>
                                <option value={40}>40</option>
                                <option value={48}>48</option>
                                <option value={56}>56</option>
                                <option value={64}>64</option>
                                <option value={72}>72</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                COLOR
                              </label>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-8 h-8 rounded border border-gray-300"
                                  style={{
                                    backgroundColor:
                                      selectedElementData.color || "#000000",
                                  }}
                                ></div>
                                <input
                                  type="color"
                                  value={selectedElementData.color || "#000000"}
                                  onChange={(e) => setTextColor(e.target.value)}
                                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              FONT STYLE
                            </label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={
                                  selectedElementData.fontWeight === "bold"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={toggleBold}
                                className="px-3 py-1"
                              >
                                <Bold size={14} />
                              </Button>
                              <Button
                                type="button"
                                variant={
                                  selectedElementData.fontStyle === "italic"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={toggleItalic}
                                className="px-3 py-1"
                              >
                                <Italic size={14} />
                              </Button>
                              <Button
                                type="button"
                                variant={
                                  selectedElementData.textDecoration ===
                                  "underline"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={toggleUnderline}
                                className="px-3 py-1"
                              >
                                <Underline size={14} />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              FONT
                            </label>
                            <select
                              value={selectedElementData.fontFamily}
                              onChange={(e) => updateFontFamily(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              {fontFamilies.map((font) => (
                                <option key={font.id} value={font.value}>
                                  {font.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              TEXT ALIGNMENT
                            </label>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant={
                                  selectedElementData.textAlign === "left"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setTextAlign("left")}
                                className="px-3 py-2"
                              >
                                <AlignLeft size={14} />
                              </Button>
                              <Button
                                type="button"
                                variant={
                                  selectedElementData.textAlign === "center"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setTextAlign("center")}
                                className="px-3 py-2"
                              >
                                <AlignCenter size={14} />
                              </Button>
                              <Button
                                type="button"
                                variant={
                                  selectedElementData.textAlign === "right"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setTextAlign("right")}
                                className="px-3 py-2"
                              >
                                <AlignRight size={14} />
                              </Button>
                              <Button
                                type="button"
                                variant={
                                  selectedElementData.textAlign === "justify"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setTextAlign("justify")}
                                className="px-3 py-2"
                              >
                                <AlignJustify size={14} />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              TEXT EFFECT
                            </label>
                            <select
                              value={
                                selectedElementData.textEffect || "straight"
                              }
                              onChange={(e) => setTextEffect(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="straight">Normal Text</option>
                              <option value="curved">Slightly Curved</option>
                              <option value="arch">Arch Effect</option>
                              <option value="circle">Circular Text</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {selectedElementData.type === "image" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Image Size
                            </label>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">
                                Width: {Math.round(selectedElementData.width)}px
                              </span>
                              <span className="text-sm">
                                Height: {Math.round(selectedElementData.height)}
                                px
                              </span>
                            </div>

                            <div className="mt-2 space-y-2">
                              <label className="block text-xs text-gray-600">
                                Width
                              </label>
                              <Slider
                                defaultValue={[selectedElementData.width]}
                                value={[selectedElementData.width]}
                                min={20}
                                max={300}
                                step={1}
                                onValueChange={(value) =>
                                  updateElementSize(
                                    value[0],
                                    selectedElementData.height
                                  )
                                }
                                className="mb-2"
                              />

                              <label className="block text-xs text-gray-600">
                                Height
                              </label>
                              <Slider
                                defaultValue={[selectedElementData.height]}
                                value={[selectedElementData.height]}
                                min={20}
                                max={300}
                                step={1}
                                onValueChange={(value) =>
                                  updateElementSize(
                                    selectedElementData.width,
                                    value[0]
                                  )
                                }
                              />
                            </div>
                          </div>

                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="w-full"
                          >
                            Replace Image
                          </Button>
                        </div>
                      )}

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rotation: {Math.round(selectedElementData.rotation)}°
                        </label>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => rotateElement("counterclockwise")}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <RotateCcw size={16} className="mr-1" /> Rotate Left
                          </Button>
                          <Button
                            onClick={() => rotateElement("clockwise")}
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <RotateCw size={16} className="mr-1" /> Rotate Right
                          </Button>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button
                          onClick={deleteSelectedElement}
                          variant="destructive"
                          className="w-full"
                        >
                          <Trash2 size={16} className="mr-2" /> Delete Element
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      <p>Select an element to edit its properties</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="arrange" className="pt-4">
                  {selectedElementData ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Element Position
                        </label>
                        <div className="flex space-x-2">
                          <Button
                            onClick={moveToBack}
                            variant="outline"
                            className="flex-1"
                          >
                            <ChevronDown size={16} className="mr-1" /> Move to
                            Back
                          </Button>
                          <Button
                            onClick={moveToFront}
                            variant="outline"
                            className="flex-1"
                          >
                            <ChevronUp size={16} className="mr-1" /> Move to
                            Front
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Size Controls
                        </label>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() =>
                              updateElementSize(
                                selectedElementData.width * 0.9,
                                selectedElementData.height * 0.9
                              )
                            }
                            variant="outline"
                            className="flex-1"
                          >
                            <Minus size={16} className="mr-1" /> Decrease Size
                          </Button>
                          <Button
                            onClick={() =>
                              updateElementSize(
                                selectedElementData.width * 1.1,
                                selectedElementData.height * 1.1
                              )
                            }
                            variant="outline"
                            className="flex-1"
                          >
                            <Plus size={16} className="mr-1" /> Increase Size
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      <p>Select an element to arrange</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <Button
                    onClick={() => {
                      if (!authState.isAuthenticated) {
                        setOpen(true); // Show login modal
                      } else {
                        setOpenDialog(true); // Show dialog
                      }
                    }}
                    className="w-full bg-[#161616] hover:bg-[#2a2a2a] text-white text-sm font-medium px-6 py-2 rounded-xl transition-colors duration-200 transform hover:scale-105 flex items-center justify-center shadow-lg"
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Proceed to Continue
                  </Button>

                  <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border-0 shadow-2xl bg-white">
                    <DialogHeader className="px-6 pt-6 pb-2">
                      <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
                        <ShoppingCart
                          size={24}
                          className="mr-3 text-gray-700"
                        />
                        Add to Cart
                      </DialogTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Select your preferred sizes and quantities
                      </p>
                    </DialogHeader>

                    <div className="px-6 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-6">
                        {/* Size Selection Grid */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Available Sizes
                            </h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {availableSizes.length} sizes available
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {availableSizes.map((size) => (
                              <div
                                key={size}
                                className="group relative bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 p-4 rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md"
                              >
                                <div className="space-y-3">
                                  {/* Size Header */}
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-800 tracking-wide">
                                      {size.toUpperCase()}
                                    </span>
                                    <div className="text-right">
                                      <div className="text-xs text-gray-500">
                                        Price
                                      </div>
                                      <div className="text-sm font-semibold text-green-600">
                                        ₹{Math.round(product.basePrice)}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Quantity Input */}
                                  <div className="relative">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                      Quantity
                                    </label>
                                    <div className="relative">
                                      <input
                                        type="number"
                                        min="0"
                                        value={sizeQuantities[size] || 0}
                                        onChange={(e) => {
                                          const newQuantities = {
                                            ...sizeQuantities,
                                          };
                                          newQuantities[size] = Math.max(
                                            0,
                                            parseInt(e.target.value) || 0
                                          );
                                          setSizeQuantities(newQuantities);
                                        }}
                                        className="w-full px-3 py-2 text-center text-sm font-medium border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 bg-white"
                                        placeholder="0"
                                      />
                                      {sizeQuantities[size] > 0 && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                          <span className="text-xs text-white font-bold">
                                            ✓
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        {Object.values(sizeQuantities).some(
                          (qty) => qty > 0
                        ) && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                              <span className="mr-2">📋</span>
                              Order Summary
                            </h3>

                            <div className="space-y-3">
                              {/* Item breakdown */}
                              <div className="space-y-2">
                                {Object.entries(sizeQuantities)
                                  .filter(([_, qty]) => qty > 0)
                                  .map(([size, qty]) => (
                                    <div
                                      key={size}
                                      className="flex justify-between items-center text-sm"
                                    >
                                      <span className="text-gray-600">
                                        Size {size.toUpperCase()} × {qty}
                                      </span>
                                      <span className="font-medium text-gray-800">
                                        ₹
                                        {Math.round(
                                          product.basePrice *
                                            product.sizeList[size]
                                        ) * qty}
                                      </span>
                                    </div>
                                  ))}
                              </div>

                              <div className="border-t border-blue-200 pt-3 mt-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    Total Items:
                                  </span>
                                  <span className="font-semibold text-lg text-blue-600">
                                    {Object.values(sizeQuantities).reduce(
                                      (sum, qty) => sum + qty,
                                      0
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-base font-semibold text-gray-800">
                                    Total Amount:
                                  </span>
                                  <span className="font-bold text-xl text-green-600">
                                    ₹
                                    {Object.entries(sizeQuantities).reduce(
                                      (sum, [size, qty]) => {
                                        return (
                                          sum +
                                          Math.round(
                                            product.basePrice *
                                              product.sizeList[size]
                                          ) *
                                            qty
                                        );
                                      },
                                      0
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setOpenDialog(false)}
                          className="px-6 py-2 rounded-xl border-2 border-gray-300 hover:bg-gray-100 text-gray-700 font-medium transition-all duration-200"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={async () => {
                            if (!authState.isAuthenticated) {
                              setOpen(true); // Open login modal
                              return;
                            }

                            try {
                              // Upload images if necessary
                              const uploadedImageConfigs = await Promise.all(
                                designElements
                                  .filter((el) => el.type === "image")
                                  .map(async (imgEl) => {
                                    if (
                                      imgEl.content.startsWith(
                                        "https://cordestitch.s3.ap-south-1.amazonaws.com/"
                                      )
                                    ) {
                                      return {
                                        ...imgEl,
                                        content: imgEl.content,
                                      };
                                    }

                                    if (imgEl.content.startsWith("data:")) {
                                      try {
                                        const blob = await fetch(
                                          imgEl.content
                                        ).then((res) => res.blob());
                                        const file = new File(
                                          [blob],
                                          `design-image-${Date.now()}.png`,
                                          { type: blob.type }
                                        );

                                        const uploadData =
                                          await getPresignedUrl(
                                            file.name,
                                            file.type
                                          );
                                        if (!uploadData)
                                          throw new Error(
                                            "Failed to get presigned URL"
                                          );

                                        const uploadResponse = await fetch(
                                          uploadData.url,
                                          {
                                            method: "PUT",
                                            headers: {
                                              "Content-Type": file.type,
                                            },
                                            body: file,
                                          }
                                        );

                                        if (!uploadResponse.ok)
                                          throw new Error("Upload failed");

                                        const s3Url = `https://cordestitch.s3.ap-south-1.amazonaws.com/${uploadData.key}`;
                                        sessionStorage.setItem(
                                          `uploadedImage_${Date.now()}`,
                                          JSON.stringify({
                                            url: s3Url,
                                            key: uploadData.key,
                                            fileName: uploadData.fileName,
                                          })
                                        );

                                        return { ...imgEl, content: s3Url };
                                      } catch (error) {
                                        console.error(
                                          "Error uploading image:",
                                          error
                                        );
                                        return imgEl;
                                      }
                                    }

                                    return imgEl;
                                  })
                              );

                              const updatedDesignElements = designElements.map(
                                (el) => {
                                  if (el.type === "image") {
                                    const uploaded = uploadedImageConfigs.find(
                                      (u) => u.id === el.id
                                    );
                                    return uploaded || el;
                                  }
                                  return el;
                                }
                              );

                              const textConfigs: TextConfig[] =
                                updatedDesignElements
                                  .filter((el) => el.type === "text")
                                  .map((textEl) => ({
                                    inputText: textEl.content,
                                    textSize: pixelsToCm(textEl.fontSize || 24), // Convert font size to cm
                                    textAlign: textEl.textAlign || "center",
                                    font: textEl.fontFamily || "sans-serif",
                                    color: textEl.color || "#000000",
                                    textX: pixelsToCm(textEl.x), // Convert X position to cm
                                    textY: pixelsToCm(textEl.y), // Convert Y position to cm
                                    position: tshirtView,
                                  }));

                              const imageConfigs: ImageConfig[] =
                                updatedDesignElements
                                  .filter((el) => el.type === "image")
                                  .map((imgEl) => ({
                                    imageUrl: imgEl.content,
                                    imageWidth: pixelsToCm(imgEl.width), // Convert width to cm
                                    imageHeight: pixelsToCm(imgEl.height), // Convert height to cm
                                    imageX: pixelsToCm(imgEl.x), // Convert X position to cm
                                    imageY: pixelsToCm(imgEl.y), // Convert Y position to cm
                                    position: tshirtView,
                                  }));

                              const sizeQuantityList = Object.fromEntries(
                                Object.entries(sizeQuantities).filter(
                                  ([_, qty]) => qty > 0
                                )
                              );

                              const payload: AddToCartPayload = {
                                productId: productId as string,
                                colorId: tshirtColor,
                                text: textConfigs,
                                image: imageConfigs,
                                sizeQuantityList,
                              };

                              const response = await addToCart(payload);

                              if (response) {
                                toast.success("Added to cart successfully !!");
                                setOpenDialog(false);
                                router.push("/my-cart"); // Go to cart after successful addition
                              } else {
                                toast.error(
                                  "Failed to add item to cart. Please try again."
                                );
                              }
                            } catch (error) {
                              console.error("Error adding to cart:", error);
                              toast.error(
                                "An error occurred. Please try again."
                              );
                            }
                          }}
                          disabled={
                            !Object.values(sizeQuantities).some(
                              (qty) => qty > 0
                            )
                          }
                          className="bg-[#161616] hover:bg-[#3b3b3b] text-white px-8 py-2 rounded-xl font-large transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="mt-4 text-sm text-gray-500 text-center">
                  <p>Starting from ₹{product.basePrice} for custom t-shirt</p>
                  <p className="mt-1">Free shipping on orders above ₹999</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ReviewsSection productId={productId as string} />
      </div>
    </Layout>
  );
};

export default Customize;
