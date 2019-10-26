import 'firebase/auth';
import 'firebase/firestore';
import firebase from 'firebase/app';
import { collectionData, docData } from 'rxfire/firestore'

/** Initlalize Firebase App */
const config = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  databaseURL:  process.env.REACT_APP_FB_DB,
  projectId:  process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket:  process.env.REACT_APP_FB_STORE,
  messagingSenderId:  process.env.REACT_APP_FB_MSG_ID,
  appId:  process.env.REACT_APP_FB_APP_ID,
  measurementId:  process.env.REACT_APP_FB_MEASURE_ID
};

const app = firebase.initializeApp(config);
const firestore = firebase.firestore(app)

const increment = firebase.firestore.FieldValue.increment(1);
const arrayPush = (item) => firebase.firestore.FieldValue.arrayUnion(item);
const arrayRemove = (item) => firebase.firestore.FieldValue.arrayRemove(item);
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export default firebase;

export {
  app,
  firestore,
  collectionData,
  increment,
  arrayPush,
  arrayRemove,
  timestamp,
  docData,
}

