const express = require("express");
const router = express.Router();
const c = require("./controllers");

router.get("/health", (req, res) => res.json({ status: "ok" }));

router.get("/elevators", c.getElevators);
router.get("/elevators/:id", c.getElevator);
router.post("/elevators/:id/step", c.stepElevator);

router.post("/requests/external", c.externalRequest);
router.post("/requests/internal", c.internalRequest);
router.get("/requests", c.getRequests);
router.post("/elevators/reset", c.resetElevators);

module.exports = router;
