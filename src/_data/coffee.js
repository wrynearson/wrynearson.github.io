const fetch = require("node-fetch");

const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
  console.log("Fetching coffee brews from Apps Script");

  try {
    let json = await EleventyFetch(
      "https://script.google.com/macros/s/AKfycbz6Ts5iMeBOknsiJVS6wb9F03pBqwgkXVgSbzYJioMzomUdLO2_o7RRaeznjsmzYumb/exec",
      {
        duration: "0s",
        type: "json",
        // this fetches the text from the AppsScript deployment and caches it for a day. The text is converted to a json.
      }
    );
    console.log(
      "The first real name of the fetched beans is: ",
      json.beans[0].real_name
    );

    console.log(
      "The first real brew of the fetched brews was on: ",
      json.brews[0].Zeitstempel
    );

    return {
      beans: json.beans,
      brews: json.brews,
    };
  } catch (e) {
    console.log("Failed to do something:", e);
  }
};
