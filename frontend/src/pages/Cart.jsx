import { Link, useNavigate } from "react-router-dom";

function Cart({
    cart,
    setCart,
    addToCart,
    decreaseQuantity,
    removeFromCart
}) {
    const navigate = useNavigate();

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleCheckout = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const items = cart.map((item) => ({
            product: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }));

        try {
            const response = await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    items,
                    totalPrice: total
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data);
                return;
            }
            
            setCart([]);
            navigate("/orders");
        } catch (error) {
            console.error("Checkout failed:", error);
        }
    };

    if (cart.length === 0) {
        return (
            <main>
                <h2>Your Cart</h2>
                <p>Your cart is empty.</p>
                <Link to="/">Continue Shopping</Link>
            </main>
        );
    }

    return (
        <main>
            <h2>Your Cart</h2>

            <div className="cart-items">
                {cart.map((item) => (
                    <div className="cart-item" key={item._id}>
                        <div>
                            <h3>{item.name}</h3>
                            <p>${item.price}</p>
                            <div className="quantity-controls">
                                <button onClick={() => decreaseQuantity(item._id)}>
                                    −
                                </button>

                                <span>{item.quantity}</span>

                                <button onClick={() => addToCart(item)}>
                                    +
                                </button>
                            </div>

                            <button onClick={() => removeFromCart(item._id)}>
                                Remove
                            </button>
                        </div>

                        <p>
                            ${(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>

            <h3>Total: ${total.toFixed(2)}</h3>

            <button onClick={handleCheckout}>Checkout</button>
        </main>
    );
}

export default Cart;