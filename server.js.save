const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const servers = {
    'Google': '8.8.8.8',
    'Cloudflare': '1.1.1.1',
    'OpenDNS': '208.67.222.222',
    'Quad9': '9.9.9.9',
    'Verisign': '64.6.64.6',
    'Comodo Secure DNS': '8.26.56.26',
    'SafeDNS': '195.46.39.39',
    'Yandex.DNS': '77.88.8.8',
};

io.on('connection', (socket) => {
    socket.on('checkDNS', (data) => {
        for (const server in servers) {
            const dnsServer = servers[server];
            let queryCommand;
            if (data.type === 'PTR') {
                queryCommand = `dig -x ${data.domain} +short @${dnsServer}`;
            } else {
                queryCommand = `dig ${data.domain} ${data.type} +short @${dnsServer}`;
            }
            exec(queryCommand, (error, stdout, stderr) => {
                const results = stdout.trim().split('\n');
                const resultName = server.replace(/\s|\./g, '_');
                const result = results.length > 1 ? results.join('\n') : results[0]; // Check for multiple lines
                socket.emit('dnsResult', { server: resultName, result: result });
            });
        }
    });
});


server.listen(3000, () => {
    console.log('Server listening on *:3000');
});
