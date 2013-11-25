var http = require('http');
http.globalAgent.maxSockets = Infinity;

var total = 1000;
var maxCurrence = 100;

var currentRequestCount = 0;
var errorCount = 0;
var responseCount = 0;
var requestCount = 0;
var durations = [];

var step = total / 10;

(function sendRequest() {
    var id = requestCount;
    var start = +new Date();

    http.request({
        host: 'localhost',
        port: 3000,
        method: 'POST'
    }, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            var duration = +new Date() - start;
            durations.push(duration);

            currentRequestCount -= 1;

            responseCount += 1;

            if (responseCount === total) {
                done();
            } else if (currentRequestCount < maxCurrence && requestCount < total) {
                sendRequest();
            }
        });
        res.on('error', function (err) {
            console.log(err);
        });
    }).end(id + '\n');

    currentRequestCount += 1;
    requestCount += 1;

    if (currentRequestCount < maxCurrence && requestCount < total) {
        sendRequest();
    }
}());

var now = +new Date();
function done() {
    var rps = Math.round(total / (+new Date() - now) * 100000) / 100;
    durations = durations.sort();

    var dot99 = durations[Math.floor(durations.length * 0.99)];
    var dot50 = durations[Math.floor(durations.length * 0.5)];

    console.log('all done');
    console.log('rps: ', rps, 'requests/second');
    console.log('.50 : ', dot50, 'ms');
    console.log('.99 : ', dot99, 'ms');

    if (errorCount) {
        console.log('%d error response', errorCount);
    }
}
