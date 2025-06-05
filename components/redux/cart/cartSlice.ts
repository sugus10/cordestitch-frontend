import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { toast } from "sonner";

interface CartItem {
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
  productAvailableColors: { [colorName: string]: string };
  productAvailableSizes: number[];
}


interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const roundToTwoDecimalPlaces = (num: number) => Math.round(num * 100) / 100;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const { productId, productSize, productColor, quantity, price } =
        action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.productId === productId &&
          item.productSize === productSize &&
          item.productColor === productColor
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = roundToTwoDecimalPlaces(
          existingItem.quantity * (price / quantity)
        );
        
      } else {
        state.items.push({ ...action.payload });
      }

      state.totalQuantity += quantity;
      state.totalAmount = roundToTwoDecimalPlaces(
        state.totalAmount + price * quantity
      );
    },

    removeItem: (
      state,
      action: PayloadAction<{
        productId: string;
        productColor: string;
        productSize: number;
      }>
    ) => {
      const itemToRemove = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.productColor === action.payload.productColor &&
          item.productSize === action.payload.productSize
      );

      if (itemToRemove) {
        state.totalQuantity -= itemToRemove.quantity;
        state.totalAmount = roundToTwoDecimalPlaces(
          state.totalAmount - itemToRemove.price
        );
        state.items = state.items.filter(
          (item) =>
            !(
              item.productId === action.payload.productId &&
              item.productColor === action.payload.productColor &&
              item.productSize === action.payload.productSize
            )
        );
        toast.error("Item Removed", { id: "item_removed" });
      }
    },

    updateItemQuantity: (
      state,
      action: PayloadAction<{
        productColorCode: string;
        productSize: number;
        productId: string;
        type: "INCREMENT" | "DECREMENT";
      }>
    ) => {
      const existingItem = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.productSize === action.payload.productSize &&
          item.productColorCode === action.payload.productColorCode
      );

      if (existingItem) {
        const quantityChange = action.payload.type === "INCREMENT" ? 1 : -1;

        if (existingItem.quantity + quantityChange > 0) {
          existingItem.quantity += quantityChange;

          state.totalQuantity += quantityChange;
          state.totalAmount = roundToTwoDecimalPlaces(
            state.totalAmount + existingItem.price * quantityChange
          );
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addItem, removeItem, updateItemQuantity, clearCart } =
  cartSlice.actions;

export const selectCart = (state: RootState) => state.cart;

export default cartSlice.reducer;
