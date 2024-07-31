const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors()); // CORS desteği ekleniyor
app.use(bodyParser.json());

const CategorySchema = new mongoose.Schema({
    name: String,
    description: String
});

const CategoryModel = mongoose.model("Category", CategorySchema);

app.get("/data", async (req, res) => {
    try {
        let categories = await CategoryModel.find();
        res.send(categories);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.get("/data/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let category = await CategoryModel.findById(id);
        if (!category) {
            res.status(404).send({ message: "Category not found" });
        } else {
            res.send(category);
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.delete("/data/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let category = await CategoryModel.findByIdAndDelete(id);
        if (!category) {
            res.status(404).send({ message: "Category not found" });
        } else {
            res.send({ message: "Category deleted", category });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

app.post("/data", async (req, res) => {
    try {
        let newCategory = new CategoryModel(req.body);
        await newCategory.save();
        res.send(newCategory);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

mongoose.connect(process.env.DB_CONNECTION)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.log("MongoDB connection error:", err);
    });

app.listen(5050, () => {
    console.log("5050 portu aktivdir");
});
