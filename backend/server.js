const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

const Feedback = require("./models/Feedback");

dotenv.config();

// Fix DNS issue for MongoDB Atlas SRV connection
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:");
        console.log(error.message);
    });


// Home Route
app.get("/", (req, res) => {
    res.send("Event Feedback Management System Backend is running!");
});


// Submit Feedback API
app.post("/api/feedback", async (req, res) => {

    try {

        const { name, email, event, message } = req.body;

        if (!name || !email || !event || !message) {
            return res.status(400).json({
                message: "All fields are required!"
            });
        }

        const newFeedback = new Feedback({
            name,
            email,
            event,
            message
        });

        await newFeedback.save();

        res.status(201).json({
            message: "Feedback submitted successfully!"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to submit feedback"
        });
    }
});


// Get All Feedback
app.get("/api/feedback", async (req, res) => {

    try {

        const feedbacks = await Feedback.find().sort({
            createdAt: -1
        });

        res.json(feedbacks);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch feedback"
        });
    }
});


// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});