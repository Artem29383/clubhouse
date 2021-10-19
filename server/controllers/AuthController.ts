import express from "express";
// @ts-ignore
import { Code as CodeDB, User as UserDB } from '../../models';
import { getRandomCode } from "../../utils/getRandomCode";

class AuthController {
  getMe(req: express.Request, res: express.Response) {
    res.json(req.user);
  }

  authCallback(req: express.Request, res: express.Response) {
    // Successful authentication, redirect home.
    res.send(`
    <script>window.opener.postMessage('${JSON.stringify(req.user)}','*');
        window.close()
    </script>`)
  }

  async activate(req: any, res: express.Response) {
    const userId = req.user.id;
    const { user, code } = req.body;

    const whereQuery = {
      code,
      user_id: userId,
    };

    if (!code) return res.status(400).send({
      message: 'Input activation code!'
    });

    try {
      const findCode = await CodeDB.findOne({
        where: whereQuery
      })

      if (findCode) {
        await CodeDB.destroy({
          where: whereQuery
        })
        // @TODO после активации активировать юзера

        await UserDB.update({ ...user, isActive: 1 }, { where: { id: userId } });

        return res.send();
      } else {
        res.status(500).json({
          message: 'Code not found',
        });
      }

    } catch (e) {
      res.status(500).json({
        message: 'Error activate account',
      })
    }
  }

  async toSendSMS(req: any, res: express.Response) {
    const { phone } = req.query;
    const userId = req.user?.id;
    const smsCode = getRandomCode();

    if (!phone) return res.status(400).send({
      message: 'Phone number not found'
    });

    try {
      // await Axios.get(sendSMS(smsCode, process.env.API_SMS_KEY))
      const findCode = await CodeDB.findOne({
        where: {
          user_id: userId,
        }
      });


      if (findCode) {
        return res.status(400).json({
          message: 'This user already got the code'
        });
      }

      await CodeDB.create({
        code: smsCode,
        user_id: userId,
      });

      res.status(201).json({});
    } catch (e) {
      console.info(e);
      res.status(500).json({
        message: 'Error after sending SMS',
      })
    }
  }
}

export default new AuthController();
