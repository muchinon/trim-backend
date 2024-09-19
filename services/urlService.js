import Url from "../models/Url.js";
import generateShortCode from "../utils/shortCodeGenerator.js";

export const createShortUrl = async (originalUrl, userId) => {
  const shortCode = generateShortCode();
  const newUrl = new Url({
    originalUrl,
    shortCode,
    createdBy: userId,
  });
  await newUrl.save();

  // Return only the shortCode, not the full URL
  return shortCode;
};

export const getOriginalUrl = async (shortCode) => {
  const url = await Url.findOne({ shortCode });
  if (!url) {
    throw new Error("URL not found");
  }
  return url.originalUrl;
};

export const getUrlAnalytics = async (shortCode, userId) => {
  const url = await Url.findOne({ shortCode, createdBy: userId });
  if (!url) {
    throw new Error("URL not found or unauthorized");
  }
  return { clicks: url.clicks };
};

export const deleteUrl = async (shortCode, userId) => {
  const url = await Url.findOneAndDelete({ shortCode, createdBy: userId });
  if (!url) {
    throw new Error("URL not found or unauthorized");
  }
};

export const getLatestUrlAnalytics = async (userId) => {
  const latestUrl = await Url.findOne({ createdBy: userId })
    .sort({ createdAt: -1 })
    .select("originalUrl shortCode clicks");

  if (!latestUrl) {
    throw new Error("No URLs found for this user");
  }

  return {
    shortCode: latestUrl.shortCode,
    originalUrl: latestUrl.originalUrl,
    clicks: latestUrl.clicks,
  };
};
