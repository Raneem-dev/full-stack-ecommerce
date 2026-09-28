import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item._id === product._id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item._id !== productId)
    );
  };


  return (
    <div>
      <header>
        <h1>ShopEase</h1>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/">Products</Link>
          <Link to="/cart">Cart</Link>
          {user ? (
            <>
              <span>Hello, {user.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <main>
              <h2>Our Products</h2>

              <div className="products-grid">
                {products.map((product) => (
                  <div className="product-card" key={product._id}>
                    <img src={product.image} alt={product.name} />

                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p className="product-price">${product.price}</p>
                    <p>Stock: {product.stock}</p>

                    <Link to={`/products/${product._id}`}>
                      View Product
                    </Link>
                  </div>
                ))}
              </div>
            </main>
          }
        />

        <Route path="/products/:id" element={<ProductDetails addToCart={addToCart} />} />

        <Route path="/login" element={<Login setUser={setUser} />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
              addToCart={addToCart}
              decreaseQuantity={decreaseQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />

        <Route path="/orders" element={<OrderHistory />} />

      </Routes>
    </div>
  );
}

export default App;