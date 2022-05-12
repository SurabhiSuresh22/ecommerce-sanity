import React, {createContext, useContext, useState, useEffect} from 'react';
import {toast} from 'react-hot-toast'

const Context = createContext();

export const StateContext = ({children}) =>{
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantites] = useState(0);
    const [qty, setQty] = useState(1);

    let foundproduct;
    let index;
    
    const onAdd = (product, quantity) =>{
        const checkProductInCart = cartItems.find((item)=> item._id === product._id);
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price*quantity);
        setTotalQuantites((prevTotalQuantities)=> prevTotalQuantities + quantity);

        if(checkProductInCart){
            
            const updatedCartItems = cartItems.map((cartProduct) =>{
                if(cartProduct._id === product._id) return {
                    ...cartProduct, 
                    quantity: cartProduct.quantity + quantity
                }
            })
                
            setCartItems(updatedCartItems); 
        }
        else{
            product.quantity = quantity;
            setCartItems([...cartItems, {...product}])
        }
        toast.success(`${qty} ${product.name} added to the cart`)
    }

    const onRemove = (product) =>{
        foundproduct = cartItems.find((item) => item._id === product._id);
        const newcartItems = cartItems.filter((item)=> item._id !== product._id)
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundproduct.price * foundproduct.quantity)
        setTotalQuantites( prevTotalQuantities => prevTotalQuantities - foundproduct.quantity)
        setCartItems(newcartItems)
    }

    const toggleCartItemQuantity = (id,value) =>{
        foundproduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id)
        const newcartItems = cartItems.filter((item)=> item._id !== id)

        if(value === 'inc'){
            
            // updating cart items with current items, spreading properties ...product
            setCartItems([...newcartItems, {...foundproduct, quantity: foundproduct.quantity +1}]  );
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundproduct.price);
            setTotalQuantites(prevTotalQuantities => prevTotalQuantities + 1)
            //foundproduct.quantity +=1;
            //cartsItems[index] = foundProduct
        }
        else if (value==='dec'){
            if (foundproduct.quantity >1 ){
                setCartItems([...newcartItems, {...foundproduct, quantity: foundproduct.quantity - 1}]  );
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundproduct.price);
                setTotalQuantites(prevTotalQuantities => prevTotalQuantities - 1)
            }
        }
    };

    const incQty = () =>{
        setQty((prevQty) => prevQty + 1);
    };

    const decQty = () =>{
        setQty((prevQty) => { 
        if(prevQty - 1 < 1) return 1;
        return prevQty -1;
        })
    }

    return (
        <Context.Provider 
        value ={{
            showCart,
            setShowCart,
            cartItems,
            totalPrice,
            totalQuantities,
            qty,
            incQty,
            decQty,
            onAdd,
            toggleCartItemQuantity,
            onRemove
        }}>
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);