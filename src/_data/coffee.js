import fetch from "node-fetch";
import EleventyFetch from "@11ty/eleventy-fetch/eleventy-fetch.js";

export default async function () {
  console.log("Fetching coffee brews from Apps Script");

  try {
    let json = await EleventyFetch(
      "https://script.google.com/macros/s/AKfycbz6Ts5iMeBOknsiJVS6wb9F03pBqwgkXVgSbzYJioMzomUdLO2_o7RRaeznjsmzYumb/exec",
      {
        duration: "1m",
        type: "json",
        // this fetches the text from the AppsScript deployment and caches it for 30 min. The text is converted to a json.
      }
    );
    console.log(
      "The first real name of the fetched beans list is: ",
      json.beans[0].real_name
    );

    console.log("The first brew was on:", json.brews[0].date);

    const combinedBrews = [...json.brews, ...json.brews_old];

    // Some of the old brews don't have dates, but they were recorded in chronological order and were brewed in 2024. This logic sorts the brews so that they appear first in the brews_combined object. They are then displayed differently using if logic.

    combinedBrews.sort((a, b) => {
      const dateA = a.date;
      const dateB = b.date;

      // Both dates missing, maintain original order
      if (!dateA && !dateB) return 0;

      // A has no date, it should come first
      if (!dateA) return -1;

      // B has no date, it should come first
      if (!dateB) return 1;

      // If both have dates, sort them chronologically
      return new Date(dateA) - new Date(dateB);
    });

    combinedBrews.forEach((brew, index) => {
      brew.brew_id = index + 1; // Assigning a new ID from 1
    });

    return {
      beans: json.beans,
      brews: json.brews,
      brews_old: json.brews_old,
      brews_combined: combinedBrews,
    };
  } catch (e) {
    console.log("Failed to do something:", e);
  }
}
