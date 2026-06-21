// backend/src/routes/favouriteRoutes.js
const express = require("express");
const router = express.Router();
const Favourite = require("../models/Favourite");
const { protect } = require("../middleware/authMiddleware");

// Get all favourites with proper population
router.get("/", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const { itemType } = req.query;

    // Build filter
    const filter = { user: req.user._id };
    if (itemType && ["mantra", "shloka", "shotram"].includes(itemType)) {
      filter.itemType = itemType;
    }

    // Get total count for pagination
    const total = await Favourite.countDocuments(filter);

    // ✅ Get favourites with dynamic population
    let favourites = await Favourite.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // ✅ Manually populate each item based on itemType
    const populatedFavourites = await Promise.all(
      favourites.map(async (fav) => {
        let itemData = null;
        try {
          let Model;
          if (fav.itemType === "mantra") {
            Model = require("../models/Mantra");
          } else if (fav.itemType === "shloka") {
            Model = require("../models/Shloka");
          } else if (fav.itemType === "shotram") {
            Model = require("../models/Shotram");
          }

          if (Model) {
            itemData = await Model.findById(fav.itemId).lean();
          }
        } catch (error) {
          console.error(`Error populating ${fav.itemType}:`, error);
        }

        return {
          ...fav,
          itemData: itemData || null,
          itemName: itemData?.name || "Unknown Item",
          itemSlug: itemData?.slug || "",
          itemCategory: itemData?.category || "",
        };
      }),
    );

    res.json({
      success: true,
      data: populatedFavourites,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching favourites:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch favourites",
      error: error.message,
    });
  }
});

// Get all favourite IDs for current user
router.get("/ids", protect, async (req, res) => {
  try {
    const favourites = await Favourite.find(
      { user: req.user._id },
      { itemId: 1, itemType: 1, _id: 0 },
    ).lean();

    res.json({
      success: true,
      data: favourites,
    });
  } catch (error) {
    console.error("Error fetching favourite IDs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch favourite IDs",
      error: error.message,
    });
  }
});

// Toggle favourite
router.post("/toggle", protect, async (req, res) => {
  try {
    const { itemId, itemType } = req.body;

    if (!itemId || !itemType) {
      return res.status(400).json({
        success: false,
        message: "itemId and itemType are required",
      });
    }

    if (!["mantra", "shloka", "shotram"].includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid itemType. Must be mantra, shloka, or shotram",
      });
    }

    // Check if favourite exists
    const existingFavourite = await Favourite.findOne({
      user: req.user._id,
      itemId,
      itemType,
    });

    let isFavourited = false;
    let message = "";

    if (existingFavourite) {
      await Favourite.deleteOne({ _id: existingFavourite._id });
      isFavourited = false;
      message = "Removed from favourites";
    } else {
      await Favourite.create({
        user: req.user._id,
        itemId,
        itemType,
      });
      isFavourited = true;
      message = "Added to favourites";
    }

    res.json({
      success: true,
      isFavourited,
      message,
    });
  } catch (error) {
    console.error("Error toggling favourite:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Favourite already exists",
        isFavourited: true,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to toggle favourite",
      error: error.message,
    });
  }
});

// Delete a specific favourite
router.delete("/:itemId", protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { itemType } = req.body;

    if (!itemType) {
      return res.status(400).json({
        success: false,
        message: "itemType is required",
      });
    }

    const result = await Favourite.deleteOne({
      user: req.user._id,
      itemId,
      itemType,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Favourite not found",
      });
    }

    res.json({
      success: true,
      message: "Removed from favourites",
    });
  } catch (error) {
    console.error("Error deleting favourite:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete favourite",
      error: error.message,
    });
  }
});

// Get favourite count
router.get("/count", protect, async (req, res) => {
  try {
    const count = await Favourite.countDocuments({ user: req.user._id });
    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error getting favourite count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get favourite count",
      error: error.message,
    });
  }
});

module.exports = router;
