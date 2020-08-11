const express = require('express');
const fs = require('fs');
const pem2jwk = require('pem-jwk').pem2jwk;

const config = require('./configs');

const app = express();

app.get('/keys', (req, res) => {
    fs.readFile(`./${config.publickKeyFileName}`, config.fileEncoding, (err, pem) => {
        if (err) { return res.status(500); }
        const jwk = pem2jwk(pem);
        res.json({
            keys: [{
                ...jwk,
                kid: config.kid,
                use: 'sig'
            }]
        });
    });
});

app.listen(config.jwksServerPort, () => console.log(`JWKS API is on port ${config.jwksServerPort}`));
