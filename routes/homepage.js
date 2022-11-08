const { Router } = require("express");
const router = Router();

const { getArtworks } = require("../controllers/homepage");

router.get("/getartworks/:keyword&numberOfRows=:numberOfRows?", getArtworks);

module.exports = router;
