import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Stock.css";
import AfterNav from "../../Home/NavBar/AfterNav";
import { FaSearch, FaFilter, FaSort } from "react-icons/fa";

const Product = ({ product }) => {
  const { _id, name, image, location, price, code } = product;

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img className="product-image" src={image} alt={name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <div className="product-details">
          <p className="product-detail"><span>Location:</span> {location}</p>
          <p className="product-detail"><span>Price:</span> Rs.{price}.00</p>
          <p className="product-detail"><span>Code:</span> {code}</p>
        </div>
        <Link className="btn-primary" to={`/viewoneproduct/${_id}`}>
          View Details
        </Link>
      </div>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [locationFilter, setLocationFilter] = useState("all");
  
  // Get unique locations for filter
  const locations = [...new Set(products.map(product => product.location))];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/products");
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setAlertMessage("Error fetching product items.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter and sort products
    let result = [...products];
    
    // Apply search
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply location filter
    if (locationFilter !== "all") {
      result = result.filter(product => product.location === locationFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        comparison = a.price - b.price;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
    
    setFilteredProducts(result);
  }, [products, searchTerm, sortBy, sortOrder, locationFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="products-page">
      <AfterNav />
      <div className="products-container">
        <h1 className="products-title">
          Product <span>List</span>
        </h1>
        
        {alertMessage && <div className="alert-message">{alertMessage}</div>}
        
        <div className="filter-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="filter-options">
            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select 
                value={locationFilter} 
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="all">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <FaSort className="filter-icon" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
              </select>
              <button className="sort-direction" onClick={toggleSortOrder}>
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">No products found matching your criteria</div>
        )}
      </div>
    </div>
  );
};

export default Products;
