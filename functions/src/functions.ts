import { Request, Response } from 'express';
import * as admin from 'firebase-admin';

/**
 * returns information about the current user identified by a idToken in the __session cookie. return value is
 * {
 *  name: string
 *  imgUrl: string
 *  email: string
 * }
 */
export async function  getUser(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'private');
  if (req.cookies && req.cookies['__session']) {
    try {
      const decodedIdToken = await admin.auth().verifyIdToken(req.cookies['__session']);
      console.log(`User: ${JSON.stringify(decodedIdToken)}`);
      const uid = decodedIdToken.uid;
      console.log(`uid: ${uid}`);
      // fetch user info
      const user = await admin.auth().getUser(uid);
      console.log(`user: ${user}`);
    } catch (error) {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Unauthorized');
    }
  } else {
    res.json({});
  }
  return Promise.resolve();
/*
    res.setHeader('Cache-Control', 'private');
    res.json({
        name: 'Marco Pöhler',
        email: 'marco@kontaktlinsen-preisvergleich.de',
        imgUrl: 'https://lh3.googleusercontent.com/-SVQpxxX3sro/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rd65vgIqMN_rML9HMUWLGX7PMnEHw.CMID/s192-c/photo.jpg'
      });
*/
}
