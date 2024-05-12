import { useContext } from "react";
import { ReactComponent as ShoppingIcon } from "../../assets/shopping-bag.svg";
import { CartContext } from "../../context/cart.context";
import "./cart-icon.styles.scss";

const CartIcon = () => {
  const { setIsCartOpen } = useContext(CartContext);

  const handleCartIconClick = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <div className="cart-icon-container" onClick={handleCartIconClick}>
      <ShoppingIcon className="shopping-icon" />
      <span className="item-count">0</span>
    </div>
  );
};

export default CartIcon;
