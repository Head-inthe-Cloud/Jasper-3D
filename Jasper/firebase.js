import { firebase } from '@firebase/app';
import '@firebase/auth'
import '@firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyDoO-15TP38J4Gzz4BlI3rFucgYkymFs04",
    authDomain: "uwjasper.firebaseapp.com",
    databaseURL: "https://uwjasper-default-rtdb.firebaseio.com",
    projectId: "uwjasper",
    storageBucket: "uwjasper.appspot.com",
    messagingSenderId: "393140379927",
    appId: "1:393140379927:web:09b62a59258415ffcad752",
    measurementId: "G-VQBW4GV8Z1"
};
const app = firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
const auth = firebase.auth()
export { db, auth }