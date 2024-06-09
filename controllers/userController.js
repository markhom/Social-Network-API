const User = require('../models/User');

const userController = {
  // Get all users
  getAllUsers(req, res) {
    User.find({})
      .select('-__v')  
      .sort({ _id: -1 })  
      .then(userData => {
        res.json(userData);
      })
      .catch(err => {
        console.log("Error fetching users with populated data:", err);
        res.status(500).json(err);
      });
  },

  // Get one user by ID
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate('thoughts')
      .populate('friends')
      .select('-__v')
      .then(userData => {
        if (!userData) {
          res.status(404).json({ message: 'No user found with this ID!' });
          return;
        }
        res.json(userData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Create a new user
  createUser({ body }, res) {
    User.create(body)
      .then(userData => res.json(userData))
      .catch(err => res.json(err));
  },

  // Update a user by ID
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(userData => {
        if (!userData) {
          res.status(404).json({ message: 'No user found with this ID!' });
          return;
        }
        res.json(userData);
      })
      .catch(err => res.json(err));
  },

  // Delete a user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(userData => {
        if (!userData) {
          res.status(404).json({ message: 'No user found with this ID!' });
          return;
        }
        res.json({ message: 'User successfully deleted!' });
        // Bonus: Delete the user's thoughts here if you wish
      })
      .catch(err => res.status(400).json(err));
  },

  // Add a friend to a user's friend list
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $addToSet: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
    .populate({
      path: 'friends',
      select: '-__v'
    })
    .select('-__v')
    .then(userData => {
      if (!userData) {
        res.status(404).json({ message: 'No user found with this ID!' });
        return;
      }
      res.json(userData);
    })
    .catch(err => res.json(err));
  },

  // Remove a friend from a user's friend list
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
    .then(userData => {
      if (!userData) {
        res.status(404).json({ message: 'No user found with this ID!' });
        return;
      }
      res.json({ message: 'Friend removed successfully!' });
    })
    .catch(err => res.json(err));
  }
};

module.exports = userController;