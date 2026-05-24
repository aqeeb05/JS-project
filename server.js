const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs'); // New: File System module
const mongoose = require('mongoose');
const Product = require('./models/product.model.js')
const productRoute = require('./routes/product.route.js')
const userRoute = require('./routes/user.route.js')
const app = express();
const PORT = 3000;
const dns = require('node:dns/promises');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();

app.use(express.json());
app.use(express.static('public'));

//routes
app.use('/api/products',productRoute);
app.use('/user',userRoute);

const DATA_FILE = './users.json';

// Helper function to read users from JSON file
const getUsers = () => {
    try {
        // If the file doesn't exist, this will go to the 'catch' block
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify([]));
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data || '[]'); // Handle empty files
    } catch (error) {
        console.error("Error reading users file, returning empty array.");
        return [];
    }
};

// Helper function to save users to JSON file
const saveUsers = (users) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

// SIGNUP ROUTE
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;
    const users = getUsers();

    // Check if email OR username already exists
    if (users.find(u => u.email === email || u.username === username)) {
        return res.status(400).json({ message: "User or Username already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save all the details
    users.push({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString() // Good practice for project management
    });

    saveUsers(users);
    res.status(201).json({ message: "Account created successfully!" });
});

// LOGIN ROUTE
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        // IMPORTANT: We send the 'user' object exactly as the frontend expects it
        return res.status(200).json({
            message: "Success",
            user: {
                firstName: user.firstName || "User", // Fallback if name is missing
                lastName: user.lastName || "",
                username: user.username || "Member",
                email: user.email
            }
        });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

// app.get('/api/products', async (req, res) => {
//     try {
//         const product = await Product.find({});
//         res.status(200).json(product);
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

// app.get('/api/products/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const product = await Product.findById(id);
//         res.status(200).json(product);
//     }
//     catch (error) {
//         res.status(200).json({ message: error.message })
//     }
// })

// app.post('/api/products', async (req, res) => {
//     try {
//         const product = await Product.create(req.body);
//         res.status(200).json(product);
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// })
//update api
// app.put('/api/products/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         await Product.findByIdAndUpdate(id, req.body);
//         if (!Product) {
//             return res.status(404).json({ message: "Product not Found" })
//         }
//         const unpdatedProduct = await Product.findById(id);
//         res.status(200).json(unpdatedProduct);
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

//delete api

// app.delete('/api/products/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const product = await Product.findByIdAndDelete(id);

//         if (!product) {
//             return res.status(404).json({ message: "product not found" })
//         }

//         res.status(200).json({ message: "Product deleted successfully" });
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

mongoose.connect("mongodb+srv://aqeeb05:aqeeb005@backend-db.10dc9ek.mongodb.net/?appName=backend-DB")
    .then(() => {
        console.log("connected to database");
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        })
    })
    .catch((error) => {
        console.log("connection failed", error);
    });












