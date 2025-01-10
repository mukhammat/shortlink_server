const { body, param } = require("express-validator");

module.exports = {
    createLink: [
        body("originalUrl")
            .isURL({ require_protocol: false })
            .withMessage("Invalid URL"),
        body("alias")
            .optional()
            .isString()
            .withMessage("Invalid shortUrl")
            .isLength({ max: 20 })
            .withMessage("shortUrl must be between 1 and 10 characters"),
        body("expiresAt").optional().isISO8601().withMessage("Invalid date"),
    ],
    getLink: [param("hash").isString().withMessage("Invalid hash")],
    getInfo: [param("shortUrl").isString().withMessage("Invalid shortUrl")],
    deleteLink: [param("shortUrl").isString().withMessage("Invalid shortUrl")],
    analytics: [param("shortUrl").isString().withMessage("Invalid shortUrl")],
};
