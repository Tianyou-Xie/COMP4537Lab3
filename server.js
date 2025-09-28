// server.js
// Main entry point for the Lab 3 server.
// Implements three endpoints:
//   B: GET /COMP4537/labs/3/getDate/?name=John   → Greeting + current server time
//   C.1: GET /COMP4537/labs/3/writeFile/?text=BCIT → Append text to file.txt
//   C.2: GET /COMP4537/labs/3/readFile/file.txt   → Read file.txt content

const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const Utils = require("./modules/utils"); // Custom utility class

// IMPORTANT: use Render's port if present
const PORT = process.env.PORT || 3000;

// Optional: point file operations to a persistent directory when provided
const DATA_DIR = process.env.DATA_DIR || __dirname;
// If DATA_DIR is not the app folder, make sure it exists (for local testing)
try { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}

class Server {
  constructor(port) {
    this.port = port;

    // Bind request handler so "this" refers to the class instance
    this.server = http.createServer(this.requestHandler.bind(this));
  }

  /**
   * Handles incoming HTTP requests and routes them to correct endpoints.
   * @param {http.IncomingMessage} req - The request object
   * @param {http.ServerResponse} res - The response object
   */
  requestHandler(req, res) {
    const parsedUrl = url.parse(req.url, true); // Parse URL and query string
    const pathname = parsedUrl.pathname; // Path after domain
    const query = parsedUrl.query;       // Query parameters (?name=John)

    // Always return HTML (not JSON, not download)
    res.setHeader("Content-Type", "text/html");

    // -------------------------------
    // Part B: Greeting + current time
    // -------------------------------
    if (pathname === "/COMP4537/labs/3/getDate/") {
      const name = query.name || "Guest"; // Default to Guest if no name
      const message = Utils.getDate(name); // Build greeting
      res.writeHead(200);
      res.end(`<p style="color:blue">${message}</p>`);
    }

    // -------------------------------
    // Part C.1: Append text to file.txt
    // -------------------------------
    else if (pathname === "/COMP4537/labs/3/writeFile/") {
      const text = query.text;

      // Validate query parameter
      if (!text) {
        res.writeHead(400);
        return res.end(
          "<p style='color:red'>Missing query parameter: text</p>"
        );
      }

      const filePath = path.join(__dirname, "file.txt");

      // Append text to file (create if not exists)
      fs.appendFile(filePath, text + "\n", (err) => {
        if (err) {
          res.writeHead(500);
          res.end("<p style='color:red'>Error writing to file</p>");
        } else {
          res.writeHead(200);
          res.end(`<p style="color:blue">Appended "${text}" to file.txt</p>`);
        }
      });
    }

    // -------------------------------
    // Part C.2: Read file.txt content
    // -------------------------------
    else if (pathname.startsWith("/COMP4537/labs/3/readFile/")) {
      const filename = pathname.split("/").pop(); // Extract filename
      const filePath = path.join(__dirname, filename);

      // Read file content and return in blue text
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end(
            `<p style="color:red">404 Error: File "${filename}" not found</p>`
          );
        } else {
          res.writeHead(200);
          res.end(`<pre style="color:blue">${data}</pre>`);
        }
      });
    }

    // -------------------------------
    // Fallback for unknown routes
    // -------------------------------
    else {
      res.writeHead(404);
      res.end("<p style='color:red'>404 Not Found</p>");
    }
  }

  /**
   * Starts the server and listens on the configured port.
   */
  start() {
    this.server.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}/`);
    });
  }
}

// Create and start server instance
const myServer = new Server(PORT);
myServer.start();
