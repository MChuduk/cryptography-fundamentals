import http from 'node:http';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.end("hello");
});

server.listen(port, hostname, () => {
    console.log(`server has been started on port ${port}`);
});