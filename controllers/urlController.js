import * as urlService from "../services/urlService.js";

export const shortenUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const userId = req.user.id;
    const shortCode = await urlService.createShortUrl(url, userId);
    res.status(201).json({ shortCode });
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

export const getOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const originalUrl = await urlService.getOriginalUrl(shortCode);
    res.json({ originalUrl });
  } catch (error) {
    res.status(404).json({ error: "URL not found", message: error.message });
  }
};

export const getUrlAnalytics = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const userId = req.user.id;
    const analytics = await urlService.getUrlAnalytics(shortCode, userId);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

export const getLatestUrlAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const latestUrl = await Url.findOne({ userId }).sort({ createdAt: -1 });

    if (!latestUrl) {
      return res.status(404).json({ message: "No URLs found for this user" });
    }

    res.json({
      shortCode: latestUrl.shortCode,
      clicks: latestUrl.clicks,
    });
  } catch (error) {
    console.error("Error fetching latest analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const userId = req.user.id;
    await urlService.deleteUrl(shortCode, userId);
    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUrl:", error);
    if (error.message === "URL not found" || error.message === "Unauthorized") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Server error", message: error.message });
    }
  }
};

export const getLatestUrl = async (req, res) => {
  try {
    const userId = req.user.id;
    const latestUrl = await Url.findOne({ createdBy: userId }).sort({
      createdAt: -1,
    });

    if (!latestUrl) {
      return res.status(404).json({ message: "No URLs found for this user" });
    }

    res.json({
      shortCode: latestUrl.shortCode,
      originalUrl: latestUrl.originalUrl,
    });
  } catch (error) {
    console.error("Error fetching latest URL:", error);
    res.status(500).json({ message: "Server error" });
  }
};
