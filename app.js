const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/user");
const fgsAlertRoutes = require("./routes/fgsAlert");
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", fgsAlertRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
