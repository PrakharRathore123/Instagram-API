const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");


//Follow to other user

router.put("/:id/follow", async (req, res) => {            
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("Start Following");
      } else {
        res.status(403).json("You have already followed");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Not permitted");
  }
});

//unfollow an user which you have followed

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("You unfollowed this user");
        } else {
          res.status(403).json("You are not following this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("Not permitted");
    }
  });

module.exports = router;