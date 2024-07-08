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


// Function to retrieve image data from Firestore
var imageData = [];
var clutter = "";
async function getImageData() {
    const imageContainer = document.getElementById('Container');
    const imagesRef = collection(db, 'images');
    const querySnapshot = await getDocs(imagesRef);
    querySnapshot.forEach((doc) => {
        imageData.push(doc.data());
    });

    return imageData;
}


// Call the function to get the image data
getImageData().then((imageData) => {
    // console.log('Image data:', imageData);
    showTheCards();

}).catch((error) => {
    console.error('Error fetching image data:', error);
});

function showTheCards() {
    // console.log("Entered Show");
    var clutter = "";
    imageData.forEach(function (obj) {
        // console.log(obj);
        clutter += `<div class="box">
        <div class="inner-box">
        <img class="cursor-pointer" src="${obj.imageUrl}" alt="image" onclick="openFullScreen('${obj.imageUrl}', '${obj.title}', '${obj.rate}', '${obj.material}')"  loading="lazy">
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

// Function to filter images based on material type and display them
function filterImagesByMaterial(filterValue) {
    var clutter = "";
    imageData.forEach(function (obj) {
        if (obj.keyword.toLowerCase().includes(filterValue.toLowerCase())) {
            // itemType.includes(filterValue)
            clutter += `<div class="box">
                            <div class="inner-box">
                                <img class="cursor-pointer" src="${obj.imageUrl}" alt="image" onclick="openFullScreen('${obj.imageUrl}', '${obj.title}', '${obj.rate}', '${obj.material}')">
                                <div class="caption">
                                    <div class="profile">Rishabh Sharma</div>
                                    <i onclick="bookmark()" class="ri-bookmark-line"></i>
                                </div>
                            </div>
                        </div>`;
        }
    });

    document.querySelector(".container").innerHTML = clutter;
}

// Event listeners for filter buttons
document.querySelectorAll('.filter-btn').forEach(function (button) {
    button.addEventListener('click', function () {
        // Remove 'active' class from all buttons
        document.querySelectorAll('.filter-btn').forEach(function (btn) {
            btn.classList.remove('active');
        });
        // Add 'active' class to the clicked button
        button.classList.add('active');
        
        // Get the filter value
        const filterValue = button.getAttribute('data-filter');

        // Filter images based on the selected material type
        if (filterValue === 'all') {
            // Show all images
            showTheCards();
        } else {
            // Filter images based on material type
            filterImagesByMaterial(filterValue);
        }
    });
});
