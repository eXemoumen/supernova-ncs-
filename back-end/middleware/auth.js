const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Replace with your actual Supabase project ID
const SUPABASE_JWKS_URI = process.env.SUPABASE_JWKS_URI;

const client = jwksClient({
  jwksUri: SUPABASE_JWKS_URI
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

const verifySupabaseToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded; 
    next();
  });
};

module.exports = verifySupabaseToken;
