// import firebase
import firebase from "firebase";

// config value from add firebase sdk script
const config = {
  apiKey: "AIzaSyCQuOco9o1Xr7xBi32E4b3Y4-Z7SH1QTuI",
  authDomain: "green-sales-19.firebaseapp.com",
  projectId: "green-sales-19",
  storageBucket: "green-sales-19.appspot.com",
  messagingSenderId: "40100780561",
  appId: "1:40100780561:web:63aba33569ed697fb4efb0",
  measurementId: "G-P62VN2L8FV"
};

// init app
firebase.initializeApp(config);

// export default firestore
export default firebase.firestore();