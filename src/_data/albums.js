import EleventyFetch from "@11ty/eleventy-fetch/eleventy-fetch.js";

const DEFAULT_ALBUMS = [
  {
    slug: "japan-2024",
    title: "Japan 2024",
    date: "2024-11-15",
    description: "A trip through Tokyo and Kyoto.",
    tags: ["travel", "japan", "photography"],
    cover: "https://dummyimage.com/1200x800/ccc/000.jpg",
    photos: [
      {
        url: "https://dummyimage.com/1200x800/ccc/000.jpg",
        caption: "Tokyo Streets",
        exif: { camera: "Sony A7III", lens: "35mm", aperture: "f/1.8", shutter: "1/200", iso: "400" }
      },
      {
        url: "https://dummyimage.com/1200x800/ddd/111.jpg",
        caption: "Kyoto Temple",
        exif: { camera: "Sony A7III", lens: "85mm", aperture: "f/2.8", shutter: "1/500", iso: "100" }
      },
      {
        url: "https://dummyimage.com/1200x800/eee/222.jpg",
        caption: "Mount Fuji",
        exif: { camera: "Sony A7III", lens: "85mm", aperture: "f/8", shutter: "1/1000", iso: "100" }
      }
    ]
  },
  {
    slug: "seattle-2023",
    title: "Seattle Summer",
    date: "2023-08-20",
    description: "Summer time in the PNW.",
    tags: ["travel", "seattle", "summer"],
    cover: "https://dummyimage.com/1200x800/bbb/333.jpg",
    photos: [
      {
        url: "https://dummyimage.com/1200x800/bbb/333.jpg",
        caption: "Space Needle",
        exif: { camera: "Fujifilm X100V", lens: "23mm", aperture: "f/4", shutter: "1/400", iso: "200" }
      },
      {
        url: "https://dummyimage.com/1200x800/aaa/444.jpg",
        caption: "Pike Place Market",
        exif: { camera: "Fujifilm X100V", lens: "23mm", aperture: "f/2.8", shutter: "1/200", iso: "400" }
      }
    ]
  }
];

export default async function () {
  console.log("Fetching photo albums");

  const baseUrl = process.env.ALBUMS_ENDPOINT;

  if (!baseUrl) {
    console.log("No ALBUMS_ENDPOINT provided, using placeholder data.");
    return DEFAULT_ALBUMS;
  }

  try {
    const indexUrl = `${baseUrl}/albums/index.json`;
    let indexJson = await EleventyFetch(indexUrl, {
      duration: "1d",
      type: "json",
    });

    const albums = [];
    for (const albumRef of indexJson) {
      const albumUrl = `${baseUrl}/albums/${albumRef.slug}/album.json`;
      let albumData = await EleventyFetch(albumUrl, {
        duration: "1d",
        type: "json",
      });

      // Construct absolute URLs for photos and cover
      albumData.cover = `${baseUrl}/albums/${albumData.slug}/photos/${albumData.cover}`;
      albumData.photos = albumData.photos.map((photo) => {
        return {
          ...photo,
          url: `${baseUrl}/albums/${albumData.slug}/photos/${photo.filename || photo.url}`,
        };
      });

      albums.push(albumData);
    }
    
    albums.sort((a, b) => new Date(b.date) - new Date(a.date));
    return albums;

  } catch (e) {
    console.log("Failed to fetch albums from endpoint, falling back to placeholder data:", e);
    return DEFAULT_ALBUMS;
  }
}
