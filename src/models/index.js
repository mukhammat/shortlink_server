const UrlMapping = require("../models/url-mapping.model");
const Click = require("../models/click.model");

UrlMapping.hasMany(Click, { foreignKey: "urlMappingId" });
Click.belongsTo(UrlMapping, { foreignKey: "urlMappingId" });

module.exports = {
    UrlMapping,
    Click,
};
