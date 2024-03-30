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
var imageData = [
    {
        name: "Petals of roses", rate:"80", material:"iron",
        image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=3786&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // id: 
    },
    {
        name: "Animals of town", rate:"81", material:"iron",
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "the crowd of city", rate:"82", material:"iron",
        image: "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?q=80&w=3872&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "fruits of planet", rate:"83", material:"iron",
        image: "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?q=80&w=3764&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "orange peeled", rate:"84", material:"iron",
        image: "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=3337&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "web design", rate:"85", material:"iron",
        image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "apple juice", rate:"86", material:"iron",
        image: "https://images.unsplash.com/photo-1576673442511-7e39b6545c87?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Alexander Hipp", rate:"87", material:"iron",
        image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        name: "Omotayo Samuel", rate:"88", material:"iron",
        image: "https://images.pexels.com/photos/18824370/pexels-photo-18824370/free-photo-of-portrait-of-woman-wearing-colorful-outfit.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
    },
    {
        name: "artawkrn", rate:"89", material:"iron",
        image: "https://images.pexels.com/photos/18250922/pexels-photo-18250922/free-photo-of-ornamented-building-corner.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        name: "Don't Know", rate:"90", material:"iron",
        image: "https://images.pexels.com/photos/17542964/pexels-photo-17542964/free-photo-of-girl-with-camera.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load   "
    },
    {
        name: "Purple Flower", rate:"91", material:"iron",
        image: "https://images.pexels.com/photos/17685076/pexels-photo-17685076/free-photo-of-a-field-of-blue-flowers-and-grass-with-a-blue-sky.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
    },
    {
        name: "Candles", rate:"92", material:"iron",
        image: "https://images.pexels.com/photos/16577843/pexels-photo-16577843/free-photo-of-chamomiles-in-vase-and-candle-on-windowsill.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
    },
    {
        name: "Dinner Corner", rate:"93", material:"iron",
        image: "https://images.unsplash.com/photo-1707303822352-2cb2faee9d0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8"
    },
    {
        name: "Nasa Hable Scope", rate:"94", material:"iron",
        image: "https://images.unsplash.com/photo-1707653057692-7669af94b9ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "NEOM", rate:"95", material:"iron",
        image: "https://images.unsplash.com/photo-1682685797795-5640f369a70a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D"
    },
]




// const firebaseApp = initializeApp(firebaseConfig);
// const db = getFirestore(firebaseApp);

// Function to retrieve image data from Firestore
var imageDataNew = [];
var clutter = "";
async function getImageData() {
    const imageContainer = document.getElementById('Container');
    const imagesRef = collection(db, 'images');
    const querySnapshot = await getDocs(imagesRef);
    querySnapshot.forEach((doc) => {
        imageDataNew.push(doc.data());
    });

   

    return imageDataNew;
}


// Call the function to get the image data
getImageData().then((imageDataNew) => {
    console.log('Image data:', imageDataNew);
showTheCards();

}).catch((error) => {
    console.error('Error fetching image data:', error);
});

function showTheCards() {
    console.log("Entered Show");
    var clutter = "";
    imageDataNew.forEach(function (obj) {
        console.log(obj);
        clutter += `<div class="box">
        <div class="inner-box">
        <img class="cursor-pointer" src="${obj.imageUrl}" alt="image" onclick="openFullScreen('${obj.imageUrl}', '${obj.title}', '${obj.rate}', '${obj.material}')">
        <div class="caption">
            <div class="profile">Rishabh Sharma</div>
           <i onclick="bookmark()" class="ri-bookmark-line"></i>
        </div>
        </div>
        
    </div>`;
    })

    document.querySelector(".container")
        .innerHTML = clutter;
}