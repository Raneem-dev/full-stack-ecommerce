import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to view your orders.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main>
        <p>Loading orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h2>Order History</h2>
        <p>{error}</p>
        <Link to="/login">Login</Link>
      </main>
    );
  }

  return (
    <main>
      <h2>Order History</h2>

      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <h3>Order #{order._id.slice(-6)}</h3>

              <p>
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <p>Status: {order.status}</p>

              {order.items.map((item) => (
                <p key={item._id}>
                  {item.name} × {item.quantity} — $
                  {(item.price * item.quantity).toFixed(2)}
                </p>
              ))}

              <strong>
                Total: ${order.totalPrice.toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default OrderHistory;