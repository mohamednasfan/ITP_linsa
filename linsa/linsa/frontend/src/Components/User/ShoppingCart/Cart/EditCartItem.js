import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AfterNav from "../../Home/NavBar/AfterNav";

const EditCartItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState({
    name: "",
    image: "",
    price: "",
    code: "",
    qty: 1,
    total: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCartItem = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/carts/${id}`);
        setItem(response.data.cart);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart item:", error);
        setError("Failed to fetch cart item details");
        setLoading(false);
      }
    };

    fetchCartItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "qty") {
      const totalPrice = parseFloat(value) * parseFloat(item.price);
      setItem((prevState) => ({
        ...prevState,
        total: totalPrice.toFixed(2),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/carts/${id}`, item);
      setLoading(false);
      alert("Cart item updated successfully.");
      navigate("/view-cart");
    } catch (error) {
      console.error("Error updating cart item:", error);
      setError("Failed to update cart item");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading_spinner">
        <div className="spinner"></div>
        <p className="loading_text">Updating cart item...</p>
      </div>
    );
  }

  return (
    <div>
      <AfterNav />
      <div className="children_div_user">
        <h1 className="topic_mash_mart">
          Edit<span className="sub_topic_mash_mart"> Cart Item</span>
        </h1>

        <div className="item_full_box">
          <form className="item_form_admin" onSubmit={handleSubmit}>
            <h2 className="form_title">Cart Item Information</h2>

            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="name"
                value={item.name}
                onChange={handleChange}
                readOnly
                placeholder="Item Name"
              />
              <label className="form_box_item_lable">Item Name</label>
            </div>

            <div className="form_group">
              <input
                className="form_box_item_input"
                type="number"
                name="price"
                value={item.price}
                onChange={handleChange}
                readOnly
                placeholder="Price"
              />
              <label className="form_box_item_lable">Price</label>
            </div>

            <div className="form_group">
              <input
                className="form_box_item_input"
                type="number"
                name="qty"
                value={item.qty}
                onChange={handleChange}
                min="1"
                required
                placeholder="Quantity"
              />
              <label className="form_box_item_lable">Quantity</label>
            </div>

            <div className="form_group">
              <input
                className="form_box_item_input"
                type="text"
                name="total"
                value={item.total}
                readOnly
                placeholder="Total"
              />
              <label className="form_box_item_lable">Total</label>
            </div>

            {error && <div className="employee-error-message">{error}</div>}

            <button type="submit" className="admin_form_cneter_btn">
              Update Cart Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCartItem;
