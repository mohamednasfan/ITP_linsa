const Delivery = require("../Model/DeliveryModel");

// Get all deliveries
const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ message: "No deliveries found" });
    }
    return res.status(200).json({ deliveries });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get delivery by ID
const getDeliveryById = async (req, res) => {
  const id = req.params.id;

  try {
    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }
    return res.status(200).json({ delivery });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching delivery" });
  }
};

// Get delivery by Email
const getDeliveryByEmail = async (req, res) => {
  const email = req.params.email;

  try {
    const delivery = await Delivery.find({ email: email });
    if (!delivery || delivery.length === 0) {
      return res.status(404).json({ message: "No deliveries found for this email" });
    }
    return res.status(200).json({ delivery });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching delivery" });
  }
};

// Add a new delivery
const addDelivery = async (req, res) => {
  const {
    name,
    email,
    phone,
    province,
    district,
    city,
    streetAddress,
    postalCode,
    deliveryTimeSlot,
  } = req.body;

  try {
    const newDelivery = new Delivery({
      name,
      email,
      phone,
      province,
      district,
      city,
      streetAddress,
      postalCode,
      deliveryTimeSlot,
    });

    await newDelivery.save();
    return res.status(201).json({ delivery: newDelivery });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Unable to add delivery" });
  }
};

// Update delivery by ID
const updateDelivery = async (req, res) => {
  const id = req.params.id;
  const {
    name,
    email,
    phone,
    province,
    district,
    city,
    streetAddress,
    postalCode,
    deliveryTimeSlot,
    status
  } = req.body;

  try {
    const delivery = await Delivery.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        province,
        district,
        city,
        streetAddress,
        postalCode,
        deliveryTimeSlot,
        status
      },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ message: "Unable to update delivery" });
    }

    return res.status(200).json({ delivery });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete delivery by ID
const deleteDelivery = async (req, res) => {
  const id = req.params.id;

  try {
    const delivery = await Delivery.findByIdAndDelete(id);
    if (!delivery) {
      return res.status(404).json({ message: "Unable to delete delivery" });
    }
    return res.status(200).json({ message: "Delivery deleted", delivery });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllDeliveries,
  getDeliveryById,
  getDeliveryByEmail,
  addDelivery,
  updateDelivery,
  deleteDelivery,
};
