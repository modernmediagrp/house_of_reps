const mongoose = require('mongoose')

const { Schema } = mongoose

const ChatRoomSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  moderators: [
    {
      name: {
        type: String
      },
      id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      handle: {
        type: String
      }
    }
  ],
  invites: [
    {
      name: {
        type: String
      },
      id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      handle: {
        type: String
      }
    }
  ],
  members: [
    {
      name: {
        type: String
      },
      id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      handle: {
        type: String
      }
    }
  ],
  messages: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      handle: {
        type: String
      },
      avatar: {
        type: String
      },
    }
  ]
}, {
  timestamps: true
})

module.exports = mongoose.model('chatroom', ChatRoomSchema)