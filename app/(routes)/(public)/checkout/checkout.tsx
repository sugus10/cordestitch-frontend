"use client"
import React, { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, ShieldCheck, Package, Truck, MapPin, User, Mail, Phone, Home, CheckCircle, Loader2 } from "lucide-react";
import { ApiAddress, ApiResponse, createPayment, useAddressAPIService, verifyPaymentSignature } from "@/app/services/data.service";
import { Address, PaymentData } from "@/lib/type";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

interface OrderSummary {
  items: Array<{
    name: string;
    price: number;
    qty: number;
    image?: string;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  buildingName?: string;
  streetName?: string;
  district?: string;
  state?: string;
  pinCode?: string;
}

const Checkout = () => {
  const { getAddresses, addAddress } = useAddressAPIService();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    streetName: "",
    buildingName: "",
    phoneNumber: "",
    pinCode: "",
    state: "",
    district: "",
    country: "India",
    saveInfo: true,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [existingAddresses, setExistingAddresses] = useState<ApiAddress[]>([]);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    items: [],
    subtotal: 0,
    shipping: 0,
    discount: 0,
    tax: 0,
    total: 0
  });

  // Calculate order summary from sessionStorage
  const calculateOrderSummary = (cartItems: CartItem[]): OrderSummary => {
    const items = cartItems.map(item => {
      const totalQty = Object.values(item.sizeQuantityList).reduce((sum, qty) => sum + qty, 0);
      
      return {
        name: item.productName,
        price: item.totalAmount,
        qty: totalQty,
        image: item.productImage
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const shipping = 0;
    const discount =  0;
    const taxableAmount = 0;
    const tax = Math.round(taxableAmount * 0.18);
    const total = subtotal + shipping - discount + tax;

    return {
      items,
      subtotal,
      shipping,
      discount,
      tax,
      total
    };
  };

  // Validation functions
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = "Please enter a valid 10-digit Indian mobile number";
    }

    if (!formData.buildingName.trim()) {
      errors.buildingName = "Building name is required";
    }

    if (!formData.streetName.trim()) {
      errors.streetName = "Street name is required";
    }

    if (!formData.district.trim()) {
      errors.district = "Please select a district";
    }

    if (!formData.state.trim()) {
      errors.state = "Please select a state";
    }

    if (!formData.pinCode.trim()) {
      errors.pinCode = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pinCode.trim())) {
      errors.pinCode = "Please enter a valid 6-digit PIN code";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      const response = await getAddresses();
      if (response.data) {
        setExistingAddresses(response.data);  
      }
      setIsLoaded(true);
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    const checkoutItemsStr = sessionStorage.getItem('checkoutItems');
    if (checkoutItemsStr) {
      try {
        const checkoutItems: CartItem[] = JSON.parse(checkoutItemsStr);
        const calculatedSummary = calculateOrderSummary(checkoutItems);
        setOrderSummary(calculatedSummary);
      } catch (error) {
        console.error('Error parsing checkout items:', error);
        setOrderSummary({
          items: [],
          subtotal: 0,
          shipping: 0,
          discount: 0,
          tax: 0,
          total: 0
        });
      }
    }
  }, []);


   const [pincode, setPincode] = useState("");
    const [state, setState] = useState("");
    const [district, setDistrict] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  

  const loadScript = (src: any) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript(process.env.NEXT_PUBLIC_RAZORPAY_SCRIPT);
  });

  const fetchPincodeDetails = async (pincode: string) => {
    setLoading(true);
    setError("");
    const pincodeApiUrl = process.env.NEXT_PUBLIC_PINCODE_API_KEY;
    if (!pincodeApiUrl) {
      setError("API base URL is not configured.");
      setLoading(false);
      return;
    }
  
    const url = `${pincodeApiUrl}${pincode}`;
    try {
      const response = await axios.get(url);
      const data = response.data[0];
      if (data.Status === "Success" && data.PostOffice.length > 0) {
        const postOffice = data.PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          state: postOffice.State || "",
          district: postOffice.District || "",
          country: "India",
        }));
      } else {
        setError("Invalid Pincode. Please check again.");
        setFormData((prev) => ({
          ...prev,
          state: "",
          district: "",
          country: "",
        }));
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
      setError("Failed to fetch pincode details. Please try again later.");
      setFormData((prev) => ({
        ...prev,
        state: "",
        district: "",
        country: "",
      }));
    } finally {
      setLoading(false);
    }
  };
  const router=useRouter();

  async function displayRazorpay(cartItemIds: string[], addressId: string, paymentMode: string) {
    try {
      setIsProcessing(true);
      const requestBody = {
        cartItemIds,
        addressId,
        paymentMode,
      };
      const paymentResponse = await createPayment(requestBody);
      if (!paymentResponse) {
        throw new Error("Failed to create payment");
      }
      const paymentData = (paymentResponse as any).data;

      // ✅ Store pendingOrderId in localStorage
      localStorage.setItem("pendingOrderId", paymentData.pendingOrderId);      
    
      
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        currency: paymentData.currency,
        amount: Math.round(paymentData.amount * 100),
        name: "Pay Now",
        description: "Wallet Transaction",
        image: process.env.NEXT_PUBLIC_LOGO_URL,
        order_id: paymentData.razorpayOrderId,
        handler: async function (response: any) {
          const postData = {
            // orderId: cartItemIds,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            pendingOrderId: localStorage.getItem("pendingOrderId"),
          };
          try {
            const verifyResponse = await verifyPaymentSignature(postData);
            if (verifyResponse) {
              sessionStorage.removeItem("checkoutItems");
              localStorage.removeItem("pendingOrderId")              
              await Swal.fire({
                icon: "success",
                title: "Payment Successful",
                text: "Your payment was successful. Thank you for shopping with us!",
                confirmButtonText: "OK"
              });
              // Redirect or perform next steps here
              router.push("/myorders");
            } else {
              throw new Error("Payment signature verification failed.");
            }
          } catch (error) {
            console.error("Error during signature verification:", error);
            await Swal.fire({
              icon: "error",
              title: "Verification Failed",
              text: "Payment verification failed. Please contact support.",
            });
          }
        },
        prefill: {
          name: formData.firstName + " " + formData.lastName || "Customer",
          email: formData.phoneNumber || "customer@example.com",
        },
      };
      
      // Debug log to see final amount being sent to Razorpay
      console.log('Razorpay amount (paise):', options.amount);
      console.log('Razorpay amount (rupees):', options.amount / 100);
      
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on("payment.failed", async function (response: any) {
        console.log("Payment failed", response);
        const failureData = {
          cartItemIds,
          razorPayPaymentId: response.error.metadata.payment_id,
          razorPayOrderId: response.error.metadata.order_id,
          razorPaySignature: response.error.metadata.signature || "invalid",
        };
        try {
          const verifyResponse = await verifyPaymentSignature(failureData);
          await Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text: "Your payment could not be processed. Please try again.",
          });
          if (!verifyResponse) {
            console.error("Signature verification failed for payment failure");
          }
        } catch (error) {
          console.error("Error during failure signature verification:", error);
          await Swal.fire({
            icon: "error",
            title: "Verification Error",
            text: "Something went wrong during payment failure handling.",
          });
        }
      });
      rzp1.open();
    } catch (error) {
      console.error("Error during Razorpay payment:", error);
      await Swal.fire({
        icon: "error",
        title: "Payment Initialization Failed",
        text: "There was a problem starting the payment process. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
      
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user selects
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleAddressSelection = (addressId: any) => {
    setSelectedAddress(addressId);
    setShowAddressForm(addressId === "new");
    
    // Clear form errors when switching address selection
    if (addressId !== "new") {
      setFormErrors({});
    }
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, saveInfo: checked }));
  };
  
  const handleSaveAddress = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await addAddress(formData);
      
      if (response) {
        setFormData({
          firstName: "",
          lastName: "",
          streetName: "",
          buildingName: "",
          phoneNumber: "",
          pinCode: "",
          state: "",
          district: "",
          country: "India",
          saveInfo: true,
        });
        
        setShowAddressForm(false);
        setSelectedAddress(null);
        setFormErrors({});
        
        const addressesResponse = await getAddresses();
        if (addressesResponse.data) {
          setExistingAddresses(addressesResponse.data);
        }
      }
    } catch (error) {
      console.error('Error adding address:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueToPayment = () => {
    if (!selectedAddress || selectedAddress === "new") {
      toast.info("Please select a shipping address to continue");
      return;
    }
    
    // Get checkout items from sessionStorage
    const checkoutItemsStr = sessionStorage.getItem('checkoutItems');
    if (!checkoutItemsStr) {
      toast.error("No items in cart to checkout");
      return;
    }
    
    let checkoutItems: CartItem[];
    try {
      checkoutItems = JSON.parse(checkoutItemsStr);
    } catch (error) {
      console.error('Error parsing checkout items:', error);
      toast.error("Error loading cart items");
      return;
    }
    
    // Get cart item IDs
    const cartItemIds = checkoutItems.map((item: CartItem) => item._id);
    
    if (cartItemIds.length === 0) {
      toast.info("No items in cart to checkout");
      return;
    }
    
    // Use the selected address ID
    const finalAddressId = selectedAddress;
    
    // Proceed to payment
    displayRazorpay(cartItemIds, finalAddressId, "full");
  };

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Chandigarh", "Puducherry"
  ];

  // District mapping for major states (you can expand this)
   const stateDistrictMap: Record<string, string[]> = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Sangli", "Kolhapur", "Nanded"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum", "Gulbarga", "Davangere", "Bellary", "Bijapur", "Shimoga"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Vellore", "Erode", "Thoothukudi"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand", "Bharuch"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bharatpur", "Alwar", "Sikar", "Pali"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Bardhaman", "Hugli", "Jalpaiguri", "Darjeeling"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Allahabad", "Bareilly", "Aligarh", "Moradabad"],
    "Delhi": ["Central Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "New Delhi", "North East Delhi", "North West Delhi", "South East Delhi", "South West Delhi"]
  };

  const getDistrictsForState = (state: string): string[] => {
    return stateDistrictMap[state] || [];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button className="flex items-center text-gray-600 hover:text-black transition-colors duration-200">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Back to Cart</span>
            </button>
            <h1 className="text-2xl font-bold text-black">Checkout</h1>
            <div className="flex items-center space-x-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Shipping Information Card */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-gray-700" />
                  <h2 className="text-lg font-semibold text-black">Shipping Information</h2>
                </div>
              </div>
              
              <div className="p-6">
                {/* Existing Addresses */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Select Shipping Address</h3>
                  
                  {existingAddresses.map((addr) => (
                    <div key={addr._id} className="border border-gray-200 p-4 hover:border-gray-300 transition-colors rounded-lg">
                      <label className="flex items-start cursor-pointer">
                        <input
                          type="radio"
                          name="selectedAddress"
                          value={addr._id}
                          checked={selectedAddress === addr._id}
                          onChange={(e) => handleAddressSelection(e.target.value)}
                          className="w-4 h-4 text-black bg-white border-gray-300 focus:ring-black focus:ring-1 mt-1"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-black">{addr.firstName}</h4>
                            {addr.isDefault && (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 uppercase tracking-wide">Default</span>
                            )}
                          </div>
                          <div className="mt-1 text-sm text-gray-600 space-y-1">
                            <p>{addr.district}</p>
                            <p>{addr.district}, {addr.state} - {addr.pinCode}</p>
                            <p>Phone: {addr.phoneNumber}</p>
                            <p>Address: {addr.addressType}</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                  
                  {/* Add New Address Option */}
                  <div className="border border-gray-200 p-4 hover:border-gray-300 transition-colors rounded-lg">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="selectedAddress"
                        value="new"
                        checked={selectedAddress === "new"}
                        onChange={(e) => handleAddressSelection(e.target.value)}
                        className="w-4 h-4 text-black bg-white border-gray-300 focus:ring-black focus:ring-1"
                      />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-black">Add New Address</h4>
                        <p className="text-sm text-gray-600 mt-1">Use a different shipping address</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* New Address Form - Show only when "Add New Address" is selected */}
                {showAddressForm && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wide">New Address Details</h3>
                    
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Personal Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-black">
                              First Name *
                            </label>
                            <input
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} bg-white text-black focus:ring-1 focus:ring-black focus:border-black transition-colors rounded-lg`}
                              required
                            />
                            {formErrors.firstName && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-black">
                              Last Name *
                            </label>
                            <input
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'} bg-white text-black focus:ring-1 focus:ring-black focus:border-black transition-colors rounded-lg`}
                              required
                            />
                            {formErrors.lastName && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Contact Information</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-black">
                              Phone Number *
                            </label>
                            <input
                              name="phoneNumber"
                              type="tel"
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              placeholder="Enter 10-digit mobile number"
                              className={`w-full px-4 py-3 border ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'} bg-white text-black focus:ring-1 focus:ring-black focus:border-black transition-colors rounded-lg`}
                              maxLength={10}
                              required
                            />
                            {formErrors.phoneNumber && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.phoneNumber}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Address Information */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Address</h4>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-black">
                              Building Name *
                            </label>
                            <input
                              name="buildingName"
                              value={formData.buildingName}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border ${formErrors.buildingName ? 'border-red-500' : 'border-gray-300'} bg-white text-black focus:ring-1 focus:ring-black focus:border-black transition-colors rounded-lg`}
                              required
                            />
                            {formErrors.buildingName && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.buildingName}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-black">
                              Street Name *
                            </label>
                            <input
                              name="streetName"
                              value={formData.streetName}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border ${formErrors.streetName ? 'border-red-500' : 'border-gray-300'} bg-white text-black focus:ring-1 focus:ring-black focus:border-black transition-colors rounded-lg`}
                              required
                            />
                            {formErrors.streetName && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.streetName}</p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                              <label className="block text-sm font-medium text-black">PIN Code *</label>
                              <input
      name="pinCode"
      value={formData.pinCode}
      onChange={(e) => {
        handleChange(e);
        if (e.target.value.length === 6) {
          fetchPincodeDetails(e.target.value);
        }
      }}
      placeholder="6-digit PIN code"
      maxLength={6}
      className={`w-full px-4 py-3 border ${formErrors.pinCode ? 'border-red-500' : 'border-gray-300'} bg-white text-black focus:ring-1 focus:ring-black focus:border-black transition-colors rounded-lg`}
      required
    />
        {loading && (
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Fetching location details...</span>
          </div>
        )}
    {formErrors.pinCode && (
      <p className="text-red-500 text-xs mt-1">{formErrors.pinCode}</p>
    )}

                            </div>
                           
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-black">District *</label>
                              <input
      name="district"
      value={formData.district}
      readOnly
      disabled
      className={`w-full px-4 py-3 border ${formErrors.district ? 'border-red-500' : 'border-gray-300'} bg-gray-100 text-black transition-colors rounded-lg`}
      required
    />

                              {formErrors.district && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.district}</p>
                              )}
                              {formData.state && getDistrictsForState(formData.state).length === 0 && (
                                <p className="text-gray-500 text-xs mt-1">No districts available for selected state. You can type manually.</p>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-black">State *</label>
                              <input
      name="state"
      value={formData.state}
      readOnly
      disabled
      className={`w-full px-4 py-3 border ${formErrors.state ? 'border-red-500' : 'border-gray-300'} bg-gray-100 text-black transition-colors rounded-lg`}
      required
    />
                              {formErrors.state && (
                                <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-black">
                              Country *
                            </label>
                            <input
    name="country"
    value={formData.country}
    readOnly
    disabled
    className="w-full px-4 py-3 border border-gray-300 bg-gray-100 text-black rounded-lg"
    required
  />
                          </div>
                        </div>
                      </div>
                      
                      {/* Save Information */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-3">
                          <input 
                            type="checkbox"
                            id="saveInfo" 
                            checked={formData.saveInfo}
                            onChange={(e) => handleCheckboxChange(e.target.checked)}
                            className="w-4 h-4 text-black bg-white border-gray-300 focus:ring-black focus:ring-1"
                          />
                          <label htmlFor="saveInfo" className="text-sm text-gray-700">
                            Save this address for future orders
                          </label>
                        </div>
                      </div>

                      {/* Save Address Button - Only shown when form is open */}
                      <div className="pt-6 border-t border-gray-200">
                        <button 
                          type="button" 
                          onClick={handleSaveAddress}
                          className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-4 px-6 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Saving Address...
                            </div>
                          ) : (
                            'Save Address'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Continue to Payment Button - Always shown */}
       
              </div>
            </div>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-lg border border-gray-200 sticky top-8">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Package className="h-5 w-5 mr-3 text-gray-700" />
                  <h2 className="text-lg font-semibold text-black">Order Summary</h2>
                </div>
              </div>
              
              <div className="p-6">
                {/* Items */}
                <div className="space-y-4 mb-6">
                  {orderSummary.items.length > 0 ? (
                    orderSummary.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1 pr-4">
                          <h3 className="text-sm font-medium text-black">{item.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">Quantity: {item.qty}</p>
                        </div>
                        <div className="text-sm font-medium text-black">₹{item.price.toLocaleString()}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <p>No items in checkout</p>
                    </div>
                  )}
                </div>
                
                {/* Summary */}
                {orderSummary.items.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-black">₹{orderSummary.subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-black">
                        {orderSummary.shipping === 0 ? 'Free' : `₹${orderSummary.shipping}`}
                      </span>
                    </div>
                    
                    {orderSummary.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount</span>
                        <span className="text-green-600">-₹{orderSummary.discount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (GST)</span>
                      <span className="text-black">₹{orderSummary.tax.toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-black">Total</span>
                        <span className="text-lg font-semibold text-black">₹{orderSummary.total.toLocaleString()}</span>
                      </div>
                    </div>
                             <div className="pt-6 border-t border-gray-200 mt-6">
                  <button 
                    type="button" 
                    onClick={handleContinueToPayment}
                    className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 px-6 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                    disabled={!selectedAddress || selectedAddress === "new"}
                  >
                    Continue to Payment
                  </button>
                  {(!selectedAddress || selectedAddress === "new") && (
                    <p className="text-gray-500 text-sm mt-2 text-center">
                      Please select an address to continue
                    </p>
                  )}
                </div>
                  </div>
                )}
                
                
                {/* Security Notice */}
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start">
                    <ShieldCheck className="h-4 w-4 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-black mb-1">SECURE CHECKOUT</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Your personal information is protected with SSL encryption and will not be shared with third parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;