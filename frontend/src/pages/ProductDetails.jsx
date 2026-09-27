import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <main>
      <Link to="/">← Back to products</Link>

      <div className="product-details">
        <img src={product.image} alt={product.name} />

        <div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <h2>${product.price}</h2>
          <p>Category: {product.category}</p>
          <p>Stock: {product.stock}</p>

          <button>Add to Cart</button>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;