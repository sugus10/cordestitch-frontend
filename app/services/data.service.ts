import {
  AddressResponse,
  ApiResponsess,
  FAQ,
  FilterOptionsResponse,
  HomePageResponse,
  ILoginResponse,
  ISendOtpLoginRequest,
  IVerifyOtpRequest,
  ProductCustomizationResponse,
  ReviewResponse,
  UpdateUserParams,
  UserDetails,
  ValidateOTPRequest,
} from "@/lib/type";
import { API_CONSTANTS } from "./api.route";
import {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "./httpServices";
import { Address } from "cluster";
import { LoyaltyPointsData } from "../(routes)/(public)/profile/loyaltyPoints/loyalty";
import http from "../http-common";
import { fetchData } from "./tshirtService";
import { AxiosRequestConfig } from "axios";

export const getFilterPant = async () => {
  try {
    const response = await getRequest(API_CONSTANTS.PRODUCTS.GET_FILTER_PANT);
    return response;
  } catch (error) {
    console.error("Error fetching filter conditions:", error);
    throw new Error("Error fetching filter conditions");
  }
};

export const getAllPants = async () => {
  try {
    const response = await getRequest(API_CONSTANTS.PRODUCTS.GET_ALL_PANTS);
    return response;
  } catch (error) {
    console.error("Error fetching all pants:", error);
    throw new Error("Error fetching all pants");
  }
};

export const applyFilter = async (filterData: Record<string, any>) => {
  try {
    const response = await postRequest(
      API_CONSTANTS.PRODUCTS.APPLY_FILTER,
      filterData
    );
    return response;
  } catch (error) {
    console.error("Error applying product filter:", error);
    throw new Error("Error applying product filter");
  }
};

export const getProductById = async (productId: string) => {
  try {
    const url = API_CONSTANTS.PRODUCTS.GET_PRODUCT_BY_ID(productId);
    const response = await getRequest(url);
    return response;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw new Error("Error fetching product details");
  }
};
export const revertOrder = async (body: { order_id: string }) => {
  try {
    const url = API_CONSTANTS.CART.REVERT_ORDER;
    const response = await deleteRequest(url, body); // assuming your `deleteRequest` can take a body
    return response;
  } catch (error) {
    throw new Error("Error While Reverting Order");
  }
};

export const getOrders = async () => {
  try {
    const url = "/api/v1/routes/user/orders";
    const response = await getRequest(url);
    return response;
  } catch (error) {
    throw new Error("Error fetching product details");
  }
};

// interface CartItemRequest {
//   productId: string;
//   productName: string;
//   productSize: number;
//   productColor: string;
//   productColorCode: string;
//   productOfferPercentage: number;
//   quantity: number;
//   price: number;
// }

// interface AddToCartPayload {
//   cartItemRequests: CartItemRequest[];
// }

// export const addCart = async (payload: AddToCartPayload) => {
//   try {
//     const response = await postRequest(API_CONSTANTS.CART.ADD_TO_CART, payload);
//     return response;
//   } catch (error) {
//     console.error("Error adding item to cart:", error);
//     throw new Error("Error adding item to cart");
//   }
// };

// adding bank details

export const saveBankDetails = async (bankDetails: {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
}) => {
  try {
    const response = await postRequest(
      API_CONSTANTS.BANK_DETAILS.ADD_DETAILS,
      bankDetails
    );
    return response;
  } catch (error) {
    console.error("Error saving bank details:", error);
    throw new Error("Failed to save bank details. Please try again.");
  }
};

export const updateBankDetails = async (
  bankAccountId: string,
  updatedData: {
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
  }
) => {
  try {
    const requestBody = {
      bankAccountId,
      updatedData,
    };

    const response = await putRequest(
      API_CONSTANTS.BANK_DETAILS.UPDATE_DETAILS,
      requestBody
    );

    return response;
  } catch (error) {
    console.error("Error updating bank details:", error);
    throw new Error("Failed to update bank details. Please try again.");
  }
};

//get Bank Details

type BankDetail = {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  _id: string;
};

type BankDetailsResponse = {
  status: number;
  message: string;
  data: BankDetail[];
};

export const getBankDetails = async (): Promise<BankDetailsResponse> => {
  try {
    const response = await getRequest(API_CONSTANTS.BANK_DETAILS.GET_DETAILS);
    return response as BankDetailsResponse;
  } catch (error) {
    console.error("Error fetching bank details:", error);
    throw new Error("Failed to fetch bank details. Please try again.");
  }
};

// delete Bank Details

export const deleteBankDetails = async (userBankId: string) => {
  try {
    const response = await deleteRequest(
      API_CONSTANTS.BANK_DETAILS.DELETE_DETAILS(userBankId)
    );
    return response;
  } catch (error) {
    console.error("Error deleting bank details:", error);
    throw new Error("Failed to delete bank details. Please try again.");
  }
};

//payment service
export const createPayment = async (requestBody: any) => {
  try {
    const response = await postRequest(
      API_CONSTANTS.PAYMENT.CREATE_PAYMENT,
      requestBody
    );
    return response;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw new Error("Error creating payment");
  }
};

export const verifyPaymentSignature = async (postData: any) => {
  try {
    const response = await postRequest(
      API_CONSTANTS.PAYMENT.VERIFY_PAYMENT_SIGNATURE,
      postData
    );
    return response;
  } catch (error) {
    console.error("Error verifying payment signature:", error);
    throw new Error("Error verifying payment signature");
  }
};

export const retryPayment = async (requestBody: {
  orderId: string;
  totalAmount: number;
  paymentMethod: string;
}) => {
  try {
    const response = await postRequest(
      API_CONSTANTS.PAYMENT.RETRY_PAYMENT,
      requestBody
    );
    return response;
  } catch (error) {
    console.error("Error retrying payment:", error);
    throw new Error("Error retrying payment");
  }
};

// get faqs data
export const getFaqs = async (): Promise<ApiResponsess> => {
  try {
    const response = await getRequest(API_CONSTANTS.FAQS.GET_ALL_FAQ);

    return response as ApiResponsess;
  } catch (error) {
    console.error("Error fetching loyalty points:", error);
    throw new Error("Error fetching loyalty points");
  }
};

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  productSize: number;
  productColor: string;
  productColorCode: string;
  quantity: number;
  price: number;
  productOfferPercentage: number;
  productImagesUrl: string;
  productStocksAvailable: number;
  productAvailableColors: Record<string, string>;
  productAvailableSizes: number[];
}

export interface CartResponse {
  cartId: string;
  cartItemResponses: CartItem[];
}

export interface ApiAddress {
  _id: string;
  firstName: string;
  lastName: string;
  streetName: string;
  buildingName: string;
  phoneNumber: string;
  pinCode: string;
  state: string;
  district: string;
  country: string;
  landMark: string | null;
  alternatePhoneNumber: string | null;
  addressType: string;
  isDefault?: boolean;
}

export interface ApiResponse {
  message: string;
  data: ApiAddress[];
}

export const getCartItems = async (): Promise<CartResponse> => {
  try {
    const response = await getRequest(API_CONSTANTS.CART.GET_CART);
    return response as CartResponse;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw new Error("Error fetching cart items");
  }
};
// address service
export const useAddressAPIService = () => {
  const getAddresses = async (): Promise<ApiResponse> => {
    try {
      const res = await getRequest<ApiResponse>(
        API_CONSTANTS.USER.GET_ADDRESSES
      );

      if (!res.data || !Array.isArray(res.data)) {
        throw new Error("Invalid address data format");
      }

      return res;
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return {
        message: "Failed to fetch addresses",
        data: [],
      };
    }
  };

  const addAddress = async (address: any): Promise<AddressResponse> => {
    const res = await postRequest(API_CONSTANTS.USER.ADD_ADDRESS, {
      ...address,
    });
    return res as AddressResponse;
  };

  const updateAddress = async (addressId: string, updatedData: any) => {
    const res = await putRequest(API_CONSTANTS.USER.UPDATE_ADDRESS, {
      addressId,
      ...updatedData,
    });
    return res;
  };

  const deleteAddress = async (addressId: string) => {
    const url = API_CONSTANTS.USER.DELETE_ADDRESS(addressId);
    const res = await deleteRequest(url);
    return res;
  };

  return {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
  };
};

//Transfer to the Bank Account
export const transferToBank = async (transferDetails: {
  userBankId: string;
  amount: number;
}) => {
  try {
    const response = await postRequest(
      API_CONSTANTS.PAYMENT.TRANSFER_TO_BANK,
      transferDetails
    );
    return response;
  } catch (error) {
    console.error("Error transferring amount to bank:", error);
    throw new Error("Failed to transfer amount. Please try again.");
  }
};

// get loyalty points
export const getLoyaltyPoint = async (): Promise<LoyaltyPointsData> => {
  try {
    const response = await getRequest(API_CONSTANTS.LOYALTY.GET_LOYALTY_POINTS);

    return response as LoyaltyPointsData;
  } catch (error) {
    console.error("Error fetching loyalty points:", error);
    throw new Error("Error fetching loyalty points");
  }
};

// function for redeeming loyalty points

export const redeemLoyaltyPoints = async (totalRedeemablePoints: number) => {
  try {
    const response = await postRequest(
      API_CONSTANTS.PAYMENT.REEDEM_LOYALTY(totalRedeemablePoints)
    );
    return response;
  } catch (error) {
    console.error("Error redeeming loyalty points:", error);
    throw new Error("Failed to redeem loyalty points. Please try again.");
  }
};

//profile service
export const useUserAPIService = () => {
  const updateEmailOrPhoneNumber = async ({
    emailAddress,
    phoneNumber,
  }: UpdateUserParams): Promise<any> => {
    const requestBody = { emailAddress, phoneNumber };
    console.log("Request Body:", JSON.stringify(requestBody, null, 2));

    const res = await postRequest(
      API_CONSTANTS.USER.UPDATE_EMAIL_OR_PHONE,
      requestBody
    );
    return res;
  };

  const validateOTPForEmailOrPhoneNumber = async (
    request: ValidateOTPRequest
  ) => {
    console.log("Payload before API call:", request); // Debug log
    const res = await postRequest(API_CONSTANTS.USER.VALIDATE_OTP, request);
    return res;
  };

  const updateProfile = async (request: {
    email?: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
  }): Promise<any> => {
    const payload = {
      updatedData: {
        email: request.email,
        firstName: request.firstName,
        lastName: request.lastName,
        gender: request.gender,
      },
    };
    const res = await putRequest(API_CONSTANTS.USER.UPDATE_PROFILE, payload);
    return res;
  };

  const logoutService = async (): Promise<any> => {
    try {
      const res = await postRequest(API_CONSTANTS.USER.LOGOUT);

      if (res) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
        }
        delete http.defaults.headers.common["Authorization"];

        return res;
      }
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  const getUserDetails = async (): Promise<UserDetails> => {
    const res = await getRequest(API_CONSTANTS.USER.GET_USER_DETAILS);
    return res as UserDetails;
  };

  return {
    updateEmailOrPhoneNumber,
    getUserDetails,
    updateProfile,
    validateOTPForEmailOrPhoneNumber,
    logoutService,
  };
};

// Get all categories
export const getAllCategories = async () => {
  const res = await fetchData(API_CONSTANTS.T_SHIRTS.GET_ALL_CATEGORY);
  return res;
};

// Get categories by type and ID
export const getCategoriesByType = async (categoryId: string) => {
  const url = API_CONSTANTS.T_SHIRTS.GET_CATEGORIES_BY_TYPE(categoryId);
  const res = await fetchData(url);
  return res;
};

// Get all subcategories
export const getAllSubCategories = async () => {
  const res = await fetchData(API_CONSTANTS.T_SHIRTS.GET_ALL_SUB_CATEGORY);
  return res;
};

// Get home page data
export const getHomePageData = async (): Promise<HomePageResponse> => {
  const res = await fetchData(API_CONSTANTS.T_SHIRTS.GET_HOME_PAGE_DATA);
  return res as HomePageResponse;
};

export const getFilterOptionsByCategory = async (
  categoryId: string
): Promise<FilterOptionsResponse> => {
  const res = await fetchData(
    API_CONSTANTS.T_SHIRTS.GET_FILTER_OPTIONS_BY_CATEGORY(categoryId)
  );
  return res as FilterOptionsResponse;
};
interface Product {
  _id: string;
  categoryId: string;
  subcategoryId: string;
  productName: string;
  productDescription: string;
  basePrice: number;
  coverImage: string;
  colorName: string;
  colorCode: string;
}

interface ProductResponse {
  status: number;
  data: Product[];
}

export const getProductByFilter = async ({
  categoryId,
  size,
  color,
}: {
  categoryId: string;
  size?: string[];
  color?: string[];
}): Promise<ProductResponse> => {
  const url = API_CONSTANTS.T_SHIRTS.GET_PRODUCT_BY_FILTER({
    categoryId,
    size,
    color,
  });
  const res = await fetchData(url);
  return res as ProductResponse;
};

export const getProductCustomizationDetails = async (
  productId: string
): Promise<ProductCustomizationResponse> => {
  const res = await fetchData(
    API_CONSTANTS.T_SHIRTS.GET_PRODUCT_BY_ID(productId)
  );
  return res as ProductCustomizationResponse;
};

export interface ReviewDataRequest {
  productId: string;
  rating: number;
  order_id:string;
  comment: string;
  images?: string[];
  videos?: string[];
}
interface PresignedUrlResponse {
  status: number;
  data: {
    url: string;
    key: string;
    fileName: string;
  }[];
}
export const createReview = async (reviewData: ReviewDataRequest) => {
  const requestBody = {
    productId: reviewData.productId,
    rating: reviewData.rating,
    comment: reviewData.comment,
    order_id:reviewData.order_id,
    images: reviewData.images,
    videos: reviewData.videos,
  };

  try {
    await postRequest(API_CONSTANTS.REVIEW.CREATE_REVIEW, requestBody);
  } catch (e) {
    console.log("Error in creating review:", e);
  }
};
export const getPresignedUrl = async (fileName: string, fileType: string) => {
  const requestBody = {
    uploadType: "product",
    files: [
      {
        fileName,
        fileType,
      },
    ],
  };

  try {
    const response = await postRequest<PresignedUrlResponse>(
      API_CONSTANTS.CUSTOMIZE.PRESIGNED_URL,
      requestBody
    );

    if (response?.status === 200 && response.data?.length > 0) {
      return response.data[0]; // returns { url, key, fileName }
    } else {
      throw new Error("Failed to get presigned URL");
    }
  } catch (err) {
    console.error("Presigned URL fetch error:", err);
    return null;
  }
};

 export const uploadFileToS3 = async (file: File) => {
  const uploadData = await getPresignedUrl(file.name, file.type);
  if (!uploadData) throw new Error("Failed to get presigned URL");

  const uploadResponse = await fetch(uploadData.url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file
  });

  if (!uploadResponse.ok) throw new Error("Upload failed");

  return `https://cordestitch.s3.ap-south-1.amazonaws.com/${uploadData.key}`;
};

export const editReview = async (
  request: FormData
): Promise<ReviewResponse> => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  try {
    const response = await putRequest<ReviewResponse>(
      API_CONSTANTS.REVIEW.UPDATE_REVIEW,
      request,
      config
    );
    return response;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};

export const loginService = (
  data: ISendOtpLoginRequest
): Promise<ILoginResponse> => postRequest(API_CONSTANTS.USER.LOGIN, data);

export const sendOtpService = (data: ISendOtpLoginRequest) =>
  postRequest(API_CONSTANTS.OTP.SEND, data);
export const verifyOtpService = (data: IVerifyOtpRequest) =>
  postRequest(API_CONSTANTS.OTP.VERIFY, data);

export interface TextConfig {
  inputText: string;
  textSize: number;
  textAlign: string;
  font: string;
  color: string;
  textX: number;
  textY: number;
  position: string;
}

export interface ImageConfig {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  imageX: number;
  imageY: number;
  position: string;
}

export interface SizeQuantityList {
  [size: string]: number;
}

export interface AddToCartPayload {
  productId: string;
  colorId: string;
  text: TextConfig[];
  image: ImageConfig[];
  sizeQuantityList: SizeQuantityList;
}

export const addToCart = async (cartData: AddToCartPayload) => {
  try {
    const response = await postRequest(
      API_CONSTANTS.CUSTOMIZE.ADD_CART,
      cartData
    );
    return response;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw new Error("Failed to add item to cart. Please try again.");
  }
};

export const getTCartItems = async () => {
  try {
    const response = await getRequest(API_CONSTANTS.TCART.GET_CART_ITEMS);
    return response;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw new Error("Failed to fetch cart items. Please try again.");
  }
};

export const getProductReviews = async (productId: string) => {
  try {
    const response = await getRequest(API_CONSTANTS.REVIEW.GET_PRODUCT_REVIEW(productId));
    return response;
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    throw new Error("Failed to fetch product reviews. Please try again.");
  }
};

export const cancelOrder = async (orderId: string, reason: string) => {
  try {
    const payload = {
      order_id: orderId,
      reason: reason,
    };

    const response = await postRequest(API_CONSTANTS.CART.CANCEL_ORDER, payload);
    return response;
  } catch (error) {
    console.error(`Error cancelling order ${orderId}:`, error);
    throw new Error("Failed to cancel the order. Please try again.");
  }
};


export const deleteCartItemById = async (cartItemId: string) => {
  try {
    const response = await deleteRequest(
      API_CONSTANTS.TCART.DELETE_CART_ITEM_BY_ID(cartItemId)
    );
    return response;
  } catch (error) {
    console.error("Error deleting cart item:", error);
    throw new Error("Failed to delete cart item. Please try again.");
  }
};

interface UpdateCartItemResponse {
  status: string;
  message: string;
  data: CartItem;
}
export const updateCartItem = async (cartItemDetails: {
  cartItemId: string;
  updatedSizeQuantityList: { [size: string]: number };
}): Promise<UpdateCartItemResponse> => {
  try {
    const response = await putRequest(
      API_CONSTANTS.TCART.UPDATE_CART,
      cartItemDetails
    );
    return response as UpdateCartItemResponse;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw new Error("Failed to update cart item. Please try again.");
  }
};
