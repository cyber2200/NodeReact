const fetch = require("cross-fetch");
const { response } = require("express");
const AIC_URL = process.env.ARTWORKS_API_URL + "/artworks/search?q=";
console.log(AIC_URL);

const getArtworks = async (req, res = response) => {
  console.log(req.params);
  const { keyword, numberOfRows } = req.params;

  try {
    let limit = process.env.ARTWORKS_LIMIT;
    if (numberOfRows && numberOfRows !== '') {
      limit = numberOfRows;
    }
    const resp = await fetch(
      `${AIC_URL}${keyword}&limit=${limit}&fields=${process.env.ARTWORKS_FIELDS}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (resp.status >= 400) {
      throw new Error("Bad response from server");
    }

    const { data = [] } = await resp.json();
    const dataWithUrls = data.map((image) => ({
      ...image,
      image_url: `${process.env.ARTWORKS_IMG_BASE_URL}/${image.image_id}/full/843,/0/default.jpg`,
    }));

    res.json(dataWithUrls);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getArtworks,
};
