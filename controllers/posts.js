const { request } = require("express");
const Post = require("../models/Post");
const nodemailer = require("nodemailer")
const { mainMail } = require("../middleware/nodemailer")
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts, user: req.user._id });
    } catch (err) {
      console.log(err);
    }
  },
  getHow: async (req, res) => {
    try {
      res.render("howitworks.ejs", {user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  searchPost: async (req, res) => {
    if(req.query.search === ""){
      console.log("input is empty")
    } else {
    Post.find({zip:req.query.search})
    .then(data => {
      console.log(data);
      res.render("feed.ejs", { posts: data, user: req.user});
    })
    .catch(err => {
      console.log(err);
        res.json({
            confirmation: 'fail',
            message: err.message
        })
    })
  }
  },
  createPost: async (req, res) => {
    try {
      await Post.create({
        title: req.body.title,
        caption: req.body.caption,
        zip: req.body.zip,
        split: req.body.split,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  postContact: async (req, res, next) => {
    const { yourname, youremail, yourmessage, postemail } = req.body;
    const postUser = await User.findById({ _id: postemail });
    console.log(postUser.email)
    const posterEmail = postUser.email
    try {
      await mainMail(yourname, youremail, yourmessage, posterEmail);
      res.send("Message sent successfully!");
    } catch (error) {
      res.send("Message could not be sent.");
      console.log(error)
    }
},
};
