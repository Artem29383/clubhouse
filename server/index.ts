import dotenv from "dotenv";

dotenv.config({ path: './server/.env' })
import express from 'express';
import { passport } from "./core/passport";
import cors from 'cors';
import sharp from 'sharp';
import fs from 'fs';

// @ts-ignore
import { Code as CodeDB } from '../models';
import AuthController from "./controllers/AuthController";
import { uploader } from "./core/uploader";
import RoomControllers from "./controllers/RoomControllers";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { UserData } from "../pages";
import { Room } from '../models';
import { getUsersFromRoom } from "../utils/getUsersFromRoom";


const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// AUTH ROUTES
app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/me', passport.authenticate('jwt', { session: false }), AuthController.getMe);

//check sms code
app.post('/auth/sms/activate', passport.authenticate('jwt', { session: false }), AuthController.activate);

//create in DB sms code
app.get('/auth/sms', passport.authenticate('jwt', { session: false }), AuthController.toSendSMS);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  AuthController.authCallback);


app.post('/upload', uploader.single('photo'), (req, res) => {
  const filePath = req.file.path;
  sharp(filePath)
    .resize(150, 150)
    .toFormat('jpeg')
    .toFile(filePath.replace('.png', '.jpeg'), (err) => {
      if (err) {
        throw err;
      }

      fs.unlinkSync(filePath);

      res.json({
        url: `/avatars/${req.file.filename.replace('.png', '.jpeg')}`,
      });
    });
});


// ROOMS
app.get('/rooms', passport.authenticate('jwt', { session: false }), RoomControllers.index);
app.post('/rooms', passport.authenticate('jwt', { session: false }), RoomControllers.create);
app.get('/rooms/:id', passport.authenticate('jwt', { session: false }), RoomControllers.getOne);
app.delete('/rooms/:id', passport.authenticate('jwt', { session: false }), RoomControllers.delete);

// SOCKETS

const rooms: Record<string, any> = {};

io.on('connection', socket => {
  console.log(`socket ${socket.id} has been connect`);

  socket.on('CLIENT@ROOMS:JOIN', ({ user, roomId }: { user: UserData, roomId: number }) => {
    socket.join(`room/${roomId}`);
    rooms[socket.id] = { roomId, user };
    const speakers = getUsersFromRoom(rooms, roomId);

    io.in(`room/${roomId}`).emit('SERVER@ROOMS:JOIN', speakers);
    io.emit('SERVER@ROOMS:HOME', { roomId: Number(roomId), speakers });
    Room.update({ speakers }, { where: { id: roomId } })
  });

  ////Web RTC Audio Call
  socket.on('CLIENT@ROOMS:CALL', ({targetUserId, callerUserId, roomId, signal }) => {
    socket.broadcast.to(`room/${roomId}`).emit('SERVER@ROOMS:CALL', {
      targetUserId,
      callerUserId,
      signal});
  });

  socket.on('CLIENT@ROOMS:ANSWER', ({ targetUserId, callerUserId, roomId, signal }) => {
    socket.broadcast.to(`room/${roomId}`).emit('SERVER@ROOMS:ANSWER', {
      targetUserId,
      callerUserId,
      signal});
  });

  socket.on('disconnect', () => {
    console.log(`socket ${socket.id} has been disconnect`);
    if (rooms[socket.id]) {
      const { roomId, user } = rooms[socket.id];
      socket.broadcast.to(`room/${roomId}`).emit('SERVER@ROOMS:LEAVE', user);
      delete rooms[socket.id];
      const speakers = getUsersFromRoom(rooms, roomId);
      io.emit('SERVER@ROOMS:HOME', { roomId: Number(roomId), speakers });
      Room.update({ speakers }, { where: { id: roomId } })
    }
  });
});


server.listen(4000, () => {
  console.info('Server is running...');
})
