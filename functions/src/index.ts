import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as fn from './functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const getUser = express();
getUser.use(cookieParser());
getUser.get('*', fn.getUser);
exports.getUser = functions.https.onRequest(getUser);
