import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);

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

  return (
  <div>
    <header>
      <h1>ShopEase</h1>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/login">Login</Link>
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

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />
    </Routes>
  </div>
  );
}

export default App;