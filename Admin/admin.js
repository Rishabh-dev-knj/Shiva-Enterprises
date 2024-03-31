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

async function addImageData(uid, title, imageUrl, rate, material, Keywords, description) {
    try {
      const docRef = await addDoc(collection(db, "images"), {
        uid: uid,
        title: title,
        imageUrl: imageUrl,
        rate: rate,
        material: material,
        // type: type,
        description: description,
        keyword: Keywords
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
        const title = document.getElementById("title").value;
        const imageUrl = document.getElementById("imageUrl").value;
        const rate = document.getElementById("rate").value;
        const material = document.getElementById("material").value;
        // const type = document.getElementById("type").value;
        const description = document.getElementById("description").value
        const selectedKeywords = document.querySelectorAll('.selected-keywords .keyword');

         const keywordsCount = selectedKeywords.length;

         // Display selected keywords and count
    const selectedKeywordsList = [];
    let keywords ="";
    selectedKeywords.forEach(span => {
        selectedKeywordsList.push(span.querySelector('span').textContent);
        keywords=keywords+" " +span.querySelector('span').textContent;
    });
    console.log("Selected Keywords: ", selectedKeywordsList);
    console.log("Selected: ", keywords);
    // console.log("Keywords Count: ", keywordsCount);

    // Reset form and keyword display
    document.getElementById("imageForm").reset();
    selectedKeywords.innerHTML = "";
      
        // Call function to add image data to Firestore
        addImageData(uid, title, imageUrl, rate, material, keywords, description);
        document.getElementById("imageForm").reset();
  })

  // keyword selecting js------------------------------------
  document.addEventListener('DOMContentLoaded', function() {
    const selectedKeywords = document.getElementById('selectedKeywords');
    const keywordOptions = document.getElementById('keywordOptions');
    const addKeywordBtn = document.getElementById('addKeywordBtn');
    
    addKeywordBtn.addEventListener('click', function() {
      const selectedKeyword = keywordOptions.value;
      if (selectedKeyword) {
        const keywordElement = document.createElement('div');
        keywordElement.classList.add('keyword');
        keywordElement.innerHTML = `
          <span>${selectedKeyword}</span>
          <button>X</button>
        `;
        selectedKeywords.appendChild(keywordElement);
        
        // Remove keyword when X button is clicked
        keywordElement.querySelector('button').addEventListener('click', function() {
          selectedKeywords.removeChild(keywordElement);
        });
      }
    });
  });


