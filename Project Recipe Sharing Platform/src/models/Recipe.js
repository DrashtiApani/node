const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title:
  {
    type: String,
    required: true
  },
  description:
  {
    type: String,
    required: true
  },
  ingredients:
  [{
    type: String,
    required: true
  }],
  image:
  {
    type: String
  },
  author:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cuisine:
  {
    type: String,
    default: 'Various'
  },
  cookingTime:
  {
    type: String
  }, 

  comments:
    [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }],
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
