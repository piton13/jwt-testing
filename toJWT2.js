const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');

const config = require('./configs');

function genKeyPair() {
	// Generates an object where the keys are stored in properties `privateKey` and `publicKey`
	const keyPair = crypto.generateKeyPairSync('rsa', {
		modulusLength: 4096, // bits - standard for RSA keys
		publicKeyEncoding: {
			type: 'pkcs1', // "Public Key Cryptography Standards 1"
			format: 'pem' // Most common formatting choice
		},
		privateKeyEncoding: {
			type: 'pkcs1', // "Public Key Cryptography Standards 1"
			format: 'pem' // Most common formatting choice
		}
	});
	// Create the private key file
	fs.writeFileSync(`${__dirname}/${config.privateKeyFileName}`, keyPair.privateKey);
	// Create the public key file
	fs.writeFileSync(`${__dirname}/${config.publickKeyFileName}`, keyPair.publicKey);
}
// Generates the keypair
// genKeyPair();

const privateKey = fs.readFileSync(`./${config.privateKeyFileName}`, config.fileEncoding);
const publicKey = fs.readFileSync(`./${config.publickKeyFileName}`, config.fileEncoding);

const payload = {
	"name": "Test Data",
	"admin": true,
	"iat": 1597070530,
	"exp": Math.floor(Date.now() / 1000) + (60 * 60),
	"aud": [
	],
	"sub": "auth0|5ee8d360860ea20019fccb70",
	"iss": config.issuer,
};

const signedJWT = jwt.sign(payload, privateKey, {
	algorithm: 'RS256',
	// expiresIn: '1ms'
	// issuer: config.issuer,
	// keyid: config.kid,
});

console.log('>>> signed JWT2: ', signedJWT);

jwt.verify(signedJWT, publicKey, {
	algorithms: ['RS256'],
}, (err, data) => {
	console.log('>>> error 2: ', err);
	console.log('>>> data 2: ', data);

	return;

	if (err.name === 'TokenExpiredError') {
		console.log('Whoops, your token has expired!');
	}

	if (err.name === 'JsonWebTokenError') {
		console.log('That JWT is malformed!');
	}

	if (err === null) {
		console.log('Your JWT was successfully validated!');
	}

	// Both should be the same
	console.log(data);
	console.log(payload);
});
