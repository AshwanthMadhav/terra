const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const assetsRoutes = require("./routes/assets");

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetsRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
