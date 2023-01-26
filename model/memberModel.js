const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  members: [
    {
      memberId: {
        type: String,
        required: true,
      },
      memberName: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Members", memberSchema);
