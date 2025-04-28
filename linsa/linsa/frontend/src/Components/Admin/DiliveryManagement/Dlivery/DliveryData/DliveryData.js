import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Sidebar from "../../../AdminDashBord/SideBar/Sidebar";
import './DliveryData.css';

const URL = "http://localhost:5000/deliveri";
const DRIVER_URL = "http://localhost:5000/drive";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

const fetchDrivers = async () => {
  try {
    const response = await axios.get(DRIVER_URL);
    console.log("Fetched drivers:", response.data);
    return response.data.driv || [];
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return [];
  }
};

// Helper function to format location
const formatLocation = (delivery) => {
  const locationParts = [
    delivery.streetAddress,
    delivery.city,
    delivery.district,
    delivery.province,
    delivery.postalCode
  ].filter(Boolean);
  
  return locationParts.length > 0 
    ? locationParts.join(', ') 
    : "Address not available";
};

function DliveryData() {
  const [deliveries, setDelivery] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusBox, setSelectedStatusBox] = useState(null);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [driverNames, setDriverNames] = useState({});
  const [vehicleNames, setVehicleNames] = useState({});

  // Fetch vehicles
  useEffect(() => {
    axios.get('http://localhost:5000/vehical').then(res => {
      setVehicles(res.data.vehi || []);
      // Create a map of vehicle IDs to names
      const vehicleMap = {};
      res.data.vehi.forEach(vehicle => {
        vehicleMap[vehicle._id] = vehicle.name;
      });
      setVehicleNames(vehicleMap);
    });
  }, []);

  useEffect(() => {
    fetchHandler().then((data) => {
      const formattedData = data.deliveries.map(delivery => ({
        ...delivery,
        formattedLocation: formatLocation(delivery)
      }));
      setDelivery(formattedData);
    });

    const loadDrivers = async () => {
      const driversData = await fetchDrivers();
      if (driversData && Array.isArray(driversData)) {
        setDrivers(driversData);
        // Create a map of driver IDs to names
        const driverMap = {};
        driversData.forEach(driver => {
          driverMap[driver._id] = driver.name;
        });
        setDriverNames(driverMap);
      }
    };
    loadDrivers();
  }, []);

  // Filter deliveries based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = deliveries.filter(delivery => 
        delivery.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.phone.includes(searchQuery)
      );
      setFilteredDeliveries(filtered);
    } else {
      setFilteredDeliveries(deliveries);
    }
  }, [searchQuery, deliveries]);

  // Get the latest delivery (or null if none)
  const latestDelivery = deliveries.length > 0 ? deliveries[deliveries.length - 1] : null;

  // Status radio options
  const statusOptions = ['Processing', 'Delivered', 'Pending', 'Cancelled'];

  // Available drivers/vehicles
  const availableDrivers = drivers.filter(driver => {
    const status = (driver.status || 'available').toLowerCase();
    return status === 'available';
  });

  const availableVehicles = vehicles.filter(vehicle => {
    const status = (vehicle.status || 'available').toLowerCase();
    return status === 'available';
  });

  // Handle status box click
  const handleStatusBoxClick = (status) => {
    if (selectedStatusBox === status) {
      // If clicking the same status box again, hide the details
      setSelectedStatusBox(null);
      setFilteredDeliveries([]);
      setSelectedDelivery(null);
    } else {
      // If clicking a different status box, show those details
      setSelectedStatusBox(status);
      const filtered = deliveries.filter(delivery => 
        (delivery.status || 'Pending').toLowerCase() === status.toLowerCase()
      );
      setFilteredDeliveries(filtered);
      // Set the first delivery as selected by default
      if (filtered.length > 0) {
        setSelectedDelivery(filtered[0]);
      }
    }
  };

  // Update status handler
  const handleStatusUpdate = async (deliveryId) => {
    if (!selectedStatus) return;
    
    // Prevent changing status of Processing/Delivered deliveries to Pending
    if ((selectedDelivery.status === 'Processing' || selectedDelivery.status === 'Delivered') && 
        selectedStatus === 'Pending') {
      alert('Cannot change status back to Pending once Processing or Delivered');
      return;
    }

    try {
      await axios.put(`${URL}/${deliveryId}`, { status: selectedStatus });
      setDelivery(prev => prev.map(d => d._id === deliveryId ? { ...d, status: selectedStatus } : d));
      setSelectedDelivery(prev => prev ? { ...prev, status: selectedStatus } : null);
      alert('Status updated!');
    } catch (e) {
      alert('Failed to update status');
    }
  };

  // Assign handler
  const handleAssign = async () => {
    if (!selectedDelivery || !selectedDriver || !selectedVehicle) return;
    
    // Check if delivery is already in Processing or Delivered status
    if (selectedDelivery.status === 'Processing' || selectedDelivery.status === 'Delivered') {
      alert('This delivery already has an assigned driver and vehicle');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/drive/${selectedDriver}`, { status: 'busy' });
      await axios.put(`http://localhost:5000/vehical/${selectedVehicle}`, { status: 'busy' });
      await axios.put(`${URL}/${selectedDelivery._id}`, { 
        assignedDriver: selectedDriver, 
        assignedVehicle: selectedVehicle,
        status: 'Processing' 
      });
      setDelivery(prev => prev.map(d => d._id === selectedDelivery._id ? { 
        ...d, 
        assignedDriver: selectedDriver,
        assignedVehicle: selectedVehicle,
        status: 'Processing'
      } : d));
      setSelectedDelivery(prev => prev ? { 
        ...prev, 
        assignedDriver: selectedDriver,
        assignedVehicle: selectedVehicle,
        status: 'Processing'
      } : null);
      alert('Assigned successfully!');
      setSelectedDriver('');
      setSelectedVehicle('');
    } catch (e) {
      alert('Failed to assign');
    }
  };

  // Count deliveries by status
  const statusCounts = deliveries.reduce(
    (acc, curr) => {
      const status = (curr.status || 'Pending').toLowerCase();
      if (status === 'pending') acc.pending++;
      else if (status === 'processing') acc.processing++;
      else if (status === 'delivered') acc.delivered++;
      else if (status === 'cancelled') acc.cancelled++;
      return acc;
    },
    { pending: 0, processing: 0, delivered: 0, cancelled: 0 }
  );

  return (
    <div>
      <Sidebar />
      <div className="children_div_admin">
        <div className="dash_button_set">
          <div className="search-group">
            <input
              type="text"
              name="search"
              className="serch_inpt"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="action-group">
            <button className="btn_dash_admin" onClick={() => (window.location.href = "/driverdetails")}>Driver</button>
            <button className="btn_dash_admin gsp" onClick={() => (window.location.href = "/vehicaldetails")}>Vehicle</button>
          </div>
        </div>
        <div className="status-summary-container">
          <div 
            className={`status-summary-box pending ${selectedStatusBox === 'pending' ? 'selected' : ''}`}
            onClick={() => handleStatusBoxClick('pending')}
          >
            <div className="status-icon">🕒</div>
            <div className="status-label">Pending</div>
            <div className="status-count">{statusCounts.pending}</div>
          </div>
          <div 
            className={`status-summary-box processing ${selectedStatusBox === 'processing' ? 'selected' : ''}`}
            onClick={() => handleStatusBoxClick('processing')}
          >
            <div className="status-icon">🚚</div>
            <div className="status-label">Processing</div>
            <div className="status-count">{statusCounts.processing}</div>
          </div>
          <div 
            className={`status-summary-box delivered ${selectedStatusBox === 'delivered' ? 'selected' : ''}`}
            onClick={() => handleStatusBoxClick('delivered')}
          >
            <div className="status-icon">✅</div>
            <div className="status-label">Delivered</div>
            <div className="status-count">{statusCounts.delivered}</div>
          </div>
          <div 
            className={`status-summary-box cancelled ${selectedStatusBox === 'cancelled' ? 'selected' : ''}`}
            onClick={() => handleStatusBoxClick('cancelled')}
          >
            <div className="status-icon">❌</div>
            <div className="status-label">Cancelled</div>
            <div className="status-count">{statusCounts.cancelled}</div>
          </div>
        </div>

        {/* Filtered Deliveries List */}
        {selectedStatusBox && (
          <div className="filtered-deliveries-container">
            <h2>{selectedStatusBox.charAt(0).toUpperCase() + selectedStatusBox.slice(1)} Deliveries</h2>
            <div className="deliveries-list">
              {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map(delivery => (
                  <div 
                    key={delivery._id} 
                    className={`delivery-item ${selectedDelivery?._id === delivery._id ? 'selected' : ''}`}
                    onClick={() => setSelectedDelivery(delivery)}
                  >
                    <div className="delivery-info">
                      <h3>{delivery.name}</h3>
                      <p><strong>Email:</strong> {delivery.email}</p>
                      <p><strong>Phone:</strong> {delivery.phone}</p>
                      <p><strong>Address:</strong> {delivery.formattedLocation}</p>
                      <p><strong>Time Slot:</strong> {delivery.deliveryTimeSlot}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-deliveries">No {selectedStatusBox} deliveries found</div>
              )}
            </div>
          </div>
        )}

        {/* Main two-column layout */}
        <div className="delivery-main-container">
          <div className="delivery-left">
            <div className="customer-details-box">
              <h2>Customer Details</h2>
              {selectedDelivery ? (
                <table className="customer-details-table">
                  <tbody>
                    <tr><td>Name:</td><td>{selectedDelivery.name}</td></tr>
                    <tr><td>Email:</td><td>{selectedDelivery.email}</td></tr>
                    <tr><td>Phone Number:</td><td>{selectedDelivery.phone}</td></tr>
                    <tr><td>Address:</td><td>{selectedDelivery.formattedLocation}</td></tr>
                    <tr><td>Preferred Time Slot:</td><td>{selectedDelivery.deliveryTimeSlot}</td></tr>
                    {(selectedDelivery.status === 'Processing' || selectedDelivery.status === 'Delivered') && (
                      <>
                        <tr>
                          <td>Assigned Driver:</td>
                          <td>{(() => {
                            const d = drivers.find(driver => driver.email === selectedDelivery.assignedDriver || driver.name === selectedDelivery.assignedDriver);
                            return d ? d.name : 'N/A';
                          })()}</td>
                        </tr>
                        <tr>
                          <td>Assigned Vehicle:</td>
                          <td>{(() => {
                            const v = vehicles.find(vehicle => vehicle.name === selectedDelivery.assignedVehicle || vehicle.email === selectedDelivery.assignedVehicle);
                            return v ? v.name : 'N/A';
                          })()}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              ) : <div>No delivery selected.</div>}
            </div>
            {selectedDelivery && (selectedDelivery.status === 'Pending' || selectedDelivery.status === 'Cancelled' || selectedDelivery.status === 'Processing') && (
              <div className="status-box">
                <h2>Status</h2>
                <form>
                  {statusOptions.map(option => (
                    <div key={option} className="status-radio">
                      <input
                        type="radio"
                        id={option}
                        name="status"
                        value={option}
                        checked={selectedStatus === option || (selectedDelivery && selectedDelivery.status === option && !selectedStatus)}
                        onChange={e => setSelectedStatus(e.target.value)}
                      />
                      <label htmlFor={option}>{option}</label>
                    </div>
                  ))}
                </form>
                <button 
                  className="btn_dash_admin" 
                  onClick={() => selectedDelivery && handleStatusUpdate(selectedDelivery._id)} 
                  type="button"
                  disabled={!selectedDelivery}
                >
                  Update
                </button>
              </div>
            )}
          </div>
          <div className="delivery-right">
            <div className="delivery-box">
              <h2>Delivery</h2>
              <div className="available-resources">
                {selectedDelivery && (selectedDelivery.status === 'Pending' || selectedDelivery.status === 'Cancelled') && (
                  <>
                    <div className="available-section">
                      <h3>Available Drivers</h3>
                      <div className="resource-list">
                        {availableDrivers.length > 0 ? (
                          availableDrivers.map(driver => (
                            <div 
                              key={driver._id} 
                              className="resource-item"
                              onClick={() => setSelectedDriver(driver._id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="resource-info">
                                <span className="resource-name">{driver.name}</span>
                                <span className="resource-contact">{driver.phone}</span>
                              </div>
                              <input
                                type="radio"
                                name="selectedDriver"
                                checked={selectedDriver === driver._id}
                                onChange={() => setSelectedDriver(driver._id)}
                              />
                            </div>
                          ))
                        ) : (
                          <div className="no-resources">No available drivers</div>
                        )}
                      </div>
                    </div>

                    <div className="available-section">
                      <h3>Available Vehicles</h3>
                      <div className="resource-list">
                        {availableVehicles.length > 0 ? (
                          availableVehicles.map(vehicle => (
                            <div 
                              key={vehicle._id} 
                              className="resource-item"
                              onClick={() => setSelectedVehicle(vehicle._id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="resource-info">
                                <span className="resource-name">{vehicle.name}</span>
                                <span className="resource-details">{vehicle.numberplate}</span>
                              </div>
                              <input
                                type="radio"
                                name="selectedVehicle"
                                checked={selectedVehicle === vehicle._id}
                                onChange={() => setSelectedVehicle(vehicle._id)}
                              />
                            </div>
                          ))
                        ) : (
                          <div className="no-resources">No available vehicles</div>
                        )}
                      </div>
                    </div>
                    <button className="btn_dash_admin assign-btn" onClick={handleAssign} type="button">Assign</button>
                  </>
                )}
                {selectedDelivery && (selectedDelivery.status === 'Processing' || selectedDelivery.status === 'Delivered') && (
                  <div className="assigned-info">
                    <h3>Delivery Information</h3>
                    <p>Driver: {(() => {
                      const d = drivers.find(driver => driver.email === selectedDelivery.assignedDriver || driver.name === selectedDelivery.assignedDriver);
                      return d ? d.name : 'N/A';
                    })()}</p>
                    <p>Vehicle: {(() => {
                      const v = vehicles.find(vehicle => vehicle.name === selectedDelivery.assignedVehicle || vehicle.email === selectedDelivery.assignedVehicle);
                      return v ? v.name : 'N/A';
                    })()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DliveryData;