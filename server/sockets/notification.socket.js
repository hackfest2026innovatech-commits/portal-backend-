function setupNotificationSocket(io) {
  io.on('connection', (socket) => {
    socket.on('notification:send', (data) => {
      const { notification, targetRole } = data || {};

      if (!notification) {
        return;
      }

      if (targetRole && targetRole !== 'all') {
        io.to(`role:${targetRole}`).emit('notification:new', { notification });
      } else {
        io.emit('notification:new', { notification });
      }
    });
  });
}

module.exports = setupNotificationSocket;
