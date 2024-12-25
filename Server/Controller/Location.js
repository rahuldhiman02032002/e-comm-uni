import express from "express";
import CountryModel from "../Models/Country.js";
import StateModel from "../Models/State.js";
import CityModel from "../Models/City.js";

const router = express.Router();

// GET API - Fetch all countries
router.get("/countries", async (req, res) => {
  try {
    const countries = await CountryModel.find({});
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: "Error fetching countries" });
  }
});

// POST API - Add a new country
router.post("/countries", async (req, res) => {
  try {
    const { name } = req.body;
    const newCountry = new CountryModel({ name });
    await newCountry.save();
    res.status(201).json(newCountry);
  } catch (err) {
    res.status(500).json({ error: "Error adding country" });
  }
});

// GET API - Fetch all states by country
router.get("/states/:countryId", async (req, res) => {
  const { countryId } = req.params;
  try {
    const states = await StateModel.find({ countryId });
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: "Error fetching states" });
  }
});

// POST API - Add a new state
router.post("/states", async (req, res) => {
  try {
    const { name, countryId } = req.body;
    const newState = new StateModel({ name, countryId });
    await newState.save();
    res.status(201).json(newState);
  } catch (err) {
    res.status(500).json({ error: "Error adding state" });
  }
});

// GET API - Fetch all cities by state
router.get("/cities/:stateId", async (req, res) => {
  const { stateId } = req.params;
  try {
    const cities = await CityModel.find({ stateId });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cities" });
  }
});

// POST API - Add a new city
router.post("/cities", async (req, res) => {
  try {
    const { name, stateId } = req.body;
    const newCity = new CityModel({ name, stateId });
    await newCity.save();
    res.status(201).json(newCity);
  } catch (err) {
    res.status(500).json({ error: "Error adding city" });
  }
});

export default router;