*config db.js*

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/userdb');
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

*utlils error handler.js*

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;

*service userservice.js*
const User = require('../models/User');

const createUser = async (data) => {
    return await User.create(data);
};

const getAllUsers = async (page, limit) => {
    const skip = (page - 1) * limit;
    const users = await User.find().skip(skip).limit(limit);
    const total = await User.countDocuments();
    return { users, total, page, limit };
};

const getUserById = async (id) => {
    return await User.findById(id);
};

const updateUserById = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

const deleteUserById = async (id) => {
    return await User.findByIdAndDelete(id);
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
};

*routes userroutes.js*
const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');

// CRUD Routes
router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

*models users.js*
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'], 
        minlength: [3, 'Name must be at least 3 characters long'] 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    age: { 
        type: Number, 
        min: [18, 'Age must be at least 18'],
        max: [100, 'Age must be under 100'] 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);


*controller user controller.js*
const userService = require('../service/UserService');

const createUser = async (req, res, next) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400);
        next(err);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await userService.getAllUsers(Number(page), Number(limit));
        res.status(200).json(result);
    } catch (err) {
        res.status(500);
        next(err);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500);
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUserById(req.params.id, req.body);
        if (!updatedUser) {
            res.status(404);
            throw new Error('User not found');
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400);
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await userService.deleteUserById(req.params.id);
        if (!deletedUser) {
            res.status(404);
            throw new Error('User not found');
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500);
        next(err);
    }
};

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};


*app.js*
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/UserRoutes');
const connectDB = require('./config/db');
const errorHandler = require('./utils/ErrorHandler');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/users', userRoutes);

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

