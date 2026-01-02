export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  inStock: boolean;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "id" | "quantity">) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}
