const mongoose = require('mongoose');
const reactionSchema = require('./Reaction'); 
const { Schema, model } = mongoose;

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (createdAtVal) => createdAtVal.toISOString(),
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema],
}, {
  toJSON: {
    virtuals: true,
    getters: true,
  },
  id: false,
});

// Virtual to get the count of reactions
thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;