"use client";

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, Heart, Share2, Truck, Check, X, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useParams, useRouter } from 'next/navigation';
import { getProductById } from '@/app/services/data.service';
import { addToCart } from '@/app/services/data.service'; // Import the addToCart function
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';

interface CartItemRequest {
  productId: string;
  productName: string;
  productSize: number;
  productColor: string;
  productColorCode: string;
  productOfferPercentage: number;
  quantity: number;
  price: number;
}

interface AddToCartPayload {
  cartItemRequests: CartItemRequest[];
}


interface ProductDetail {
  productId: string;
  productName: string;
  productStatus: string;
  productDescription: string;
  productMaterialType: string;
  productPattern: string;
  productStretchType: string;
  productOfferPercentage: number;
  stockQuantityResponseList: Array<{
    size: number;
    productPrice: number;
    colorQuantityResponses: Array<{
      color: string;
      colorCode: string;
      quantity: number;
      imageUrls: Record<string, number>;
    }>;
  }>;
  video: string;
  productReviewResponse: {
    reviewAverage: number;
    totalNumberOfReviews: number;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedColorCode, setSelectedColorCode] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId) as ProductDetail;
        setProduct(data);
        
        // Set initial selections
        if (data.stockQuantityResponseList.length > 0) {
          const firstSize = data.stockQuantityResponseList[0].size;
          setSelectedSize(firstSize);
          
          if (data.stockQuantityResponseList[0].colorQuantityResponses.length > 0) {
            const firstColor = data.stockQuantityResponseList[0].colorQuantityResponses[0];
            setSelectedColor(firstColor.color);
            setSelectedColorCode(firstColor.colorCode);
            
            // Set first image as default
            const firstImageUrl = Object.keys(data.stockQuantityResponseList[0].colorQuantityResponses[0].imageUrls)[0];
            setSelectedImage(firstImageUrl);
          }
        }
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleColorSelect = (color: string, colorCode: string, imageUrl: string) => {
    setSelectedColor(color);
    setSelectedColorCode(colorCode);
    setSelectedImage(imageUrl);
    setCurrentImageIndex(0);
  };

  const handleSizeSelect = (size: number) => {
    setSelectedSize(size);
  };

  const getAvailableColors = () => {
    if (!product || !selectedSize) return [];
    
    const sizeObj = product.stockQuantityResponseList.find(item => item.size === selectedSize);
    return sizeObj ? sizeObj.colorQuantityResponses : [];
  };

  const getPrice = () => {
    if (!product || !selectedSize) return 0;
    
    const sizeObj = product.stockQuantityResponseList.find(item => item.size === selectedSize);
    return sizeObj ? sizeObj.productPrice : 0;
  };

  const getOriginalPrice = () => {
    if (!product || !product.productOfferPercentage) return null;
    const price = getPrice();
    return price / (1 - product.productOfferPercentage / 100);
  };

  const handleAddToCart = async () => {
    if (!product || !selectedSize || !selectedColor || !selectedColorCode) {
      toast.error("Please select size and color before adding to cart");
      return;
    }
  
    try {
      setAddingToCart(true);
  
      const cartItem: CartItemRequest = {
        productId: product.productId,
        productName: product.productName,
        productSize: selectedSize,
        productColor: selectedColor,
        productColorCode: selectedColorCode,
        productOfferPercentage: product.productOfferPercentage,
        quantity: quantity,
        price: getPrice()
      };
  
      const payload: AddToCartPayload = {
        cartItemRequests: [cartItem]
      };
  
      // await addToCart(payload);
  
      toast.success("Item added to cart", {
        description: `${product.productName} has been added to your cart`,
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart")
        }
      });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Failed to add item to cart", {
        description: "Please try again later"
      });
    } finally {
      setAddingToCart(false);
    }
  };
  
  

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        size={16} 
        className={index < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} 
      />
    ));
  };

  const allImageUrls = selectedColor 
    ? getAvailableColors()
        .find(color => color.color === selectedColor)
        ?.imageUrls || {}
    : {};

  const imageUrlsArray = Object.keys(allImageUrls);

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % imageUrlsArray.length);
    setSelectedImage(imageUrlsArray[(currentImageIndex + 1) % imageUrlsArray.length]);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + imageUrlsArray.length) % imageUrlsArray.length);
    setSelectedImage(imageUrlsArray[(currentImageIndex - 1 + imageUrlsArray.length) % imageUrlsArray.length]);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="w-full aspect-square rounded-xl" />
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-full aspect-square rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="pt-6 space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <div className="flex gap-2">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-10 rounded-full" />)}
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-14" />)}
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-24" />
                <div className="flex items-center gap-4 w-32">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-flex items-center gap-2 max-w-md mx-auto">
          <X className="w-5 h-5" />
          <span>{error}</span>
        </div>
        <Button 
          variant="outline" 
          className="mt-6" 
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <div className="bg-gray-50 p-6 rounded-lg inline-block">
          <p className="text-lg font-medium">Product not found</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const availableColors = getAvailableColors();
  const availableSizes = product.stockQuantityResponseList.map(item => item.size);
  const price = getPrice();
  const originalPrice = getOriginalPrice();

  return (
    <div className="container py-8 px-4 sm:px-6">
      <Button 
        variant="ghost" 
        className="mb-6 -ml-2" 
        onClick={() => router.back()}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Back to products
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden group">
            {selectedImage ? (
              <>
                <Image
                  src={selectedImage}
                  alt={product.productName}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {imageUrlsArray.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
            
            {product.productStatus && (
              <Badge variant="secondary" className="absolute top-4 left-4">
                {product.productStatus}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {availableColors.flatMap(color => 
              Object.keys(color.imageUrls).map((imageUrl, idx) => (
                <button
                  key={`${color.color}-${idx}`}
                  className={cn(
                    "relative aspect-square bg-gray-50 rounded-md overflow-hidden border-2 transition-all",
                    selectedImage === imageUrl ? 'border-primary' : 'border-transparent hover:border-gray-200'
                  )}
                  onClick={() => handleColorSelect(color.color, color.colorCode, imageUrl)}
                >
                  <Image
                    src={imageUrl}
                    alt={`${product.productName} - ${color.color}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))
            ).slice(0, 4)}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                {product.productName}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex">
                  {renderStars(product.productReviewResponse.reviewAverage)}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.productReviewResponse.totalNumberOfReviews} reviews)
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{price.toFixed(2)}</span>
              {originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{originalPrice.toFixed(2)}
                </span>
              )}
              {product.productOfferPercentage > 0 && (
                <Badge className="text-sm bg-green-100 text-green-800 hover:bg-green-100">
                  {product.productOfferPercentage}% OFF
                </Badge>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <Truck className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">Free delivery</span>
              <span className="text-muted-foreground">on orders over ₹2000</span>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Color Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Color: <span className="font-normal">{selectedColor}</span></h3>
            <div className="flex gap-3">
              {availableColors.map(color => (
                <button
                  key={color.color}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center relative transition-all",
                    selectedColor === color.color ? 
                      'ring-2 ring-offset-2 ring-primary' : 'hover:ring-1 hover:ring-gray-300'
                  )}
                  style={{ backgroundColor: color.colorCode }}
                  title={color.color}
                  onClick={() => handleColorSelect(color.color, color.colorCode, Object.keys(color.imageUrls)[0])}
                  aria-label={`Select ${color.color} color`}
                >
                  {selectedColor === color.color && (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M5 13L9 17L19 7" 
                        stroke={color.colorCode === '#FFFFFF' || color.colorCode === '#FFF' ? 'black' : 'white'} 
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

          {/* Size Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map(size => (
                <Button
                  key={size}
                  variant={selectedSize === size ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    "min-w-[40px] h-10 rounded-md",
                    selectedSize === size ? '' : 'hover:bg-gray-50'
                  )}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
            <div className="flex items-center gap-4 w-fit border rounded-md">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 rounded-none"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="font-medium w-8 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 rounded-none"
                onClick={() => setQuantity(q => q + 1)}
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <Button 
              size="lg" 
              className="flex-1 h-12"
              onClick={handleAddToCart}
              disabled={addingToCart || !selectedSize || !selectedColor}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            <Button size="lg" className="flex-1 h-12" variant="secondary">
              Buy Now
            </Button>
          </div>

          <div className="space-y-3 text-sm pt-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>In stock and ready to ship</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>30-day return policy</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs - Desktop */}
      <div className="mt-16 hidden lg:block">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <div className="prose prose-sm max-w-none text-muted-foreground">
              {product.productDescription.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="mt-6">
            <div className="space-y-4">
              <div className="flex">
                <span className="w-32 text-muted-foreground">Material</span>
                <span className="font-medium">{product.productMaterialType}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Pattern</span>
                <span className="font-medium">{product.productPattern}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-muted-foreground">Stretch</span>
                <span className="font-medium">{product.productStretchType}</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">Customer Reviews</h3>
              <div className="mt-2 flex justify-center items-center gap-2">
                <div className="flex">
                  {renderStars(product.productReviewResponse.reviewAverage)}
                </div>
                <span className="text-muted-foreground">
                  Based on {product.productReviewResponse.totalNumberOfReviews} reviews
                </span>
              </div>
              {product.productReviewResponse.totalNumberOfReviews === 0 && (
                <p className="mt-4 text-muted-foreground">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
              <Button variant="outline" className="mt-6">
                Write a Review
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Details Accordion - Mobile */}
      <div className="mt-8 lg:hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="description">
            <AccordionTrigger className="text-sm font-medium">
              Description
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </AccordionTrigger>
            <AccordionContent className="pt-2 text-muted-foreground">
              {product.productDescription.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="details">
            <AccordionTrigger className="text-sm font-medium">
              Product Details
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="space-y-4">
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Material</span>
                  <span className="font-medium">{product.productMaterialType}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Pattern</span>
                  <span className="font-medium">{product.productPattern}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-muted-foreground">Stretch</span>
                  <span className="font-medium">{product.productStretchType}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="reviews">
            <AccordionTrigger className="text-sm font-medium">
              Reviews
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </AccordionTrigger>
            <AccordionContent className="pt-2 text-center">
              <div className="mt-2 flex justify-center items-center gap-2">
                <div className="flex">
                  {renderStars(product.productReviewResponse.reviewAverage)}
                </div>
                <span className="text-muted-foreground">
                  ({product.productReviewResponse.totalNumberOfReviews} reviews)
                </span>
              </div>
              {product.productReviewResponse.totalNumberOfReviews === 0 && (
                <p className="mt-4 text-muted-foreground">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
              <Button variant="outline" className="mt-4">
                Write a Review
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}