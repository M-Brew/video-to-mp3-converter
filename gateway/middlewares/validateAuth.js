require("dotenv").config();
const { AUTH_BASE_URL } = process.env;

module.exports.validateAuth = async (req, res, next) => {
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

    req.user = jsonResponse;
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
