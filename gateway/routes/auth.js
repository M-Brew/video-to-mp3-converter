const router = require("express").Router();
require("dotenv").config();
const { AUTH_BASE_URL } = process.env;

router.post("/sign-up", async (req, res) => {
  try {
    const payload = req.body;

    const response = await fetch(`${AUTH_BASE_URL}/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const jsonResponse = await response.json();

    return res.status(response.status).send(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const payload = req.body;

    const response = await fetch(`${AUTH_BASE_URL}/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const jsonResponse = await response.json();

    return res.status(response.status).send(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.post("/token", async (req, res) => {
  try {
    const payload = req.body;

    const response = await fetch(`${AUTH_BASE_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const jsonResponse = await response.json();

    return res.status(response.status).send(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.post("/sign-out", async (req, res) => {
  try {
    const payload = req.body;

    const response = await fetch(`${AUTH_BASE_URL}/sign-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return res.sendStatus(response.status);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

router.get("/data", async (req, res) => {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/data`, {
      headers: {
        Authorization: req.headers["authorization"],
      },
    });

    if (response.status !== 200) {
      return res.sendStatus(response.status);
    }

    const jsonResponse = await response.json();

    return res.status(response.status).send(jsonResponse);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

module.exports = router;
