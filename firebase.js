// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection, addDoc, getDocs, onSnapshot, deleteDoc, doc, getDoc, updateDoc, query, where,orderBy,startAt,endAt } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js"
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js"
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9UMkkh-L0gvqnZVIZ6TezhztXgsJIWTc",
  authDomain: "store-pity.firebaseapp.com",
  projectId: "store-pity",
  storageBucket: "store-pity.appspot.com",
  messagingSenderId: "232042609349",
  appId: "1:232042609349:web:358bae62e7439c7e570eac",
  measurementId: "G-PJP5RQ341H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const storage = getStorage(app);

export const uploadFile = async(file)=>{
  const storageRef = ref(storage, uuid.v4());
  await uploadBytes(storageRef,file);
  const url = await getDownloadURL(storageRef);
  return url;
}

const db = getFirestore();

const citiesRef = collection(db, "task");
export const queryTasks = (search)=> {
  const q = query(citiesRef, orderBy('title'),startAt(search),endAt(search+'\uf8ff')); 
  //const q = query(citiesRef, where('title', "==", search) ,orderBy('title'),startAt(search),endAt(search+'\uf8ff')); 
  return q;
}

export const saveTask = (title, description, image)=>addDoc(collection(db,"task"),{title,description,image});
export const getTasks =()=> getDocs(collection(db,'task'));
export const onGetTasks = (data) => onSnapshot(collection(db,'task'),data);
export const deleteTask =(id)=> deleteDoc(doc(db,'task',id));
export const getTask = (id)=> getDoc(doc(db,'task',id));
export const updateTask = (id, newfields) => updateDoc(doc(db,'task',id),newfields); 

export {
  onSnapshot
  }
/*
export {
  onSnapshot,
  collection,
  db
}*/


