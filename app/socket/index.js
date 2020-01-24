'use strict';
const helper = require('../helpers');

module.exports = (io, app) => {
  let allrooms = app.locals.chatroom;

  io.of('/roomslist').on('connection', socket => {
    socket.on('getChatRooms', () => {
      socket.emit('chatRoomsList', JSON.stringify(allrooms));
    });

    socket.on('createNewRoom', newRoomInput => {
      // check to see if a room with the same title exists or not
      // if not, create one and broadcast it to everyone
      if (!helper.findRoomByName(allrooms, newRoomInput)) {
        // Create a new chat room
        allrooms.push({
          room: newRoomInput,
          roomID: helper.randomHex(),
          users: [],
        });

        // Emit the updated allrooms back to the user
        socket.emit('chatRoomsList', JSON.stringify(allrooms));

        // Broadcast the updated allrooms to all active users
        socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
      }
    });
  });

  io.of('/chatter').on('connection', socket => {
      //Join a chatroom

      socket.on('join', data => {
          let usersList = helper.addUserToRoom(allrooms, data, socket);

          // Update the list of active users as shown on the chatroom page
          socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(usersList.users));
          socket.emit('updateUsersList', JSON.stringify(usersList.users));
      })
      // When a socket disconnects/exits
      socket.on('disconnect', () => {
        // Find the room to which the socket is connected and purge the user
        let room = helper.removeUserFromRoom(allrooms, socket);
        socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
      })

      // When a new message arrives
      socket.on('newMessage', data => {
        socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
      })

  })
};
