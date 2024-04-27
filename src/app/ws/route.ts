// app/api/ws/route.ts (can be any route file in the app directory)
export function SOCKET(
    client: import('ws').WebSocket,
    request: import('http').IncomingMessage,
    server: import('ws').WebSocketServer,
) {
    console.log('A client connected!');

    client.on('message', message => {

        console.log(`Received message: ${message}`)
        const clients = Array.from(
            server.clients
        );
        console.log(`Notifying #${clients.length} clients`);

        // Emit the message to the client.
        for (const client of clients)
            client.send('Hello from the webhook!');
    });

    client.on('close', () => {
        console.log('A client disconnected!');
    });
}