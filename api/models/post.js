// const mongoose = require("mongoose");

// const postSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: {
//     type: String,
//     required: true,
//   },
//   callingNumber: { type: String, required: true },
//   pincode: { type: Number, required: true },
//   rentFare: { type: Number, required: true },
//   roomSize: { type: String, required: true },
//   address: { type: String, required: true },
//   description: { type: String, required: true },
// });

// const Post = mongoose.model("Post", postSchema);

// module.exports = Post;

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  callingNumber: { type: String, required: true },
  pincode: { type: Number, required: true },
  rentFare: { type: Number, required: true },
  roomSize: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String } 
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;


