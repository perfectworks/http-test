var http = require('http');
http.globalAgent.maxSockets = Infinity;

var total = 10000;
var maxCurrence = 157;

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
            } else if (currentRequestCount < maxCurrence) {
                sendRequest();
            }
        });
        res.on('error', function (err) {
            console.log(err);
        });
    }).end(id + '\n');

    currentRequestCount += 1;
    requestCount += 1;

    if (currentRequestCount < maxCurrence && responseCount < total) {
        sendRequest();
    }
}());

var now = +new Date();
function done() {
    var average = (+new Date() - now) / total;
    durations = durations.sort();

    var dot99 = durations[Math.floor(durations.length * 0.99)];
    var dot50 = durations[Math.floor(durations.length * 0.5)];

    console.log('all done');
    console.log('Average RTT: ', average, 'ms');
    console.log('.99 : ', dot99, 'ms');
    console.log('.50 : ', dot50, 'ms');

    if (errorCount) {
        console.log('%d error response', errorCount);
    }
}
