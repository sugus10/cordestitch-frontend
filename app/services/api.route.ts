export const API_CONSTANTS = {
  PRODUCTS: {
    GET_FILTER_PANT: "/api/product/getAllFilterCondition",
    GET_ALL_PANTS: "/api/product/getAllProducts",
    APPLY_FILTER: "/api/product/filterProductData",
    GET_PRODUCT_BY_ID: (productId: string): string =>
      `/api/product/getProductByProductId?productId=${productId}`
  },
  CART: {
    ADD_TO_CART: "/api/cart/addToCart",
    GET_CART: "/api/cart/getCartItems",
    CANCEL_ORDER:"/api/v1/routes/user/orders/cancel",
    REVERT_ORDER:"/api/v1/routes/user/orders/revert"
  },
  OTP: {
    SEND: "/api/otp/sendOtp",
    VERIFY: "/api/otp/verifyOtp",
  },
  USER: {
    LOGIN: "/api/user/login",
    REGISTER: "/api/user/register",
    UPDATE_PROFILE: "/api/v1/routes/user/",
    UPDATE_EMAIL_OR_PHONE: "/api/auth/updateEmailAddressOrPhoneNumber",
    VALIDATE_OTP: "/api/auth/validateOTPForEmailOrPhoneNumber",
    GET_ADDRESSES: "/api/v1/routes/user/address/",
    ADD_ADDRESS: "/api/v1/routes/user/address/",
    UPDATE_ADDRESS: "/api/v1/routes/user/address",
    DELETE_ADDRESS: (addressId: string): string =>
      `/api/v1/routes/user/address/${addressId}`  ,
      LOGOUT: "/api/v1/routes/auth/logout",
    GET_USER_DETAILS: "/api/auth/getUserDetails",
  },
  PAYMENT: {
    CREATE_PAYMENT: "/api/v1/routes/checkout/initiate",
    VERIFY_PAYMENT_SIGNATURE: "/api/v1/routes/checkout/verify",
    RETRY_PAYMENT: "/api/payment/retryPayment",
    TRANSFER_TO_BANK: "/api/payment/transfer-to-account",
    REEDEM_LOYALTY: (totalRedeemablePoints: number) =>
      `/api/loyalty/redeemMoney?totalRedeemablePoints=${totalRedeemablePoints}`,
  },
  FAQS: {
    GET_ALL_FAQ: "/api/v1/routes/faqs",
  },

  BANK_DETAILS: {
    ADD_DETAILS: "/api/v1/routes/user/bank-details",
    GET_DETAILS: "/api/v1/routes/user/bank-details",
    UPDATE_DETAILS:"/api/v1/routes/user/bank-details",
    DELETE_DETAILS: (userBankId: string) =>
      `/api/v1/routes/user/bank-details/${userBankId}`,
    
  },
  CART_BEFORE_LOGIN: {
    GENERATE_TOKEN: "/api/session/generate",
    ADD_CART: "/api/session/cart/add",
    REMOVE: "/api/session/cart/remove",
    FETCH: "/api/session/cart/fetch",
    UPDATE: "/api/session/cart/update",
  },
  CUSTOMIZE:{
   PRESIGNED_URL:"/api/v1/routes/presigned-url/",
   ADD_CART:"/api/v1/routes/cart/",
  },
  LOYALTY: {
    GET_LOYALTY_POINTS: "/api/loyalty/getLoyaltyPointsSummary",
    REEDEM_LOYALTY: (totalRedeemablePoints: number) =>
      `/api/loyalty/redeemMoney?totalRedeemablePoints=${totalRedeemablePoints}`,
  },
  T_SHIRTS: {
    GET_ALL_CATEGORY: "/api/v1/routes/categories/",
    GET_CATEGORIES_BY_TYPE: (categoryId: string) =>
      `/api/v1/routes/categories/?categoryId=${categoryId}`,
    GET_ALL_SUB_CATEGORY: "/api/v1/routes/subcategories",
    GET_HOME_PAGE_DATA: "/api/v1/routes/home/",
    GET_FILTER_OPTIONS_BY_CATEGORY: (categoryId: string) =>
      `/api/v1/routes/filter/filter-option?categoryId=${categoryId}`,
    GET_PRODUCT_BY_FILTER: ({
      categoryId,
      size,
      color,
    }: {
      categoryId: string;
      size?: string[];
      color?: string[];
    }) => {
      const params = new URLSearchParams({ categoryId });

      if (size?.length) {
        params.append("size", size.join(","));
      }

      if (color?.length) {
        params.append("color", color.join(","));
      }

      return `/api/v1/routes/filter?${params.toString()}`;
    },



    GET_PRODUCT_BY_ID: (productId: string) =>
      `/api/v1/routes/products?productId=${productId}`,



  },
  REVIEW: {
    CREATE_REVIEW: "/api/v1/routes/reviews",
    UPDATE_REVIEW: "/api/reviews/updateReview",
    GET_PRODUCT_REVIEW: (productId: string) =>
      `/api/v1/routes/reviews/product/${productId}`,
  },
  TCART:{
    DELETE_CART_ITEM_BY_ID: (cartItemId: string) =>
      `/api/v1/routes/cart/${cartItemId}`,
      GET_CART_ITEMS: "/api/v1/routes/cart/",
      UPDATE_CART:"/api/v1/routes/cart/",

    
        
      },
};