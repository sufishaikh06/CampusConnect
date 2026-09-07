/**
 * Simple token-based auth middleware for admin routes.
 */
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [user] = decoded.split(':');
    if (user === (process.env.ADMIN_USERNAME || 'admin')) {
      req.adminUser = user;
      return next();
    }
  } catch {}

  res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
}

module.exports = requireAdmin;
