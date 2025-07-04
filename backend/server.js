import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 9000;
const citiesFile = path.join(__dirname, "data", "cities.json");

app.use(cors());
app.use(express.json());

// GET all cities
app.get("/cities", (req, res) => {
  const raw = fs.readFileSync(citiesFile);
  const { cities } = JSON.parse(raw);
  res.json(cities);
});

// GET city by ID
app.get("/cities/:id", (req, res) => {
  const raw = fs.readFileSync(citiesFile);
  const { cities } = JSON.parse(raw);
  const city = cities.find((c) => c.id === Number(req.params.id));
  city ? res.json(city) : res.status(404).json({ error: "City not found" });
});

// POST a new city
app.post("/cities", (req, res) => {
  const newCity = req.body;

  const raw = fs.readFileSync(citiesFile);
  const data = JSON.parse(raw);
  data.cities.push(newCity);

  fs.writeFileSync(citiesFile, JSON.stringify(data, null, 2));
  res.status(201).json(newCity);
});

// DELETE city by ID
app.delete("/cities/:id", (req, res) => {
  const raw = fs.readFileSync(citiesFile);
  const data = JSON.parse(raw);

  data.cities = data.cities.filter((c) => c.id !== Number(req.params.id));
  fs.writeFileSync(citiesFile, JSON.stringify(data, null, 2));
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
