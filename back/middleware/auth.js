const jwt = require("jsonwebtoken");

// Middleware للتحقق من التوكن
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // فيه userId و role
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

// Middleware للتحقق من الصلاحيات
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

module.exports = { authMiddleware, authorizeRoles };