import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPayment = ({ cartItems }) => {
  const navigate = useNavigate();
  const [payment, setPayment] = useState({
    amount: 0,
    currency: "LKR",
    cardNumber: "",
    cardExpiry: "",
    cvv: "",
    status: "pending",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const totalAmount = cartItems.reduce(
        (acc, item) => acc + parseFloat(item.total),
        0
      );
      setPayment((prevPayment) => ({
        ...prevPayment,
        amount: totalAmount,
      }));
    }
  }, [cartItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prevPayment) => ({
      ...prevPayment,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for card number
    if (!/^\d{16}$/.test(payment.cardNumber)) {
      setError("Card number must be 16 digits.");
      return;
    }

    // Validation for CVV
    if (!/^\d{3}$/.test(payment.cvv)) {
      setError("CVV must be 3 digits.");
      return;
    }

    // Validation for card expiry date
    const expiryDate = new Date(payment.cardExpiry);
    const today = new Date();
    if (expiryDate <= today) {
      setError("Card expiry date must be in the future.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/payments/", payment);
      setLoading(false);
      alert("Payment added successfully.");
      navigate("/adddlilivey");
    } catch (error) {
      console.error("Error adding payment:", error);
      setError(error.response?.data?.message || "Server error");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading_spinner">
        <div className="spinner"></div>
        <p className="loading_text">Processing payment...</p>
      </div>
    );
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div className="payment-container">
        <h1 className="topic_mash_mart">
          Add<span className="sub_topic_mash_mart"> Payment</span>
        </h1>

        <div className="item_full_box">
          <form className="item_form_admin" onSubmit={handleSubmit}>
            <h2 className="form_title">Payment Information</h2>

            <div className="form_group">
              <input
                className="form_box_item_input"
                type="number"
                name="amount"
                value={payment.amount}
                readOnly
                placeholder="Amount"
              />
              <label className="form_box_item_lable">Amount</label>
            </div>

            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="currency"
                value={payment.currency}
                readOnly
                placeholder="Currency"
              />
              <label className="form_box_item_lable">Currency</label>
            </div>

            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="cardNumber"
                value={payment.cardNumber}
                onChange={handleChange}
                required
                placeholder="Card Number"
              />
              <label className="form_box_item_lable">Card Number</label>
            </div>

            <div className="form_group">
              <input
                className="form_box_item_input"
                type="date"
                name="cardExpiry"
                value={payment.cardExpiry}
                onChange={handleChange}
                required
                min={today} // Restrict to dates from today onward
                placeholder="Card Expiry"
              />
              <label className="form_box_item_lable">Card Expiry</label>
            </div>

            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="cvv"
                value={payment.cvv}
                onChange={handleChange}
                required
                placeholder="CVV"
              />
              <label className="form_box_item_lable">CVV</label>
            </div>

            {error && <div className="payment-error-message">{error}</div>}

            <button type="submit" className="admin_form_cneter_btn">
              Pay
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPayment;
