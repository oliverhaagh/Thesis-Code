const express = require('express'); // framework used to setup a NodeJS web server
const Web3 = require('web3'); // framework used to interact with the Ethereum blockchain
const config = require('./config.js'); // import config.js which contains variables used for configuration
const forge = require('node-forge'); // framework used for cryptography
const pki = forge.pki; // PKI functionality of the Forge framework
const app = express(); // web server instance
app.use(express.text()); // treat request bodies as text
app.use(express.static('public')); // allow serving of static resources 
const port = 3000; // the port that web server should listen on

// Web3 provider for interacting with the blockchain
const web3 = new Web3(new Web3.providers.HttpProvider(config.web3ProviderAddress));

const contractAddress = config.contractAddress; // the address of the smart contract
const contract = new web3.eth.Contract(config.abi, contractAddress); // the smart contract

/**
 * Calls the getRootCAs function of the smart contract and returns the result in a given callback function 
 */
function getRootCAs(callback) {
    let CAs = [];
    contract.methods.getRootCAs().call((err, result) => {
        if (err) {
            console.log('Something went wrong while getting list of root CAs');
        } else {
            CAs = result;
        }
        callback(CAs);
    });
}

/**
 * Takes a PEM encoded certificate, validates it towards the list of root CAs
 * coming from the getRootCAs function, and returns the validation status in a given callback function
 */
function validateCert(certPEM, callback) {
    getRootCAs(CAs => {
        let caChain = [];
        CAs.forEach(ca => {
            if(ca.revocationReason === '10') {
                ca = ca.caCert.replace(/\\n/g, '\n');
                caChain.push(ca);
            } 
        });
        if (caChain.length === 0) {
            callback(false);
            return;
        }
        let caStore = pki.createCaStore(caChain);
        let status;
        try {
            status = pki.verifyCertificateChain(caStore, [pki.certificateFromPem(certPEM)]);
        } catch (e) {
            status = false;
        }
        callback(status);
    });
}

// Return /index.html on HTTP GET on root directory
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Validate a PEM encoded certificate given in the body of a HTTP POST request on /validate
// and return the validation status as a string
app.post('/validate', (req, res) => {
    let cert = req.body;
    validateCert(cert, status => {
        res.setHeader('Content-Type', 'text/plain');
        res.send("Certificate is " + (status ? "trusted" : "NOT trusted"));
        res.end();
    });
});

// Start web server on the specified port 
app.listen(port, () => console.log(`Application listening on port ${port}`));
