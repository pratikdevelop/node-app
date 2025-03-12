// app.js
// const http = require('node:http');

// http
//   .createServer((request, response) => {
//     request.on('error', (err) => {
//       console.error(err);
//       response.statusCode = 400;
//       response.end();
//     });

//     response.on('error', (err) => {
//       console.error(err);
//     });

//     // Handle different URLs
//     if (request.method === 'POST' && request.url === '/echo') {
//       // If POST request is made to /echo, return the data sent in the request
//       request.pipe(response);  // Echo back the data
//     } else if (request.method === 'GET' && request.url === '/') {
//       // If GET request is made to root URL, return a welcome message
//       response.statusCode = 200;
//       response.setHeader('Content-Type', 'text/plain');
//       response.end('Welcome to the Home Page!');
//     } else if (request.method === 'GET' && request.url === '/about') {
//       // If GET request is made to /about, return information about the app
//       response.statusCode = 200;
//       response.setHeader('Content-Type', 'text/plain');
//       response.end('This is the About Page!');
//     } else if (request.method === 'GET' && request.url === '/contact') {
//       // If GET request is made to /contact, return contact info
//       response.statusCode = 200;
//       response.setHeader('Content-Type', 'text/plain');
//       response.end('This is the Contact Page!');
//     } else {
//       // Handle 404 for any other request
//       response.statusCode = 404;
//       response.setHeader('Content-Type', 'text/plain');
//       response.end('Page Not Found');
//     }
//   })
//   .listen(8080, () => {
//     console.log('Server running at http://localhost:8080/');
//   });

// const readline = require('node:readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.question(`What's your name?`, name => {
//   console.log(`Hi ${name}!`);
//   rl.close();
// });


// const fs = require('node:fs');

// // 1. Write content to the file (create if not exist)
// fs.writeFile('index.txt', 'Hello, world!', (err) => {
//   if (err) {
//     console.error('Error writing to file:', err);
//   } else {
//     console.log('File written successfully!');

//     // 2. Read the file after writing
//     fs.readFile('index.txt', 'utf8', (err, data) => {
//       if (err) {
//         console.error('Error reading the file:', err);
//       } else {
//         console.log('File content:', data);

//         // 3. Append content to the file
//         fs.appendFile('index.txt', '\nAppended content!', (err) => {
//           if (err) {
//             console.error('Error appending to the file:', err);
//           } else {
//             console.log('Content appended successfully!');

//             // 4. Delete the file after operations
//             // fs.unlink('index.txt', (err) => {
//             //   if (err) {
//             //     console.error('Error deleting the file:', err);
//             //   } else {
//             //     console.log('File deleted successfully!');
//             //   }
//             // });
//           }
//         });
//       }
//     });
//   }
// });


const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views'); // Optional: specify the views directory
const multer = require('multer');
const path = require('path');

// Middleware to handle JSON request bodies
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.get('/', (req, res) => {
//   res.render('index', { title: 'Hello', message: 'Welcome!' });
// });
app.use(express.static('public'));

// Setup multer for file uploading
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
app.post('/signup', upload.single('profilePic'), (req, res) => {
    const { name, email, password } = req.body;
    const profilePic = req.file ? req.file.filename : null; // If a file is uploaded, get the filename

    // Handle the received data (You can save it to a database here)
    console.log('Received Data:', { name, email, password, profilePic });

    // Respond with a success message (can redirect to a different page or show a confirmation)
    res.send(`<h1>Signup successful!</h1><p>Profile Picture: ${profilePic ? profilePic : 'No profile picture uploaded'}</p>`);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
