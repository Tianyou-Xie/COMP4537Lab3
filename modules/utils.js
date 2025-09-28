// modules/utils.js
// Utility module that handles reusable server-side logic.
// In this lab, it is responsible for generating the greeting + timestamp.

const messages = require("../locals/en"); // Load the message strings

class Utils {
  /**
   * Returns a greeting message with the current server date and time.
   * @param {string} name - The name of the user provided in the query string.
   * @returns {string} - Personalized greeting + server date/time (English format).
   */
  static getDate(name) {
    const now = new Date();

    // Format the date in US English with short timezone (e.g. PDT)
    const formatted = now.toLocaleString("en-US", { timeZoneName: "short" });

    // Replace placeholder %1 with the actual name
    return messages.greeting.replace("%1", name) + " " + formatted;
  }
}

module.exports = Utils; // Export Utils class for use in server.js
