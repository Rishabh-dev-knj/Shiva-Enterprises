import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { getFirestore, getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js';

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
const storage = getStorage(firebaseApp);

let allImages = [];

// --- Collection Management ---

async function fetchManagedImages() {
  const galleryContainer = document.getElementById('admin-gallery');
  try {
    const querySnapshot = await getDocs(collection(db, "images"));
    allImages = [];
    querySnapshot.forEach((doc) => {
      allImages.push({ id: doc.id, ...doc.data() });
    });
    renderManagedImages(allImages);
  } catch (e) {
    console.error("Error fetching images: ", e);
    galleryContainer.innerHTML = '<div class="error-state">Failed to load inventory.</div>';
  }
}

function renderManagedImages(data) {
  const container = document.getElementById('admin-gallery');
  if (data.length === 0) {
    container.innerHTML = '<div class="empty-state">No designs found matching your criteria.</div>';
    return;
  }

  container.innerHTML = data.map(item => `
        <div class="admin-card" data-id="${item.id}">
            <img src="${item.imageUrl}" class="card-image" alt="${item.title}" loading="lazy">
            <div class="card-info">
                <h3>${item.title || 'Untitled'}</h3>
                <p>Material: ${item.material || 'N/A'}</p>
                <p>Rate: ${item.rate || 'N/A'}</p>
            </div>
            <div class="card-actions">
                <button class="edit-btn" onclick="openEditModal('${item.id}')">
                    <i class="ri-edit-line"></i> Edit
                </button>
                <button class="delete-btn" onclick="deleteImage('${item.id}')">
                    <i class="ri-delete-bin-line"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Global exposure for the delete and edit functions
window.deleteImage = async (id) => {
  if (!confirm("Are you sure you want to delete this design permanently?")) return;

  try {
    await deleteDoc(doc(db, "images", id));
    alert("Design deleted successfully.");
    fetchManagedImages(); // Refresh
  } catch (e) {
    console.error("Delete failed: ", e);
    alert("Error deleting image.");
  }
};

window.openEditModal = (id) => {
  const item = allImages.find(img => img.id === id);
  if (!item) return;

  document.getElementById('edit-id').value = id;
  document.getElementById('edit-title').value = item.title || "";
  document.getElementById('edit-rate').value = item.rate || "";
  document.getElementById('edit-material').value = item.material || "";

  // Clear and populate keywords
  const editKeywordsDiv = document.getElementById('edit-selectedKeywords');
  editKeywordsDiv.innerHTML = "";
  const keywords = Array.isArray(item.keyword) ? item.keyword : [item.keyword];
  keywords.forEach(kw => {
    if (!kw) return;
    const chip = document.createElement('div');
    chip.className = 'keyword';
    chip.innerHTML = `<span>${kw}</span><button type="button" onclick="this.parentElement.remove()">&times;</button>`;
    editKeywordsDiv.appendChild(chip);
  });

  document.getElementById('editModal').style.display = "flex";
};

window.closeEditModal = () => {
  document.getElementById('editModal').style.display = "none";
};

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const btn = e.target.querySelector('.submit-btn');
  btn.disabled = true;
  btn.textContent = "Saving...";

  try {
    const title = document.getElementById('edit-title').value;
    const rate = document.getElementById('edit-rate').value;
    const material = document.getElementById('edit-material').value;
    const keywords = Array.from(document.getElementById('edit-selectedKeywords').querySelectorAll('.keyword span')).map(s => s.textContent);

    await updateDoc(doc(db, "images", id), {
      title, rate, material,
      keyword: keywords
    });

    alert("Changes saved successfully!");
    closeEditModal();
    fetchManagedImages();
  } catch (err) {
    alert("Failed to update: " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Save Changes";
  }
});

// Edit Keyword Adder
document.getElementById('edit-addKeywordBtn').addEventListener('click', () => {
  const val = document.getElementById('edit-keywordOptions').value;
  const div = document.getElementById('edit-selectedKeywords');
  const existing = Array.from(div.querySelectorAll('span')).map(s => s.textContent);

  if (val && !existing.includes(val)) {
    const chip = document.createElement('div');
    chip.className = 'keyword';
    chip.innerHTML = `<span>${val}</span><button type="button" onclick="this.parentElement.remove()">&times;</button>`;
    div.appendChild(chip);
  }
});

// Search & Filter Logic
function applyFilters() {
  const searchTerm = document.getElementById('adminSearch').value.toLowerCase();
  const filterValue = document.getElementById('adminFilter').value;

  const filtered = allImages.filter(item => {
    const titleMatch = (item.title || '').toLowerCase().includes(searchTerm);
    let categoryMatch = true;

    if (filterValue !== 'all') {
      const keywords = Array.isArray(item.keyword) ? item.keyword : [item.keyword];
      categoryMatch = keywords.some(kw => kw && kw.toLowerCase().includes(filterValue.toLowerCase()));
    }

    return titleMatch && categoryMatch;
  });

  renderManagedImages(filtered);
}

document.getElementById('adminSearch').addEventListener('input', applyFilters);
document.getElementById('adminFilter').addEventListener('change', applyFilters);

// --- Upload Management ---

const selectedKeywordsDiv = document.getElementById('selectedKeywords');
const keywordOptions = document.getElementById('keywordOptions');
const addKeywordBtn = document.getElementById('addKeywordBtn');
const fileInput = document.getElementById('imageUpload');
const previewContainer = document.getElementById('file-list-preview');

let selectedFiles = [];

addKeywordBtn.addEventListener('click', () => {
  const val = keywordOptions.value;
  const existing = Array.from(selectedKeywordsDiv.querySelectorAll('span')).map(s => s.textContent);

  if (val && !existing.includes(val)) {
    const chip = document.createElement('div');
    chip.className = 'keyword';
    chip.innerHTML = `<span>${val}</span><button type="button" onclick="this.parentElement.remove()">&times;</button>`;
    selectedKeywordsDiv.appendChild(chip);
  }
});

// Update previews when files are selected
fileInput.addEventListener('change', async (e) => {
  const files = Array.from(e.target.files);
  selectedFiles = [];
  previewContainer.innerHTML = '';

  for (const file of files) {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      alert(`File ${file.name} is not a supported image or video.`);
      continue;
    }

    if (isVideo) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 15.5) {
          alert(`Video ${file.name} is longer than 15 seconds. Please trim it.`);
        } else {
          addFileToPreview(file, true);
        }
      }
      video.src = URL.createObjectURL(file);
    } else {
      addFileToPreview(file, false);
    }
  }
});

function addFileToPreview(file, isVideo) {
  selectedFiles.push(file);
  const reader = new FileReader();
  reader.onload = (e) => {
    const div = document.createElement('div');
    div.className = 'preview-item';
    if (isVideo) {
      div.innerHTML = `<video src="${e.target.result}" muted></video><button type="button" class="remove-preview" onclick="removeSelectedFile('${file.name}')">&times;</button>`;
    } else {
      div.innerHTML = `<img src="${e.target.result}" alt="Preview"><button type="button" class="remove-preview" onclick="removeSelectedFile('${file.name}')">&times;</button>`;
    }
    previewContainer.appendChild(div);
  };
  reader.readAsDataURL(file);
}

window.removeSelectedFile = (name) => {
  selectedFiles = selectedFiles.filter(f => f.name !== name);
  previewContainer.innerHTML = '';
  selectedFiles.forEach(f => {
    const isVideo = f.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.className = 'preview-item';
      div.innerHTML = isVideo
        ? `<video src="${e.target.result}" muted></video><button type="button" class="remove-preview" onclick="removeSelectedFile('${f.name}')">&times;</button>`
        : `<img src="${e.target.result}" alt="Preview"><button type="button" class="remove-preview" onclick="removeSelectedFile('${f.name}')">&times;</button>`;
      previewContainer.appendChild(div);
    };
    reader.readAsDataURL(f);
  });
};

document.getElementById('imageForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('.submit-btn');
  const manualUrl = document.getElementById('imageUrl').value;

  if (selectedFiles.length === 0 && !manualUrl) {
    alert("Please select files or provide a URL.");
    return;
  }

  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = "Uploading...";

  try {
    const title = document.getElementById('title').value;
    const rate = document.getElementById('rate').value;
    const material = document.getElementById('material').value;
    const keywords = Array.from(selectedKeywordsDiv.querySelectorAll('.keyword span')).map(s => s.textContent);

    // Handle Manual URL
    if (manualUrl && selectedFiles.length === 0) {
      await addDoc(collection(db, "images"), {
        title, rate, material,
        imageUrl: manualUrl,
        keyword: keywords,
        type: 'image',
        timestamp: Date.now()
      });
    }

    // Handle Bulk Files
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      btn.textContent = `Uploading ${i + 1}/${selectedFiles.length}...`;

      const storageRef = ref(storage, `designs/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytesResumable(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, "images"), {
        title: selectedFiles.length > 1 ? `${title} (${i + 1})` : title,
        rate, material,
        imageUrl: downloadUrl,
        keyword: keywords,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        timestamp: Date.now()
      });
    }

    alert(`Successfully published ${selectedFiles.length || 1} designs!`);
    e.target.reset();
    selectedFiles = [];
    previewContainer.innerHTML = "";
    selectedKeywordsDiv.innerHTML = "";
    fetchManagedImages();
  } catch (err) {
    alert("Upload error: " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

// Initialize
fetchManagedImages();

