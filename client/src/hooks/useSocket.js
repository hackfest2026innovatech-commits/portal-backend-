import { useContext, useEffect, useCallback } from 'react';
import { SocketContext } from '../context/SocketContext';

/**
 * Hook to access the socket context.
 * Provides: socket, connected
 */
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

/**
 * Hook to subscribe to a specific socket event.
 * Automatically cleans up the listener on unmount.
 *
 * @param {string} event - The socket event name to listen for
 * @param {Function} handler - The callback function to handle the event
 */
export function useSocketEvent(event, handler) {
  const { socket, connected } = useSocket();

  const stableHandler = useCallback(handler, [handler]);

  useEffect(() => {
    if (!socket || !connected || !event) return;

    socket.on(event, stableHandler);

    return () => {
      socket.off(event, stableHandler);
    };
  }, [socket, connected, event, stableHandler]);
}
