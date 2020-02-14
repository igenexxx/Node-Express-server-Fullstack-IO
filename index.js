const fs = require('fs');
const express = require('express');

const port = process.env.PORT || 1337;

const app = express();

const respondText = (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hi');
};

const respondJson = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ text: 'Hi', number: [1, 2, 3]}));
};

const respondNotFound = (req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
};

const respondEcho = (req, res) => {
    const { input = '' } = querystring.parse(req.url.slice(req.url.indexOf('?') + 1));

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        normal: input,
        shouty: input.toUpperCase(),
        characterCount: input.length,
        backwards: input.split('').reverse().join(''),
    }))
};

const respondStatic = (req, res) => {
    const filename = `${__dirname}${req.url.replace('/static', '/public')}`;

    fs.createReadStream(filename)
        .on('error', () => respondNotFound(req, res))
        .pipe(res);
};

app.get('/', respondText);
app.get('/json', respondJson);
app.get('/echo', respondEcho);
app.get('/static/*', respondStatic);

app.listen(port, () => `Server listening on port ${port}`);
