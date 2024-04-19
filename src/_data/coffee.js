const fetch = require("node-fetch");

const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
  console.log("Fetching coffee brews from Apps Script");

  try {
    let json = await EleventyFetch(
      "https://script.google.com/macros/s/AKfycbz6Ts5iMeBOknsiJVS6wb9F03pBqwgkXVgSbzYJioMzomUdLO2_o7RRaeznjsmzYumb/exec",
      {
        duration: "1m",
        type: "json",
        // this fetches the text from the AppsScript deployment and caches it for a day. The text is converted to a json.
      }
    );
    console.log(
      "The first real name of the fetched beans list is: ",
      json.beans[0].real_name
    );

    console.log("The first brew was on:", json.brews[0].date);

    return {
      beans: json.beans,
      brews: json.brews,
      brews_old: json.brews_old,
    };
  } catch (e) {
    console.log("Failed to do something:", e);
  }
};
