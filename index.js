
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 5000;

// Middleware configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://dinewise-client-side.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());


// MongoDB connection URI with credentials from .env
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hiz8ocw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoDB client with options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Main async function to connect to MongoDB and handle routes
async function run() {
  try {
    // Connect to MongoDB server (optional since driver can auto-connect)
    // await client.connect();

    // Define collections from the database
    const menuCollection = client.db("bistroDb").collection("menu");
    const reviewsCollection = client.db("bistroDb").collection("reviews");
    const cartCollection = client.db("bistroDb").collection("cart");
    const usersCollection = client.db("bistroDb").collection("users");
    const paymentsCollection = client.db("bistroDb").collection("payments");

    // Middleware to verify JWT token
    const verifyToken = (req, res, next) => {
      //console.log(req.headers); // Log headers for debugging
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "unauthorized access" }); // No token provided
      }
      const token = req.headers.authorization.split(" ")[1]; // Get token after 'Bearer'
      //console.log(token); // Log token for debugging
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "unauthorized access" }); // Invalid token
        }
        req.decoded = decoded; // Attach decoded user info to request
        next(); // Proceed to next middleware
      });
    };

    // Middleware to verify if the user is an admin
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email; // Get email from decoded token
      const query = { email: email };
      const user = await usersCollection.findOne(query); // Find user in DB
      const admin = user?.role === "admin"; // Check if user is admin
      if (!admin) {
        return res.status(403).send({ message: "forbidden access" }); // Not an admin
      }
      next(); // Proceed to next middleware
    };

    // JWT token generation route
    app.post("/jwt", async (req, res) => {
      const user = req.body; // Get user data from request body
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      }); // Generate token
      res.send({ token }); // Send token to client
    });

    // Check if user is admin by email
    app.get("/users/admin/:email", verifyToken, async (req, res) => {
      const email = req.params.email; // Get email from route param
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "forbidden access" }); // User email mismatch
      }
      const user = await usersCollection.findOne({ email }); // Find user by email
      const admin = user?.role === "admin"; // Check admin status
      res.send({ admin }); // Send admin status as object
    });

    // Get all menu items
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray(); // Fetch all menu
      res.send(result);
    });
    // post menu
    app.post("/menu", verifyToken, verifyAdmin, async (req, res) => {
      const menu = req.body;
      const result = await menuCollection.insertOne(menu);
      res.send(result);
    });

    // Get all reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray(); // Fetch all reviews
      res.send(result);
    });

    // Get cart items by email (query parameter)
    app.get("/cart", async (req, res) => {
      const email = req.query.email; // Get email from query
      //console.log(email); // Log for debugging
      const query = { email: email };
      //console.log(query); // Log query object
      const result = await cartCollection.find(query).toArray(); // Fetch cart items
      res.send(result);
    });

    // Delete a cart item by ID
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id; // Get id from route
      //console.log(id); // Log for debugging
      const query = { _id: new ObjectId(id) }; // Create query object
      const result = await cartCollection.deleteOne(query); // Delete item
      res.send(result);
    });

    // Add an item to the cart
    app.post("/cart", async (req, res) => {
      const cart = req.body; // Get cart item data
      const result = await cartCollection.insertOne(cart); // Insert into collection
      res.send(result);
    });

    // Create a new user (register)
    app.post("/user", async (req, res) => {
      const user = req.body; // Get user data
      const { email } = user; // Destructure email
      try {
        const isExists = await usersCollection.findOne({ email: email }); // Check if user exists
        //console.log(isExists); // Log result
        if (isExists) {
          return res.status(400).send({ message: "user already exists" }); // Return error if exists
        }
        const result = await usersCollection.insertOne(user); // Insert new user
        res.send(result);
      } catch {
        res.status(403).send({ message: "something went wrong" }); // Handle errors
      }
    });

    // Get all users (admin access required)
    app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
      //console.log(req.decoded); // Log decoded user
      const result = await usersCollection.find().toArray(); // Fetch all users
      res.send(result);
    });

    // Make a user an admin by ID
    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id; // Get user ID
      //console.log(id); // Log ID
      const query = { _id: new ObjectId(id) }; // Create query
      const updatedDoc = {
        $set: {
          role: "admin", // Set role to admin
        },
      };
      const result = await usersCollection.updateOne(query, updatedDoc); // Update user
      res.send(result);
    });

    // Delete a user by ID
    app.delete("/users/admin/:id", async (req, res) => {
      const id = req.params.id; // Get user ID
      //console.log(id); // Log ID
      const query = { _id: new ObjectId(id) }; // Create query
      const result = await usersCollection.deleteOne(query); // Delete user
      res.send(result);
    });

    // payment intent

    app.post("/create-payment-intent", verifyToken, async (req, res) => {
      try {
        const { price } = req.body;
        const amount = Math.round(price * 100);
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: "usd",
          payment_method_types: ["card"],
        });
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        console.error("Stripe error:", error.message);
        res.status(500).send({ error: "Payment initiation failed" });
      }
    });

    // after payment done
    app.post("/payment", verifyToken, async (req, res) => {
      const paymentInfo = req.body
      //console.log(paymentInfo);
      const result = await paymentsCollection.insertOne(paymentInfo)
      res.send(result)
    })
    //get all payments
    app.get("/allPayments", verifyToken, verifyAdmin, async (req, res) => {
      const result = await paymentsCollection.find().toArray()
      res.send(result)
    })


    // Ping MongoDB to check connection (commented)
    // await client.db("admin").command({ ping: 1 });
    //console.log(
    "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Close MongoDB client if desired (commented)
    // await client.close();
  }
}
run().catch(console.dir); // Run the main function and catch errors

// Default route for testing server
app.get("/", (req, res) => {
  res.send("server running successfully");
});

// Start the server with port
app.listen(port, () => {
  //console.log("server is running on port :", port);
});
