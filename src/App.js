import React, {useState, useEffect} from 'react'
import {commerce} from './lib/commerce'
import Navbar from './components/Navbar/Navbar'
import Products from './components/products/Products'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Cart from './components/Cart/Cart';
import Checkout from './components/CheckoutForm/Checkout/Checkout';



function App() {

    const [product, setProduct] = useState([])
    const [cart, setCart] = useState({})
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchProducts = async () =>{
      const response = await commerce.products.list()

      setProduct(response.data)
    }

    const fetchCart = async () => {

      const cart = await commerce.cart.retrieve() 

      setCart(cart)
    }

    const handleAddToCart = async (productId, quantity) => {
      const item = await commerce.cart.add(productId, quantity)

      setCart(item.cart)
      // console.log(cart)

    }

    const handleUpdateCartQty = async (lineItemId, quantity) => {
      const response = await commerce.cart.update(lineItemId, { quantity });

      setCart(response.cart);
    };

    const handleRemoveFromCart = async (lineItemId) => {
      const response = await commerce.cart.remove(lineItemId);

      setCart(response.cart);
    };

    const handleEmptyCart = async () => {
      const response = await commerce.cart.empty();
  
      setCart(response.cart);
    };

    const refreshCart = async () => {
      const newCart = await commerce.cart.refresh();
  
      setCart(newCart);
    };
  
    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
      try {
        const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
  
        setOrder(incomingOrder);
  
        refreshCart();
      } catch (error) {
        setErrorMessage(error.data.error.message);
      }
    };

  useEffect( () => {
    fetchProducts()
    fetchCart()
  },[])
  
  

  return (
      <Router>
        <div>
          <Navbar totalItems={cart.total_items}/>
          <Switch>
              <Route exact path='/'>
                  <Products products= {product} onAddToCart={handleAddToCart}/>
              </Route>
              <Route exact path='/cart'>
              <Cart cart={cart} onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart} onEmptyCart={handleEmptyCart} />

              </Route>
              <Route exact path='/checkout'>
            <Checkout cart={cart} order={order} onCaptureCheckout={handleCaptureCheckout} error={errorMessage} />


              </Route>

          </Switch>
        </div>
      </Router>
    
  )
}

export default App