const { mongoose } = require("mongoose");
const router = require("express").Router();
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const { Assets } = require("../models/Assets");
const { uploadImage, deleteImage } = require("../utils/s3");

const { ObjectId } = mongoose.Types;
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", authMiddleware, async (req, res) => {
  try {
    const data = await Assets.find();
    return res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const response = await uploadImage(file);
    let { fileName } = response;

    let asset = new Assets({
      userId: req.user._id,
      url: fileName,
    });

    await asset.save();
    return res.json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const asset = await Assets.findById(id);
    if (!asset) return res.status(404).json({ message: "Resource not found" });
    const filename = asset.url;
    await deleteImage(filename);

    const isValidObjectId = ObjectId.isValid(id);

    if (isValidObjectId) {
      await Assets.findByIdAndDelete(id);
      return res.json({ message: "Deleted successfully" });
    } else {
      throw new Error("Invalid ID");
    }

    // Assets.deleteOne({ _id: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    const asset = await Assets.findById(id);

    if (!asset) {
      return res.status(404).send("Asset not found");
    }

    // Delete the existing image from S3
    if (asset.url) {
      deleteImage(asset.url);
    }

    // Upload the new image to S3
    console.log(req.file);
    const response = await uploadImage(req.file);
    let { fileName } = response;

    // Update the URL of the asset in the database
    asset.url = fileName;
    await asset.save();

    res.send("Image updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
