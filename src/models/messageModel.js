const mongoose = require('mongoose')

const messageSchema = mongoose.Schema(
  {
    message: {
      text: {
        type: String,
        required: true,
      },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
  },
  { timeStaps: true },
)

module.exports = mongoose.model('Messages', messageSchema)
