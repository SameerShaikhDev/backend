// controllers/favouriteController.js
const Favourite = require("../models/Favourite");
const mongoose = require("mongoose");

// Helper to resolve dynamic collections cleanly without altering base schemas
const getModelName = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1); // 'mantra' -> 'Mantra'
};

exports.toggleFavourite = async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const userId = req.user._id;

    if (!itemId || !itemType) {
      return res
        .status(400)
        .json({ success: false, message: "Missing parameters." });
    }

    const existingFav = await Favourite.findOne({
      user: userId,
      itemId,
      itemType,
    });

    if (existingFav) {
      await Favourite.deleteOne({ _id: existingFav._id });
      return res.status(200).json({
        success: true,
        isFavourited: false,
        message: "Removed from favourites successfully.",
      });
    } else {
      await Favourite.create({ user: userId, itemId, itemType });
      return res.status(201).json({
        success: true,
        isFavourited: true,
        message: "Added to favourites successfully.",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFavourites = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, itemType } = req.query;

    const query = { user: userId };
    if (itemType) {
      query.itemType = itemType;
    }

    const total = await Favourite.countDocuments(query);
    const rawFavs = await Favourite.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    // Group items by target collection type to perform batch fetches (highly optimized lookup)
    const itemsByType = {};
    rawFavs.forEach((fav) => {
      if (!itemsByType[fav.itemType]) itemsByType[fav.itemType] = [];
      itemsByType[fav.itemType].push(fav.itemId);
    });

    const populatedMap = {};
    for (const type of Object.keys(itemsByType)) {
      const modelName = getModelName(type);
      const TargetModel = mongoose.model(modelName);
      const targets = await TargetModel.find(
        { _id: { $in: itemsByType[type] } },
        "name category sanskrit text",
      ).lean();

      targets.forEach((doc) => {
        populatedMap[doc._id.toString()] = doc;
      });
    }

    // Merge entities back with original dynamic schema structures
    const data = rawFavs
      .map((fav) => ({
        ...fav,
        itemId: populatedMap[fav.itemId.toString()] || null,
      }))
      .filter((fav) => fav.itemId !== null); // Drop broken references cleanly

    res.status(200).json({
      success: true,
      data,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFavouriteIds = async (req, res) => {
  try {
    const userId = req.user._id;
    const favs = await Favourite.find(
      { user: userId },
      "itemId itemType",
    ).lean();

    res.status(200).json({
      success: true,
      data: favs.map((f) => ({ itemId: f.itemId, itemType: f.itemType })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFavourite = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { itemType } = req.body;

    if (!itemType) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Item type required in body context.",
        });
    }

    await Favourite.deleteOne({ user: userId, itemId, itemType });

    res.status(200).json({
      success: true,
      message: "Item dropped from your dashboard feeds.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
