require('dotenv').config()

const http = require('http');
const { URL_BASE, URL_SEND_MESSAGE } = require('./constant');
const { handleSendReminder } = require('./reminder');

require('./poll-creator');
require('./reminder');
require('./bot')

const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=-4980809143&text=fdafds`

// Define the port to listen on
const PORT = process.env.PORT || 3000;


// Create the HTTP server
const server = http.createServer((req, res) => {
    // Get the URL and parse it
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const path = parsedUrl.pathname;
    
    // Set default response headers
    res.setHeader('Content-Type', 'text/plain');
    
    // Handle different routes
    if (path === '/') {
        res.writeHead(200);
        res.end('Hello, World! Your Node.js server is running.\n');
    } else if (path === '/about') {
        res.writeHead(200);
        res.end('About page content\n');
    } else if (path === '/api') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: 'API endpoint', status: 'success' }));
    } else if (path === '/remind') {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        handleSendReminder().then(() => {
            res.end('Lời nhắc nhở đánh cầu lông đã được gửi');
        }).catch((error) => {
            console.error("Không gửi được lời nhắc")
            res.end('gõ command start để khởi động lại')
        })
    } else {
        // Handle 404 - Page not found
        res.writeHead(404);
        res.end('404 - Page Not Found\n');
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});