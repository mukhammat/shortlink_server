const { Router } = require("express");
const router = Router();

const shortenValidate = require("../middleware/validateRequest")(
    "ShortenValidate"
);

const { Shorten } = require("../controllers");

router.post("/shorten", shortenValidate("createLink"), Shorten.createLink);
router.get("/shortUrl/:hash", shortenValidate("getLink"), Shorten.getLink);
router.get("/info/:shortUrl", shortenValidate("getInfo"), Shorten.getInfo);
router.delete(
    "/delete/:shortUrl",
    shortenValidate("deleteLink"),
    Shorten.deleteLink
);

router.get(
    "/analytics/:shortUrl",
    shortenValidate("analytics"),
    Shorten.getAnalytics
);

module.exports = router;
