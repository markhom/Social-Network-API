const { Thought, User } = require('../models');

const thoughtController = {
  // Get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v')
      .sort({ _id: -1 })
      .then(thoughtData => res.json(thoughtData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Get one thought by id
  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.id })
      .select('-__v')
      .then(thoughtData => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json(thoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Create a new thought and associate it with a user
  createThought(req, res) {
    Thought.create({
      thoughtText: req.body.thoughtText,
      username: req.body.username,
    })
    .then(thoughtData => {
      return User.findByIdAndUpdate(
        req.body.userId,
        { $push: { thoughts: thoughtData._id } },
        { new: true }
      );
    })
    .then(userData => {
      if (!userData) {
        return res.status(404).json({ message: 'Thought created, but no user found with provided userId' });
      }
      res.json({ message: 'Thought successfully created!', userData });
    })
    .catch(err => {
      console.log("Error in creating thought or updating user:", err);
      res.status(400).json(err);
    });
  },


  // Update a thought by id
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    )
    .then(thoughtData => {
      if (!thoughtData) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.json(thoughtData);
    })
    .catch(err => res.status(400).json(err));
  },

  // Delete a thought by id
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then(thoughtData => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'No thought found with this id!' });
        }
        res.json({ message: 'Thought successfully deleted!' });
      })
      .catch(err => res.status(400).json(err));
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    )
    .then(thoughtData => {
      if (!thoughtData) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.json(thoughtData);
    })
    .catch(err => res.status(400).json(err));
  },

  // Remove a reaction from a thought
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
    .then(thoughtData => {
      if (!thoughtData) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.json({ message: 'Reaction successfully removed!' });
    })
    .catch(err => res.status(400).json(err));
  }
};

module.exports = thoughtController;