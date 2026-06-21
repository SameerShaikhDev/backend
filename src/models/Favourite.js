const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  itemType: {
    type: String,
    enum: ["mantra", "shloka", "shotram"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index to prevent duplicates
favouriteSchema.index({ user: 1, itemId: 1, itemType: 1 }, { unique: true });

// Ensure we don't have duplicate favourites for the same user and item
favouriteSchema.pre("save", async function (next) {
  const existing = await mongoose.models.Favourite.findOne({
    user: this.user,
    itemId: this.itemId,
    itemType: this.itemType,
  });

  if (existing) {
    const error = new Error("Favourite already exists");
    error.status = 409;
    return next(error);
  }
  next();
});

module.exports = mongoose.model("Favourite", favouriteSchema);
