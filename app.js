const express = require("express");
const cors = require("cors");
const app = express();

const MovieRoutes = require("./router/movie");
const authRoutes = require("./router/auth");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/movies", MovieRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(5000);
