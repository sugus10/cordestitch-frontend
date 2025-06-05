"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/Layout";
import LoaderAnimation from "@/components/LoaderAniation";
import { CartItem, CartResponse, getCartItems } from "@/app/services/data.service";


const Cart = () => {
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await getCartItems();
        setCartData(data);
        toast.success("Cart items loaded successfully");
        setIsLoaded(true);
      } catch (error) {
        toast.error("Failed to load cart items");
        setIsLoaded(true);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(cartItemId);
    
    try {
      // Here you would call your API to update the quantity
      // await updateCartItemQuantity(cartItemId, newQuantity);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Update local state
      if (cartData) {
        const updatedCart = {
          ...cartData,
          cartItemResponses: cartData.cartItemResponses.map(item => 
            item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
          )
        };
        setCartData(updatedCart);
        toast.success("Cart updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setIsUpdating(null);
    }
  };

  const removeItem = async (cartItemId: string) => {
    setIsRemoving(true);
    setIsUpdating(cartItemId);
    
    try {
      // Here you would call your API to remove the item
      // await removeCartItem(cartItemId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Update local state
      if (cartData) {
        const updatedCart = {
          ...cartData,
          cartItemResponses: cartData.cartItemResponses.filter(
            item => item.cartItemId !== cartItemId
          )
        };
        setCartData(updatedCart);
        toast.success("Item removed from cart");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setIsUpdating(null);
      setIsRemoving(false);
    }
  };

  const calculateSubtotal = () => {
    if (!cartData) return 0;
    return cartData.cartItemResponses.reduce((total, item) => {
      const discountedPrice = item.price * (1 - item.productOfferPercentage / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  const proceedToCheckout = () => {
    setIsCheckingOut(true);
    
    setTimeout(() => {
      setIsCheckingOut(false);
      router.push('/checkout');
    }, 800);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 49 : 0;
  const total = subtotal + shipping;

  // Calculate discounted price for an item
  const getDiscountedPrice = (item: CartItem) => {
    return item.price * (1 - item.productOfferPercentage / 100);
  };

  return (
    <Layout>
      <div className={`container-custom py-12 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-3xl font-bold mb-8 animate-fade-in">Shopping Cart</h1>
        
        {cartData?.cartItemResponses && cartData.cartItemResponses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartData.cartItemResponses.map((item, index) => (
                <div 
                  key={item.cartItemId} 
                  className={`flex flex-col md:flex-row gap-6 border rounded-lg p-4 mb-6 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} hover-lift`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="w-full md:w-1/4 relative overflow-hidden rounded-md">
                    {isUpdating === item.cartItemId && (
                      <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                        <LoaderAnimation size={24} text="" />
                      </div>
                    )}
                    <img 
                      src={item.productImagesUrl || "/placeholder-product.jpg"} 
                      alt={item.productName} 
                      className="w-full h-40 md:h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{item.productName}</h3>
                        {item.productOfferPercentage > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                              {item.productOfferPercentage}% OFF
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.price.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-lg font-medium mt-2 md:mt-0">
                        ₹{getDiscountedPrice(item).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Color:</span> 
                        <span className="flex items-center gap-2">
                          <span 
                            className="inline-block w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: item.productColorCode }}
                          />
                          {item.productColor}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Size:</span> {item.productSize}
                      </div>
                      <div className="md:col-span-2">
                        <Link href="/size-chart" className="text-[#3b3b3b] hover:underline">
                          Size Chart
                        </Link>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap justify-between items-center gap-4">
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          disabled={isUpdating === item.cartItemId || isRemoving}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="h-8 px-4 flex items-center justify-center border-t border-b">
                          {item.quantity}
                        </span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          disabled={
                            isUpdating === item.cartItemId || 
                            isRemoving ||
                            item.quantity >= item.productStocksAvailable
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        {item.quantity >= item.productStocksAvailable && (
                          <span className="ml-2 text-xs text-red-500">Max available</span>
                        )}
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
                        onClick={() => removeItem(item.cartItemId)}
                        disabled={isUpdating === item.cartItemId || isRemoving}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <div className={`border rounded-lg p-6 bg-white shadow-sm hover-lift sticky top-24 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({cartData.cartItemResponses.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping > 0 ? `₹${shipping.toFixed(2)}` : "Free"}</span>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-[#3b3b3b] hover:bg-[#3b3b3b] transition-transform hover:scale-105 duration-300"
                  onClick={proceedToCheckout}
                  disabled={isCheckingOut || isRemoving}
                >
                  {isCheckingOut ? (
                    <span className="flex items-center justify-center">
                      <LoaderAnimation size={18} text="" />
                      <span className="ml-2">Processing...</span>
                    </span>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </Button>
                
                <div className="mt-6 text-center">
                  <Link 
                    href="/products" 
                    className="inline-flex items-center text-brand-dark hover:text-[#3b3b3b] transition-colors hover-scale"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-block p-6 rounded-full bg-gray-100 mb-4 animate-pulse-accent">
              <ShoppingBag size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button 
              className="transition-transform hover:scale-105 duration-300"
              asChild
            >
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;