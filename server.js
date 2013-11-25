require('http').createServer(function (req, res) {
    var body = '';
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        res.end(String(parseInt(body, 10) + 1));
    });
}).listen(3000);
