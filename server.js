const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views'); // Optional: specify the views directory
const multer = require('multer');
const path = require('path');
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const session = require('express-session');

// Connect to MongoDB
mongoose.connect("mongodb+srv://developement:CoJVP4ZiUvkj8DY9@cluster0.6dk5t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connection successful");
}).catch((err) => {
    console.log(err);
});

// User Schema (Already defined)
const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: "string",
    },
    email: {
        required: true,
        unique: true,
        type: "string",
    },
    password: {
        required: true,
        type: "string",
    },
    profile_image: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
        },
});

// Hash the password before saving it
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
});

const Users = mongoose.model("Users", userSchema);

// Middleware to handle JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.json()); // To parse JSON data

// Use express session for user sessions
app.use(session({
    secret: 'yourSecretKey', // replace with your secret key
    resave: false,
    saveUninitialized: true,
}));

// Serve static files (uploads folder)
app.use(express.static('public'));

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Store files in 'public/uploads' directory
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + ext; // Create a unique filename
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Serve the signup form on GET request
app.get('/', (req, res) => {
    res.render('index');
});

// API to handle form submission (POST request)
app.post('/signup', upload.single('profilePic'), async (req, res) => {
    const { name, email, password } = req.body;
    const profilePic = req.file ? req.file.filename : null; // If a file is uploaded, get the filename

    try {
        // Check if the email already exists in the database
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).send('<h1>Email already exists. Please try with another email.</h1>');
        }

        // Create a new user
        const newUser = new Users({
            name,
            email,
            password,
            profile_image: profilePic, // Store the filename of the uploaded profile picture
        });

        // Save the user to the database
        await newUser.save();

        // Respond with a success message
        res.send(`<h1>Signup successful!</h1><p>Profile Picture: ${profilePic ? profilePic : 'No profile picture uploaded'}</p>`);
    } catch (err) {
        console.error(err);
        res.status(500).send('<h1>There was an error while creating your account. Please try again later.</h1>');
    }
});

// Create login GET and POST routes
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).send('<h1>Invalid email.</h1>');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('<h1>Invalid password.</h1>');
        }

        req.session.user = user;
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        res.status(500).send('<h1>There was an error while logging in. Please try again later.</h1>');
    }
});

// Create profile GET route
app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.render('profile', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

// Add POST route for updating the profile (Optional)
app.post('/profile', async (req, res) => {
    if (req.session.user) {
        const { name, email, phone, address } = req.body;

        try {
            const updatedUser = await Users.findByIdAndUpdate(
                req.session.user._id,
                { name, email, phone, address },
                { new: true }
            );

            req.session.user = updatedUser; // Update session with the new data
            res.redirect('/profile');
        } catch (err) {
            console.error(err);
            res.status(500).send('<h1>There was an error while updating your profile. Please try again later.</h1>');
        }
    } else {
        res.redirect('/login');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

