import { initializeApp } from "firebase/app";
import "@firebase/auth";
import "@firebase/firestore";

import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	getDocs,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
    signOut
} from "@firebase/auth";
import { getDatabase, ref as dbRef, set as firebaseSet } from "firebase/database";

const firebaseConfig = {
	apiKey: "AIzaSyDoO-15TP38J4Gzz4BlI3rFucgYkymFs04",
	authDomain: "uwjasper.firebaseapp.com",
	databaseURL: "https://uwjasper-default-rtdb.firebaseio.com",
	projectId: "uwjasper",
	storageBucket: "uwjasper.appspot.com",
	messagingSenderId: "393140379927",
	appId: "1:393140379927:web:09b62a59258415ffcad752",
	measurementId: "G-VQBW4GV8Z1",
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getDatabase(app);
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
	try {
		const res = await signInWithPopup(auth, googleProvider);
		const user = res.user;
		const q = query(collection(db, "users"), where("uid", "==", user.uid));
		const docs = await getDocs(q);
		if (docs.docs.length === 0) {
			await addDoc(collection(db, "users"), {
				uid: user.uid,
				name: user.displayName,
				authProvider: "google",
				email: user.email,
			});
		}
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};

const logInWithEmailAndPassword = (email, password) => {
	signInWithEmailAndPassword(auth, email, password).catch((err) => {
		alert(err.message);
	});
};


const registerWithEmailAndPassword = async (userName, email, password) => {
    const initializeUserData = (userId) => {
        const db = getDatabase();
        const userRef = dbRef(db, "users/" + userId);
        const newUserData = {
            avatar: "https://cdn.vectorstock.com/i/1000x1000/32/12/default-avatar-profile-icon-vector-39013212.webp",
            email: email,
            intro: "Hi, I am a new user",
            location: "Seattle",
            paymentOptions: {default: "default"},
            postedItems: ["default"],
            savedItems: ["default"],
            rating: [5],
            userId: userId,
            userName: userName,
            uw: email.includes("uw"),
        };
        firebaseSet(userRef, newUserData);
    };
	createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				if (userCredential.user) {
					const userId = userCredential.user.uid;
					initializeUserData(userId);
				}
			})
			.catch((error) => alert(error.message));
};

const sendPasswordReset = async (email) => {
	try {
		await sendPasswordResetEmail(auth, email);
		alert("Password reset link sent!");
	} catch (err) {
		alert(err.message);
	}
};

const logout = () => {
	signOut(auth);
};

export {
	auth,
	db,
	signInWithGoogle,
	logInWithEmailAndPassword,
	registerWithEmailAndPassword,
	sendPasswordReset,
	logout,
};
