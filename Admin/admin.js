import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getFirestore, getDocs, collection, addDoc, orderBy, query, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js';
// import { getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js';



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
const storage = getStorage(firebaseApp);

async function addImageData(uid, title, imageUrl, rate, material, Keywords) {
    try {
      const docRef = await addDoc(collection(db, "images"), {
        uid: uid,
        title: title,
        imageUrl: imageUrl,
        rate: rate,
        material: material,
        // type: type,
        // description: description,
        keyword: Keywords
      });
      console.log("Image data added with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding image data: ", e);
    }
  }
  
  // Example usage:
  document.getElementById("imageForm").addEventListener('submit', async (e) => {
    e.preventDefault();
    const uid = "Rishabh";
    const title = document.getElementById("title").value;
    const rate = document.getElementById("rate").value;
    const material = document.getElementById("material").value;
    const description = document.getElementById("description").value;
    const selectedKeywords = document.querySelectorAll('.selected-keywords .keyword');

    // Check if URL or image upload is provided
    const imageUrl = document.getElementById("imageUrl").value;
    const imageFile = document.getElementById('imageUpload').files[0];

    if (imageUrl && !imageFile) {
        // If URL is provided, directly add image data to Firestore
        const keywords = getSelectedKeywords(selectedKeywords);
        addImageData(uid, title, imageUrl, rate, material, keywords);
        document.getElementById("imageForm").reset();
    } else if (imageFile && !imageUrl) {
        // If image file is uploaded, upload it to storage and then add image data to Firestore
        const keywords = getSelectedKeywords(selectedKeywords);
        const downloadURL = await uploadImageAndGetData(imageFile, selectedKeywords);
        addImageData(uid, title, downloadURL, rate, material, keywords);
        document.getElementById("imageForm").reset();
    } else {
        alert('Please provide either an image URL or upload an image file.');
    }
});

// Function to upload image to storage and get download URL
async function uploadImageAndGetData(imageFile, selectedKeywords) {
    const storageRef = ref(storage, 'images/' + imageFile.name);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    
    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                // Handle progress
            },
            (error) => {
                console.error('Error uploading image:', error);
                reject(error);
            },
            async () => {
                // Image uploaded successfully, get download URL
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
            }
        );
    });
}

// Function to get selected keywords as a comma-separated string
function getSelectedKeywords(selectedKeywords) {
    const selectedKeywordsList = Array.from(selectedKeywords).map(span => span.querySelector('span').textContent);
    return selectedKeywordsList.join(', ');
}



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

   
// checking and error other data in corresponding fields=====================

  document.getElementById("imageUrl").addEventListener('input', function() {
    const imageUrl = this.value;
    const imageUpload = document.getElementById('imageUpload');

    // If URL is filled, clear the image upload field
    if (imageUrl) {
        imageUpload.value = '';
    }
});

document.getElementById("imageUpload").addEventListener('change', function() {
    const imageUpload = this;
    const imageUrl = document.getElementById('imageUrl');

    // If an image is uploaded, clear the URL field
    if (imageUpload.files && imageUpload.files[0]) {
        imageUrl.value = '';
    }
});