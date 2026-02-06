import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getFirestore, getDocs, collection } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

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

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

let imageData = [];

async function getImageData() {
    console.log("Fetching images from Firestore...");
    const imagesRef = collection(db, 'images');

    try {
        const querySnapshot = await getDocs(imagesRef);
        imageData = [];
        querySnapshot.forEach((doc) => {
            imageData.push({ id: doc.id, ...doc.data() });
        });
        console.log("Found " + imageData.length + " images.");
        return imageData;
    } catch (error) {
        console.error("Error getting documents: ", error);
        return [];
    }
}


function generateCardHTML(obj) {
    if (!obj || !obj.imageUrl) {
        console.warn("Skipping invalid image object:", obj);
        return "";
    }

    // Sanitize values for inline JS if they exist
    const safeTitle = (obj.title || 'Premium Design').replace(/'/g, "\\'");
    const safeRate = (obj.rate || '').toString().replace(/'/g, "\\'");
    const safeMaterial = (obj.material || '').toString().replace(/'/g, "\\'");
    const safeUrl = obj.imageUrl.replace(/'/g, "\\'");

    const isVideo = obj.type === 'video' || safeUrl.toLowerCase().includes('.mp4');

    const mediaHTML = isVideo
        ? `<video src="${obj.imageUrl}" muted autoplay loop playsinline onerror="this.parentElement.innerHTML='<p style=\'padding:20px; text-align:center; color:var(--text-dim);\'>Video unavailable</p>'"></video>`
        : `<img src="${obj.imageUrl}" alt="${obj.title || 'Metal Work'}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x600?text=Image+Not+Found'">`;

    return `
        <div class="box">
            <div class="inner-box" onclick="openFullScreen('${safeUrl}', '${safeTitle}', '${safeRate}', '${safeMaterial}', '${obj.id}')">
                ${mediaHTML}
                <div class="caption">
                    <div class="profile">${obj.title || 'Premium Design'}</div>
                    <i class="ri-expand-diagonal-line"></i>
                </div>
            </div>
        </div>
    `;
}



function showTheCards(data = imageData) {
    const container = document.getElementById("Rishabhpapa");
    if (!container) {
        console.error("Gallery container #Rishabhpapa not found!");
        return;
    }

    if (data.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-dim);">No images found in your collection.</div>';
        return;
    }

    const clutter = data.map(obj => generateCardHTML(obj)).join('');
    container.innerHTML = clutter;
    window.imageData = data; // Ensure global access for deep-linking
    console.log("Rendered cards to UI.");
}

// Filter logic
function filterImages(filterValue) {
    if (filterValue === 'all') {
        showTheCards(imageData);
        return;
    }

    const filteredData = imageData.filter(obj => {
        if (!obj.keyword) return false;
        const keywords = Array.isArray(obj.keyword) ? obj.keyword : [obj.keyword];
        return keywords.some(kw => kw.toLowerCase().includes(filterValue.toLowerCase()));
    });

    showTheCards(filteredData);
}

// Initialize
getImageData().then(() => {
    showTheCards();
}).catch((error) => {
    console.error('Error fetching image data:', error);
});

// Event listeners
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        filterImages(this.getAttribute('data-filter'));
    });
});

// Global stubs for HTML inline event handlers if any remain
// Global exposure for deep-linking support
window.imageData = imageData;


