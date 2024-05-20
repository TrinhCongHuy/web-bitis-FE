/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useState, useEffect } from 'react';
import * as CartService from '../services/CartService'
import { useSelector } from 'react-redux';

const ShoppingContext = createContext({});

export const useShoppingContext = () => {
    return useContext(ShoppingContext);
}

export const ShoppingContextProvider = ({ children }) => {
    const user = useSelector((state) => state?.user)
    const userId = user?.id;

    const syncCartWithDB = async (userId) => {
        try {
            const res = await CartService.listProductCart(userId);
            const dbCartItems = res.data;
            setCartItems(dbCartItems);
            localStorage.setItem('shopping_cart', JSON.stringify(dbCartItems));
        } catch (error) {
            console.error('Lỗi đồng bộ dữ liệu:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            syncCartWithDB(userId);
        }
    }, [userId]);

    const [cartItems, setCartItems] = useState(() => {
        const jsonCartData = localStorage.getItem('shopping_cart');
        return jsonCartData ? JSON.parse(jsonCartData) : [];
    });

    useEffect(() => {
        localStorage.setItem('shopping_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const cartQty = cartItems.reduce((qty, item) => qty + item.qty, 0);

    const totalPrice = cartItems.reduce((total, product) => total + ((product?.price - (product?.price * (product?.discount / 100))) * product?.quantity), 0);

    const handleAmountChange = async (id, value, token) => {
        try {
          await CartService.updateProductQuantityInCart(id, value, token);
        } catch (error) {
          console.error('Lỗi cập nhật số lượng sản phẩm trong giỏ hàng:', error);
        }
      };


    const increaseQty = (id) => {
        const currentCartItem = cartItems.find(item => item._id === id);
        if (currentCartItem) {
            const newItems = cartItems.map(item => {
                if (item._id === id) {
                    return { ...item, quantity: item.quantity + 1 };
                } else {
                    return item;
                }
            });
            setCartItems(newItems); 
            handleAmountChange(id, currentCartItem.quantity + 1,  user?.access_token)
        }
        
    }

    const decreaseQty = (id) => {
        const currentCartItem = cartItems.find(item => item._id === id);
        if (currentCartItem) {
            const newItems = cartItems.map(item => {
                if (item._id === id && item.quantity > 1) {
                    return { ...item, quantity: item.quantity - 1 };
                } else {
                    return item;
                }
            });
            setCartItems(newItems);
            handleAmountChange(id, currentCartItem.quantity - 1, user?.access_token);
        }
    }
    

    const addCartItem = (product) => {
        if (product) {
            const currentCartItem = cartItems.find(item => item._id === product._id);
            if (currentCartItem) {
                const newItems = cartItems.map(item => {
                    if (item._id === product._id) {
                        return { ...item, quantity: item.quantity + product.quantity
                             };
                    } else {
                        return item;
                    }
                });
                setCartItems(newItems);
            } else {
                const newItem = { ...product, quantity: product.quantity };
                setCartItems([...cartItems, newItem]);
            }
        }
    }

    const removeCartItem = async (id) => {
        try {
            await CartService.deleteProductCart(id, user?.access_token);
            const newItems = cartItems.filter(item => item._id !== id);
            setCartItems(newItems);
        } catch (error) {
            console.error('Lỗi xoá sản phẩm từ giỏ hàng:', error);
        }
    }

    const clearCart = () => {
        setCartItems([]);
    }

    return (
        <ShoppingContext.Provider value={{ cartItems, cartQty, totalPrice, increaseQty, decreaseQty, addCartItem, removeCartItem, clearCart }}>
            {children}
        </ShoppingContext.Provider>
    );
}

export default ShoppingContext;
