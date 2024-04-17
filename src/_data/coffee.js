const fetch = require("node-fetch");

const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
  console.log("Fetching coffee brews from Apps Script");

  try {
    let json = await EleventyFetch(
      "https://script.google.com/macros/s/AKfycbzSsNhjl4VYWe9KLH5lUFNlGOu4yy1yyRire5PF_CUp3fMI8GBYUdqKsedShzGV4pjF/exec",
      {
        duration: "1d",
        type: "json",
        // this fetches the text from the AppsScript deployment and caches it for a day. The text is converted to a json.
      }
    );
    return {
      brewing: json,
    };
  } catch (e) {
    console.log("Failed to do something:", e);
  }
};
