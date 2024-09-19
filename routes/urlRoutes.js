import express from "express";
import * as urlController from "../controllers/urlController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/shorten", auth, urlController.shortenUrl);
router.get("/:shortCode", urlController.getOriginalUrl);
router.get("/:shortCode/analytics", auth, urlController.getUrlAnalytics);
router.get("/latest/analytics", auth, urlController.getLatestUrlAnalytics);
router.delete("/:shortCode", auth, urlController.deleteUrl);
router.get("/latest", auth, urlController.getLatestUrl);

export default router;
