const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cors = require("cors");
const User = require("./models/user");
const Post = require("./models/post");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://sumitsahacse25:pustak@cluster0.u8uvop9.mongodb.net/",
    {}
  )
  .then(() => {
    console.log("MongoDB connected on port: 3000");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

function isValidZIP(zipCode) {
  const zipRegex = /^\d{6}$/;
  return zipRegex.test(zipCode);
}

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, zipcode } = req.body;

    if (!isValidZIP(zipcode)) {
      return res.status(404).json({ message: "Invalid ZIP code" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      zipcode,
      verificationToken: crypto.randomBytes(20).toString("hex"),
    });

    // newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    await newUser.save();
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    return res.status(201).json({
      message: "User registered successfully,please check your email to verify",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sumitsaha74500@gmail.com",
      pass: "nnbfeixvwsedcfnn",
    },
  });

  const mailOptions = {
    from: "PustakParivaar.com",
    to: email,
    subject: "Email Verification",
    text: `please click the following link to verify your email http://localhost:3000/verify/${verificationToken}`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log("error sending email", err);
  }
};

app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("error getting token", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }

    if (user.password !== password) {
      return res.status(404).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

app.post("/user-info", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decodedToken = jwt.decode(token);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("Error decoding token:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const userId = req.userId;
    const users = await User.find({ _id: { $ne: userId } });
    res.json(users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/update", async (req, res) => {
  try {
    const { name, zipcode, callingNumber, address, email } = req.body;
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (name !== undefined) {
      existingUser.name = name;
    }

    if (zipcode !== undefined) {
      existingUser.zipcode = zipcode;
    }

    if (callingNumber !== undefined) {
      existingUser.callingNumber = callingNumber;
    }

    if (address !== undefined) {
      existingUser.address = address;
    }

    await existingUser.save();

    res.json({ message: "User details updated successfully" });
  } catch (error) {
    console.log("Error during update", error);
    res.status(500).json({ message: "Update failed" });
  }
});

const isValidPincode = (pincode) => /^\d{6}$/.test(pincode);
const isValidCallingNumber = (callingNumber) => /^\d{10}$/.test(callingNumber);

// app.post('/addpost', async (req, res) => {
//   try {
//     const { name,email, callingNumber, rentFare, roomSize, address, description,pincode } = req.body;

//     const newPost = new Post({
//       name,
//       email,
//       callingNumber,
//       rentFare,
//       roomSize,
//       pincode,
//       address,
//       description,
//     });

//     const savedPost = await newPost.save();

//     res.status(201).json({ message: 'Post added successfully', post: savedPost });
//   } catch (error) {
//     console.error('Error adding post:', error);
//     res.status(500).json({ error: 'Error adding post' });
//   }
// });

app.get("/getpost/:pincode", async (req, res) => {
  try {
    const { name, callingNumber, rentFare, roomSize, address, description } =
      req.query;
    const pincode = req.params.pincode; // Retrieve pincode from URL parameter

    const query = { pincode }; // Include pincode in the query object

    if (name) query.name = name;
    if (callingNumber) query.callingNumber = callingNumber;
    if (rentFare) query.rentFare = rentFare;
    if (roomSize) query.roomSize = roomSize;
    if (address) query.address = address;
    if (description) query.description = description;

    const posts = await Post.find(query);

    res.status(200).json({ message: "Posts fetched successfully", posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Error fetching posts" });
  }
});

app.get("/myposts/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    const posts = await Post.find({ email: userEmail });

    res.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deletepost/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    // Ensure that the post belongs to the authenticated user
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found or unauthorized" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dzrhp8ms2",
  api_key: "672694978266625",
  api_secret: "9f4OlMyD27kESUgHYWxYMqZbcsE",
});

app.post("/addpost", async (req, res) => {
  try {
    const {
      name,
      email,
      callingNumber,
      pincode,
      rentFare,
      roomSize,
      address,
      description,
      file,
    } = req.body;

    const { secure_url } = await cloudinary.uploader.upload(file, {
      upload_preset: "chat-app-vs",
    });

    const newPost = new Post({
      name,
      email,
      callingNumber,
      pincode,
      rentFare,
      roomSize,
      address,
      description,
      imageUrl: secure_url,
    });

    console.log(newPost);
    const savedPost = await newPost.save();

    res
      .status(201)
      .json({ message: "Post added successfully", post: savedPost });
  } catch (error) {
    console.error("Error adding post:", error);
    res.status(500).json({ error: "Error adding post" });
  }
});




app.listen(port, () => {
  console.log("Server connected on port 3000");
});
