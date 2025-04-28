import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AfterNav from "../../Home/NavBar/AfterNav";
import "./MyOrder.css";

function MyOrder() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get user email from localStorage/profile
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfileAndData = async () => {
      try {
        // Fetch user profile
        const token = localStorage.getItem("token");
        let userEmail = "";
        if (token) {
          const profileRes = await axios.post("http://localhost:5000/profile", { token });
          if (profileRes.data.status === "ok" && profileRes.data.user) {
            userEmail = profileRes.data.user.email;
            setEmail(userEmail);
          }
        }
        // Fetch cart items
        const cartRes = await axios.get("http://localhost:5000/carts/");
        setCartItems(cartRes.data.carts || []);
        let total = 0;
        (cartRes.data.carts || []).forEach((cart) => {
          total += parseFloat(cart.total);
        });
        setTotalAmount(total);
        // Fetch delivery details
        if (userEmail) {
          const deliveryRes = await axios.get(`http://localhost:5000/deliveri?gmail=${userEmail}`);
          if (deliveryRes.data.deliveries && deliveryRes.data.deliveries.length > 0) {
            // Use the latest delivery
            setDelivery(deliveryRes.data.deliveries[deliveryRes.data.deliveries.length - 1]);
          }
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch order details");
        setLoading(false);
      }
    };
    fetchProfileAndData();
  }, []);

  const formatAddress = (delivery) => {
    if (!delivery) return "------------------------------";
    const parts = [];
    if (delivery.streetAddress) parts.push(delivery.streetAddress);
    if (delivery.city) parts.push(delivery.city);
    if (delivery.district) parts.push(delivery.district);
    if (delivery.province) parts.push(delivery.province);
    if (delivery.postalCode) parts.push(delivery.postalCode);
    return parts.join(", ");
  };

  const handlePrint = () => {
    const printContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="text-align: center; margin-bottom: 20px;">Order Summary</h2>
        <div style="margin-bottom: 20px;">
          <h3>Items:</h3>
          <ul style="list-style: none; padding: 0;">
            ${cartItems.map(item => `
              <li style="margin-bottom: 10px;">
                ${item.name} (x${item.qty}) - Rs.${parseFloat(item.total).toFixed(2)}
              </li>
            `).join('')}
          </ul>
        </div>
        <div style="margin-bottom: 20px;">
          <h3>Total Amount: Rs.${totalAmount.toFixed(2)}</h3>
        </div>
        <div style="margin-bottom: 20px;">
          <h3>Delivery Address:</h3>
          <p>${formatAddress(delivery)}</p>
        </div>
        <div>
          <h3>Delivery Status: ${delivery ? (delivery.status || 'Not yet accepted') : 'Not yet accepted'}</h3>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Summary</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <AfterNav />
      <div className="myorder-main-container">
        <h2 className="myorder-title">Thank you for your order!</h2>
        <hr className="myorder-hr-main" />
        <div className="myorder-summary-header">Order Summary</div>
        <hr className="myorder-hr-sub" />
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="myorder-error">{error}</p>
        ) : (
          <div className="myorder-flex">
            {/* Left: Items */}
            <div className="myorder-items-card">
              <div className="myorder-items-title">Items</div>
              {cartItems.length === 0 ? (
                <div className="myorder-empty">No items in cart</div>
              ) : (
                <ul className="myorder-items-list">
                  {cartItems.map((item) => (
                    <li key={item._id} className="myorder-item">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="myorder-item-img" />
                      )}
                      <span className="myorder-item-desc">
                        {item.name} (x{item.qty}) - Rs.{parseFloat(item.total).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Right: Summary */}
            <div className="myorder-summary-col">
              <div className="myorder-summary-card">
                <div className="myorder-summary-title">Total Amount</div>
                <div className="myorder-summary-value">
                  Rs. {totalAmount.toFixed(2)}
                </div>
              </div>
              <div className="myorder-summary-card myorder-summary-card-address">
                <div className="myorder-summary-title">Delivery Address</div>
                <div className="myorder-address">
                  {delivery ? (
                    <>
                      {delivery?.streetAddress && (<span>{delivery.streetAddress}<br /></span>)}
                      {delivery?.city && (<span>{delivery.city}<br /></span>)}
                      {delivery?.district && (<span>{delivery.district}<br /></span>)}
                      {delivery?.province && (<span>{delivery.province}<br /></span>)}
                      {delivery?.postalCode && (<span>{delivery.postalCode}</span>)}
                    </>
                  ) : (
                    <span>------------------------------</span>
                  )}
                </div>
              </div>
              <div className="myorder-summary-card myorder-summary-card-status">
                <div className="myorder-summary-title">Delivery Status</div>
                <div className="myorder-status">{delivery ? (delivery.status || 'Not yet accepted') : 'Not yet accepted'}</div>
              </div>
            </div>
          </div>
        )}
        <button
          className="myorder-btn"
          onClick={() => navigate("/viewall")}
        >
          Continue Shopping
        </button>
        <button
          className="myorder-btn"
          onClick={handlePrint}
          style={{ marginTop: '10px' }}
        >
          Generate Report
        </button>
      </div>
    </div>
  );
}

export default MyOrder;