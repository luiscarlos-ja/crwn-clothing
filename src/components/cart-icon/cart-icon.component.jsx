import { useContext } from "react";
import { CartContext } from "../../context/cart.context";
import { CartIconContainer, ShoppingIcon, ItemCount } from "./cart-icon.styles";

const CartIcon = () => {
  const { setIsCartOpen, cartCount } = useContext(CartContext);

  const handleCartIconClick = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <CartIconContainer onClick={handleCartIconClick}>
      <ShoppingIcon className="shopping-icon" />
      <ItemCount>{cartCount}</ItemCount>
    </CartIconContainer>
  );
};

export default CartIcon;
