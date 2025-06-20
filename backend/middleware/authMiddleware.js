const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized access.",
          message: "Access denied. Please provide valid credentials."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Error in verifying the token", error);
        return res.status(401).json({
            success: false,
            error: "Invalid token.",
            message: "Your session has expired or is invalid. Please login again."
        });
    }
}

module.exports = {verifyToken}