const mongoose = require("mongoose");
const { Schema } = mongoose;

const counterSchema = new Schema(
  {
    fieldName: { type: String, required: true, unique: true },
    sequenceValue: { type: Number, required: true, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

const counterModel = mongoose.model("Counter", counterSchema);

module.exports = counterModel;
