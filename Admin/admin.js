import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getFirestore, getDocs, collection, addDoc, orderBy, query, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB_XQm9NvverfvBUKxVHy1BqzE-LI5JfsI",
    authDomain: "shiva-enterprises-634c6.firebaseapp.com",
    projectId: "shiva-enterprises-634c6",
    storageBucket: "shiva-enterprises-634c6.appspot.com",
    messagingSenderId: "1067910627173",
    appId: "1:1067910627173:web:ff3f9ac4db01d9603f2b8c",
    measurementId: "G-BDC7WBZLQS"
  };
  
 
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function addImageData(uid, name, imageUrl, rate, material, type, description) {
    try {
      const docRef = await addDoc(collection(db, "images"), {
        uid: uid,
        title: name,
        imageUrl: imageUrl,
        rate: rate,
        material: material,
        type: type,
        description: description
      });
      console.log("Image data added with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding image data: ", e);
    }
  }
  
  // Example usage:
  
  document.getElementById("imageForm").addEventListener('submit', (e)=>{
        e.preventDefault();
        const uid = "Rishabh    ";
        const name = document.getElementById("name").value;
        const imageUrl = document.getElementById("imageUrl").value;
        const rate = document.getElementById("rate").value;
        const material = document.getElementById("material").value;
        const type = document.getElementById("type").value;
        const description = document.getElementById("description").value;
    
        // Call function to add image data to Firestore
        addImageData(uid, name, imageUrl, rate, material, type, description);
        document.getElementById("imageForm").reset();
  })
