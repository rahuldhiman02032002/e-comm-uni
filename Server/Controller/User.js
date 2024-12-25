import CityModel from "../Models/City.js";
import CountryModel from "../Models/Country.js";
import StateModel from "../Models/State.js";
import UserModel from "../Models/User.js";
import router from "./Location.js";
import bcrypt from "bcryptjs";




router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    phone,
    gender,
    email,
    password,
    countryId,
    stateId,
    cityId,
  } = req.body;

  try {
    // Check for existing email
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    // Validate foreign keys
    const validCountry = await CountryModel.findById(countryId);
    if (!validCountry) {
      return res.status(400).json({ error: "Invalid country ID" });
    }

    const validState = await StateModel.findById(stateId);
    if (!validState || validState.countryId.toString() !== countryId) {
      return res
        .status(400)
        .json({ error: "Invalid state ID for the selected country" });
    }

    const validCity = await CityModel.findById(cityId);
    if (!validCity || validCity.stateId.toString() !== stateId) {
      return res
        .status(400)
        .json({ error: "Invalid city ID for the selected state" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const user = new UserModel({
      firstName,
      lastName,
      address,
      phone,
      gender,
      email,
      password: hashedPassword, // Save hashed password
      countryId,
      stateId,
      cityId,
    });

    const savedUser = await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        name: `${savedUser.firstName} ${savedUser.lastName}`,
        email: savedUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error during registration" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Send success response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error during login" });
  }
});
router.post("/getuserdetails", async (req, res) => {
  const { userId } = req.query; // Use query params to fetch the user ID

  try {
    // Check if the user exists
    const user = await UserModel.findById(userId).populate(
      "countryId stateId cityId"
    ); // Populate country, state, and city info if needed
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the user details in response
    res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        country: user.countryId.name, // Assuming name is a field in the Country model
        state: user.stateId.name, // Assuming name is a field in the State model
        city: user.cityId.name, // Assuming name is a field in the City model
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user details" });
  }
});
//stripe 
router.post("/create-payment-intent", async (req, res) => {
  const { amount, userId, products, userDetails } = req.body;

  try {
    // 1. Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    // 2. Return client_secret to frontend
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });

    // Optional: Save payment intent ID if needed for tracking
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({ error: "Payment failed" });
  }
});

router.post("/confirm-order", async (req, res) => {
  const { userId, userDetails, products, totalAmount, transactionId } = req.body;

  try {
    // 1. Save OrderHeader
    const orderHeader = new OrderHeader({
      userId,
      fullName: userDetails.fullName,
      phoneNumber: userDetails.phone,
      address: userDetails.address,
      country: userDetails.country,
      state: userDetails.state,
      city: userDetails.city,
      totalAmount,
      transactionId,
    });

    const savedOrderHeader = await orderHeader.save();

    // 2. Save OrderDetails
    const orderDetails = products.map((product) => ({
      orderId: savedOrderHeader._id,
      productId: product.productId,
      quantity: product.quantity,
      price: product.price,
    }));

    await OrderDetail.insertMany(orderDetails);

    res.status(200).send({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).send({ error: "Failed to place order" });
  }
});


export default router;
