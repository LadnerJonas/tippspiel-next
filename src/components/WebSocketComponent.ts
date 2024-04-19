import { useEffect } from 'react';
import { notifyClients } from '../pages/api/websocket';

export default function WebSocketComponent({ fetchData }) {
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000/api/websocket');

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            console.log('Received message:', event.data);
            // Call fetchData upon receiving a notification message
            fetchData();
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.close();
        };
    }, [fetchData]);

    return null;
}
