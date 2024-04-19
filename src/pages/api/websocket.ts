// pages/api/websocket.js

import {WebSocketServer} from 'ws';

let clients : any = [];

export default function handler(req: { method: string; }, res: { setHeader: (arg0: string, arg1: string[]) => void; status: (arg0: number) => { (): any; new(): any; end: { (arg0: string): void; new(): any; }; }; }) {
    if (req.method === 'GET') {
        handleWebSocket(req, res);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

function handleWebSocket(req, res) {
    const wss = new WebSocketServer({ noServer: true });

    wss.on('connection', (ws) => {
        clients.push(ws);
        console.log('Client connected');

        ws.on('message', (message) => {
            console.log(`Received message: ${message}`);
        });

        ws.on('close', () => {
            clients = clients.filter((client) => client !== ws);
            console.log('Client disconnected');
        });
    });

    const server = req.socket.server;
    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    res.end();
}

export function notifyClients() {
    clients.forEach((client) => {
        client.send('Game updated');
    });
}
