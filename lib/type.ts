export type ProfileSection =
  | 'name'
  | 'email'
  | 'phone'
  | 'gender';

export interface Address {
  id: number;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface ProfileData {

  name: string;
  email: string;
  phone: string;
  gender: string;
  avatar: string;
  statistics: {
    orders: number;
    wishlist: number;
    reviews: number;
    totalSpent: number;
  };
  addresses: Address[];


}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
 export interface ApiResponsess {
  success: boolean;
  message: string;
  data: FAQ[];
  count: number;
}

export interface UserDetails {
  firstName: string;
  lastName: string;
  gender: string | null;
  emailAddress: string;
  emailAddressVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  referralCode: string;
  userType: "customer" | "admin" | "other";
  addressResponses: Address[];
}


export interface AuthTokenResponse {
  accessToken: string;
  tokenExpiryTime: string;
  refreshTokenExpiryTime: string;
  statusCode: number;
}

export interface ILoginResponse {
  firstName: string;
  lastName: string;
  emailAddress: string;
  emailAddressVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  referralCode: string;
  userType: string;
  authTokenResponse: AuthTokenResponse;
  gender: string;
}


export default interface IRegisterResponse {
  message: string;
  id: string;
  phoneNumber: string;
  statusCode: number;
  data?: any;
}

export interface ISendAndVerifyOtpResponse {
  statusCode: number;
  message: string;
}
export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  userType: string;
  referralCode?: string;
}

export interface ISendAndVerifyOtpResponse {
  statusCode: number;
  message: string;
}

export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  userType: string;
  referralCode?: string;
}
export interface IVerifyOtpRequest {
  phoneNumber: string;
  otp: string;
}

export interface ISendOtpLoginRequest {
  phoneNumber: string;

}


export interface ISendOtpLoginRequest {
  phoneNumber: string;
}


interface UpdatedData {
  firstName?: string;
  lastName?: string;
  gender?: string;
  emailAddress?: string;

}


export interface UpdateUserParams {
  emailAddress?: string;
  phoneNumber?: string;
}

export interface ValidateOTPRequest {
  otpCode: string;
  emailAddress?: string;
  phoneNumber?: string;
}

export interface User {
  firstName: string;
  lastName: string;
  gender: string | null;
  emailAddress: string;
  emailAddressVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  referralCode: string;
  userType: "customer" | "admin" | "other"; // Use union types if there are fixed values
  addressResponses: Address[]; // Assuming addressResponses contains objects, replace with appropriate type
}

export interface UserDetails {
  firstName: string;
  lastName: string;
  gender: string | null;
  emailAddress: string;
  emailAddressVerified: boolean;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  referralCode: string;
  userType: "customer" | "admin" | "other";
  addressResponses: Address[];
}

// types.ts or within the same file

export interface Category {
  _id: string;
  categoryName: string;
  categoryDescription: string;
  coverImage: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Product {
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  categoryId: string;
}

export interface HomePageResponse {
  data: {
    categories: Category[];
    homePageTrendingProducts: Product[];
    homePageLandscapeImages: string[];
  };
}



export interface FilterOptionsResponse {
  status: number;
  data: {
    subcategories: {
      _id: string;
      name: string;
    }[];
    colors: {
      colorName: string;
      colorCode: string;
    }[];
    sizes: string[];
    attributes: {
      neck: string[];
      sleev: string[];
    };
  };
}

export interface ProductCustomizationResponse {
  status: number;
  data: {
    customizationPricing: {
      front: {
        imagePricePerCm2: number;
        textPricePerCharSizeUnit: number;
      };
      back: {
        imagePricePerCm2: number;
        textPricePerCharSizeUnit: number;
      };
      left: {
        imagePricePerCm2: number;
        textPricePerCharSizeUnit: number;
      };
      right: {
        imagePricePerCm2: number;
        textPricePerCharSizeUnit: number;
      };
    };
    _id: string;
    categoryId: string;
    subcategoryId: string;
    productName: string;
    productDescription: string;
    attributes: Record<string, string>;
    basePrice: number;
    coverImage: string;
    colors: Array<{
      _id: string;
      colorPriority: number;
      colorName: string;
      colorPrice: number;
      colorCode: string;
      colorImage: Record<"front" | "back" | "left" | "right", string>;
    }>;
    sizeList: Record<string, number>;
    pricePerScaling: Record<string, number>;
    active: boolean;
    featured: boolean;
  };
}



export interface ReviewResponse {
  reviewId: string;
  userName: string;
  rating: number;
  comment: string;
  description: string | null;
  imagePaths: any;
  videoPaths: any;
  createdAt: string;
}

export interface PaymentData {
  currency: string;
  totalAmount: number;
  paymentMethod: string;
  razorPayOrderId: string;
}


interface AddressData {
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
  _id: string;
}

export interface AddressResponse {
  status: number;
  message: string;
  data: AddressData;
}
