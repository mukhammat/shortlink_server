const { createHash } = require("crypto");
const { UrlMapping, Click } = require("../models");
const Sequelize = require("sequelize");

const host = process.env.HOST || `http://localhost:${process.env.PORT || 3000}`;

const createLink = async (req, res) => {
    try {
        const { expiresAt, alias } = req.body;
        let { originalUrl } = req.body;

        if (!/^https?:\/\//i.test(originalUrl)) {
            originalUrl = `https://${originalUrl}`;
        }

        if (expiresAt && new Date(expiresAt) < new Date()) {
            return res.status(400).json({ error: "Invalid expiration date" });
        }

        if (alias) {
            await UrlMapping.create({ originalUrl, hash: alias, expiresAt });
            return res.json({ link: `${host}/shortUrl/${alias}` });
        }

        const hash = createHash("sha256")
            .update(originalUrl)
            .digest("hex")
            .slice(0, 6);

        await UrlMapping.create({ originalUrl, hash, expiresAt });

        return res.json({ link: `${host}/shortUrl/${hash}` });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ error: "Alias already exists" });
        }
        return res.status(500).json({ error: error.message });
    }
};

const getLink = async (req, res) => {
    try {
        const { hash } = req.params;
        const urlMapping = await UrlMapping.findOne({ where: { hash } });

        if (!urlMapping) {
            return res.status(404).json({ error: "Link not found" });
        }

        if (
            urlMapping.expiresAt &&
            new Date(urlMapping.expiresAt) < new Date()
        ) {
            await urlMapping.destroy();
            return res.status(410).json({ error: "Link expired" });
        }

        await Click.create({ urlMappingId: urlMapping.id, ip: req.ip });

        urlMapping.clickCount += 1;
        await urlMapping.save();

        return res.redirect(urlMapping.originalUrl);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getInfo = async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const urlMapping = await UrlMapping.findOne({
            where: { hash: shortUrl },
        });

        if (!urlMapping) {
            return res.status(404).json({ error: "Link not found" });
        }

        const data = {
            originalUrl: urlMapping.originalUrl,
            createdAt: urlMapping.createdAt,
            clickCount: urlMapping.clickCount,
        };

        return res.json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const deleteLink = async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const urlMapping = await UrlMapping.findOne({
            where: { hash: shortUrl },
        });

        if (!urlMapping) {
            return res.status(404).json({ error: "Link not found" });
        }

        await urlMapping.destroy();

        return res.json({ message: "Link deleted" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAnalytics = async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const urlMapping = await UrlMapping.findOne({
            where: { hash: shortUrl },
        });

        if (!urlMapping) {
            return res.status(404).json({ error: "Link not found" });
        }

        const uniqueIps = await Click.findAll({
            attributes: [
                [Sequelize.fn("DISTINCT", Sequelize.col("ip")), "ip"], // Уникальные IP
                [Sequelize.fn("MAX", Sequelize.col("created_at")), "lastSeen"], // Последнее время перехода
            ],
            group: ["ip"], // Группируем по IP
            order: [[Sequelize.fn("MAX", Sequelize.col("created_at")), "DESC"]], // Сортируем по последнему времени
            limit: 5, // Ограничение на количество записей
        });

        return res.json({ clicks: urlMapping.clickCount, uniqueIps });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createLink,
    getLink,
    getInfo,
    deleteLink,
    getAnalytics,
};
