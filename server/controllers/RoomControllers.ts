import express from "express";
// @ts-ignore
import { Room } from '../../models';

class RoomControllers {
  async index(req: express.Request, res: express.Response) {
    try {
      const items = await Room.findAll()
      res.json(items);
    } catch (e) {
      res.json({ message: 'error', e }).status(500)
    }
  }

  async create(req: express.Request, res: express.Response) {
    try {
      const data = {
        title: req.body.title,
        type: req.body.type,
      }

      if (!data.type || !data.title) {
        return res.status(400).json({ message: 'title or type is empty' })
      }

      const room = await Room.create(data);
      res.json(room).status(201);
    } catch (e) {
      res.json({ message: 'error', e }).status(500)
    }
  }

  async getOne(req: express.Request, res: express.Response) {
    try {
      const roomId = req.params.id;
      if (isNaN(Number(roomId))) {
        return res.status(404).json({ message: 'Неверный ID комнаты' });
      }

      const room = await Room.findByPk(roomId);

      if (!room) return res.status(404).json({ message: 'room is not exist' });

      res.json(room);
    } catch (e) {
      res.json({ message: 'error', e }).status(500)
    }
  }

  async delete(req: express.Request, res: express.Response) {
    try {
      const roomId = req.params.id;
      if (isNaN(Number(roomId))) {
        return res.status(404).json({ message: 'Неверный ID комнаты' });
      }

      const room = await Room.destroy({
        where: {
          id: roomId
        }
      });

      if (!room) return res.status(404).json({ message: 'room is not exist' });

      res.json(room).status(200);
    } catch (e) {
      res.json({ message: 'error', e }).status(500)
    }
  }
}

export default new RoomControllers();
