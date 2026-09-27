import { useEffect, useState } from "react";
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
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/cart">Cart</a>
          <a href="/login">Login</a>
        </nav>
      </header>

      <main>
        <h2>Our Products</h2>

        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <img
                src={product.image}
                alt={product.name}
                width="200"
              />

              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="product-price">${product.price}</p>
              <p>Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;