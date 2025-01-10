const { validationResult } = require("express-validator");
const validator = require("../validations");

module.exports = (validationCategory) => {
    const validationRules = validator[validationCategory];

    if (!validationRules) {
        throw new Error(
            `Validation rules for "${validationCategory}" not defined.`
        );
    }

    return (validationRuleName) => {
        const rules = validationRules[validationRuleName];

        if (!rules) {
            throw new Error(
                `Validation rules for "${validationRuleName}" not found in "${validationCategory}".`
            );
        }

        return [
            ...rules,
            (req, res, next) => {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        success: false,
                        errors: errors.array(),
                    });
                }

                next();
            },
        ];
    };
};
