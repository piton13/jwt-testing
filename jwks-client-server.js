const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const config = require('./configs');

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `http://localhost:3344/keys`
    }),
    issuer: config.issuer,
    algorithms: ['RS256'],
    requestProperty: 'tokenData'
});

const app = express();
app.get('/with-auth', checkJwt, (req, res) => {
    res.send(`Result: ${JSON.stringify(req.tokenData)}`);
});

app.listen(config.clientServerPort, () => console.log(`Backend is running on port ${config.clientServerPort}`));
