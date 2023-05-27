import http from 'node:http';
import url from 'node:url';

const hostname = '127.0.0.1';
const port = 3000;

function caesarCipher(message, key) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const result = [];
    for (let i = 0; i < message.length; i++) {
        const char = message[i];
        const charCode = alphabet.indexOf(char);
        if (charCode < 0) {
            result.push(char);
            continue;
        }
        const encryptedCharCode = (charCode + key) % alphabet.length;
        const encryptedChar = alphabet[encryptedCharCode];
        result.push(encryptedChar);
    }
    return result.join('');
}

const server = http.createServer((req, res) => {
    const { query } = url.parse(req.url, true);
    const { message = '' } = query;
    res.end(caesarCipher(message, 5));
});

server.listen(port, hostname, () => {
    console.log(`server has been started on port ${port}`);
});