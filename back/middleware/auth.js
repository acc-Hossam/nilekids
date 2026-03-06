const jwt = require("jsonwebtoken");

// Middleware للتحقق من التوكن
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

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