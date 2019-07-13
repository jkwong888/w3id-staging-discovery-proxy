var express = require('express');
var router = express.Router();
var https = require('https');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("calling endpoint")
    let respData = ''
    // https://w3id-ns.sso.ibm.com/w3id-staging
    var req = https.request({
        host: 'w3id-ns.sso.ibm.com',
        path: '/w3id-staging/well-known/openid-configuration', 
        port: 443,
        method: 'GET'
    },
        function (res2) {
            res2.on('data', function (data) {
                respData += data
            });
            res2.on('end', function() {
                res.send(respData);
            });
            res2.on('error', function(err) {
                console.log(err.message)
                res.sendStatus(503);
            });
    });

    req.on('socket', function (socket) {
        socket.setTimeout(2000);
        socket.on('timeout', function(err) {
            req.abort();
        });
    });

    req.on('error', function (e) {
        console.log(e);
        res.sendStatus(503);
    });

    req.end();


});


module.exports = router;
