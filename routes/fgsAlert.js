const express = require("express");
const router = express.Router();
const fgsAlerts = require("../controllers/fgsAlert");

router.get("/alerts", fgsAlerts.getAllAlerts);
router.get("/alerts/:id", fgsAlerts.getAlertById);
router.post("/alerts", fgsAlerts.createAlert);

module.exports = router;
