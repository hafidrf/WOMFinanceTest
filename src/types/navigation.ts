import { Product } from "./api";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Detail: {
    productId: number;
    fallbackProduct?: Product;
  };
};
