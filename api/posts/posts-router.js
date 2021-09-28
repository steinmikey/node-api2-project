const express = require("express");
const Post = require("./posts-model");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: "The posts information could not be retrieved"
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist"
      });
    } else {
      res.status(200).json(post);
    }
  } catch (err) {
    res.status(500).json({
      message: "The post information could not be retrieved"
    });
  }
});

router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post"
    });
  } else {
    try {
      const newPost = await Post.insert(req.body);
      res.status(201).json({ id: newPost.id, ...req.body });
    } catch (err) {
      res.status(500).json({
        message: "There was an error while saving the post to the database"
      });
    }
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;
  const post = await Post.findById(id);
  if (!post) {
    res.status(404).json({
      message: "The post with the specified ID does not exist"
    });
  } else if (!title || !contents) {
    res.status(400).json({
      message: "Please provide title and contents for the post"
    });
  } else {
    try {
      await Post.update(id, req.body);
      res.status(200).json({ id: parseInt(id), ...req.body });
    } catch (err) {
      res.status(500).json({
        message: "The post information could not be modified"
      });
    }
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) {
    res.status(404).json({
      message: "The post with the specified ID does not exist"
    });
  } else {
    try {
      await Post.remove(id);
      res.status(200).json(post);
    } catch (err) {
      res.status(500).json({
        message: "The post could not be removed"
      });
    }
  }
});

module.exports = router;
