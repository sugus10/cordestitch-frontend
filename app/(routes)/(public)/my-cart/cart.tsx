"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MdOutlineEditNote } from "react-icons/md";
import { Trash2, Plus, Minus, ShoppingBag, Pencil, Settings2, FileSignature } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Layout from "@/components/Layout";
import LoaderAnimation from "@/components/LoaderAniation";
import { getRequest } from "@/app/services/httpServices";
import { API_CONSTANTS } from "@/app/services/api.route";
import { deleteCartItemById, updateCartItem } from "@/app/services/data.service";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";


interface CartItem {
  productId: string;
  productName: string;
  colorId: string;
  productImage: string;
  sizeQuantityList: Record<string, number>;
  sizeOptions: Record<string, number>;
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
    _id: string;
  }>;
  image: Array<{
    imageUrl: string;
    imageWidth: number;
    imageHeight: number;
    imageX: number;
    imageY: number;
    position: string;
    _id: string;
  }>;
  _id: string;
}
interface CartResponse {
  status: number;
  message: string;
  data: {
    cartItems: CartItem[];
  };
}
type SizeQuantityMap = { [size: string]: number };

type CartItems = {
  _id: string;
  sizeQuantityList: SizeQuantityMap;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
// Update the state type for updatedQuantities
const [updatedQuantities, setUpdatedQuantities] = useState<SizeQuantityMap>({});

// Fix handleUpdateClick to accept CartItem
const handleUpdateClick = (item: CartItem) => {
  setSelectedItem(item);
  const initialQuantities: SizeQuantityMap = {};
  Object.entries(item.sizeQuantityList).forEach(([size, qty]) => {
    initialQuantities[size] = qty;
  });
  setUpdatedQuantities(initialQuantities);
  setIsDialogOpen(true);
};

const handleQuantityChange = (size: string, value: string) => {
  setUpdatedQuantities(prev => ({
    ...prev,
    [size]: parseInt(value) || 0
  }));
};

const handleUpdateSubmit = async () => {
  if (!selectedItem) return;
  
  try {
    setIsUpdating(selectedItem._id);
    
    // Call the API to update quantities
    const { data: updatedItem } = await updateCartItem({
      cartItemId: selectedItem._id,
      updatedSizeQuantityList: updatedQuantities
    });

    // Update local state with the returned cart item
    const updatedCart = cartItems.map(item => 
      item._id === selectedItem._id ? updatedItem : item
    );

    setCartItems(updatedCart as CartItem[]);
    setIsDialogOpen(false);
    toast.success("Cart updated successfully");
  } catch (error) {
    console.error("Update failed:", error);
    toast.error("Failed to update cart item");
  } finally {
    setIsUpdating(null);
  }
};
  const getCartItems = async () => {
    try {
      setIsLoading(true);
      const response = await getRequest(API_CONSTANTS.TCART.GET_CART_ITEMS) as CartResponse;
      if (response.status === 200) {
        setCartItems(response.data.cartItems);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to fetch cart items. Please try again.");
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    getCartItems();
  }, []);

  const updateQuantity = async (id: string, size: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(id);
    
    try {
      // Here you would call your API to update the quantity
      // For example: await updateCartItemQuantity(id, size, newQuantity);
      
      // For now, we'll simulate the update locally
      const updatedCart = cartItems.map(item => {
        if (item._id === id) {
          return {
            ...item,
            sizeQuantityList: {
              ...item.sizeQuantityList,
              [size]: newQuantity
            }
          };
        }
        return item;
      });
      
      setCartItems(updatedCart);
      toast.success("Cart updated successfully");
    } catch (error) {
      toast.error("Failed to update cart item");
    } finally {
      setIsUpdating(null);
    }
  };

  const removeItem = async (id: string | string[]) => {
    const itemsToRemove = Array.isArray(id) ? id : [id];
    const firstItemId = itemsToRemove[0];
    setIsUpdating(firstItemId);
    
    try {
      // Remove multiple items
      for (const itemId of itemsToRemove) {
        await deleteCartItemById(itemId);
      }
  
      // Update the local state after successful deletion
      const updatedCart = cartItems.filter(item => !itemsToRemove.includes(item._id));
      setCartItems(updatedCart);
      
      // Clear selected items after removal
      setSelectedItems([]);
      
      toast.success(`${itemsToRemove.length > 1 ? 'Items' : 'Item'} removed from cart`);
    } catch (error) {
      toast.error("Failed to remove item from cart");
    } finally {
      setIsUpdating(null);
    }
  };

 
  const calculateSubtotal = () => {
    // If items are selected, calculate only selected items subtotal
    if (selectedItems.length > 0) {
      return cartItems
        .filter(item => selectedItems.includes(item._id))
        .reduce((total, item) => total + item.totalAmount, 0);
    }
    // Otherwise, calculate all items subtotal
    return cartItems.reduce((total, item) => total + item.totalAmount, 0);
  };

  const proceedToCheckout = () => {
    setIsCheckingOut(true);
    
    // Prepare checkout data with selected items or all items
    const itemsToCheckout = selectedItems.length > 0 
      ? cartItems.filter(item => selectedItems.includes(item._id))
      : cartItems;
    
    // Store in sessionStorage
    sessionStorage.setItem('checkoutItems', JSON.stringify(itemsToCheckout));
    
    
      router.push('/checkout');
   
  };

  const subtotal = calculateSubtotal();
  const shipping =0;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <Layout>
        <div className="container-custom py-12 flex justify-center items-center">
          <LoaderAnimation size={48} text="Loading your cart..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className={`container-custom py-12 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <h1 className="text-3xl font-bold mb-8 animate-fade-in">Shopping Cart</h1>
      
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Add bulk selection controls if more than 1 item */}
            {cartItems.length > 1 && (
              <div className="mb-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Checkbox
                    id="select-all"
                    checked={selectedItems.length === cartItems.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedItems(cartItems.map(item => item._id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                  <label
                    htmlFor="select-all"
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Select all ({cartItems.length} items)
                  </label>
                </div>
                {selectedItems.length > 0 && (
                  <Button 
                    variant="ghost" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto flex items-center"
                    onClick={() => removeItem(selectedItems)}
                    disabled={!!isUpdating}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Selected ({selectedItems.length})
                  </Button>
                )}
              </div>
            )}
  
            {cartItems.map((item, index) => (
              <div 
                key={item._id} 
                className={`flex flex-col md:flex-row gap-6 border rounded-lg p-4 mb-6 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} hover-lift relative`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
      
{cartItems.length > 1 && (
  <div className="absolute top-4 left-4 z-10">
    <Checkbox
      id={`select-${item._id}`}
      checked={selectedItems.includes(item._id)}
      onCheckedChange={(checked) => {
        console.log('Checkbox changed:', checked, typeof checked);
        if (checked === true) {
          setSelectedItems(prev => [...prev, item._id]);
        } else if (checked === false) {
          setSelectedItems(prev => prev.filter(id => id !== item._id));
        }
      }}
    />
  </div>
)}
                
                <div className="w-full md:w-1/4 relative overflow-hidden rounded-md">
                  {isUpdating === item._id && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                      <LoaderAnimation size={24} text="" />
                    </div>
                  )}
                  <img 
                    src={item.productImage} 
                    alt={item.productName} 
                    className="w-[150px] h-[150px] object-contain rounded-md transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{item.productName}</h3>
                      {(item.text.length > 0 || item.image.length > 0) && (
                        <span className="inline-block bg-[#3b3b3b] text-white text-xs px-2 py-1 rounded mt-1">
                          Customized
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-medium mt-2 md:mt-0">
                      ₹{item.totalAmount.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    {Object.entries(item.sizeQuantityList).map(([size, quantity]) => (
                      <div key={size} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="flex items-center">
                            <span className="text-gray-500 font-medium mr-2">Size:</span>
                            <span className="font-semibold">{size.toUpperCase()}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 font-medium mr-2">Quantity:</span>
                            <span className="font-semibold bg-white px-3 py-1 rounded-md border shadow-sm">
                              {quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end items-center gap-2 mt-4">
                    <Button 
                      variant="ghost" 
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 h-auto flex items-center"
                      onClick={() => handleUpdateClick(item)}
                      disabled={isUpdating === item._id}
                    >
                      <FileSignature className="mr-2 w-10 h-10" />
                      Update
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto flex items-center"
                      onClick={() => removeItem(item._id)}
                      disabled={isUpdating === item._id}
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
              
              {/* Show selected items info if any items are selected */}
              {selectedItems.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">
                    {selectedItems.length} of {cartItems.length} items selected
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
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
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <span className="flex items-center justify-center">
                    <LoaderAnimation size={18} text="" />
                    <span className="ml-2">Processing...</span>
                  </span>
                ) : (
                  selectedItems.length > 0 
                    ? `Proceed to Checkout (${selectedItems.length} items)`
                    : 'Proceed to Checkout'
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Sizes & Quantities</DialogTitle>
          <DialogDescription>
            Modify the quantities for each size. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {selectedItem && Object.keys(selectedItem.sizeQuantityList).map(size => (
            <div key={size} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={size} className="text-right">
                {size.toUpperCase()}
              </Label>
              <Input
                id={size}
                min="0"
                value={updatedQuantities[size] || 0}
                onChange={(e) => handleQuantityChange(size, e.target.value)}
                className="col-span-3"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button 
            type="submit"
            onClick={handleUpdateSubmit}
            disabled={isUpdating === selectedItem?._id}
          >
            {isUpdating === selectedItem?._id ? (
              <span className="flex items-center justify-center">
                <LoaderAnimation size={18} text="" />
                <span className="ml-2">Updating...</span>
              </span>
            ) : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Layout>
  );
};

export default Cart;