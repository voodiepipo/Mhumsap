const API_BASE = 'http://localhost:3000/api';

let pendingFormData = null;

/* ----------------------------------------------------------
   Live image URL preview
   ---------------------------------------------------------- */
document.getElementById('addImageUrl').addEventListener('input', function () {
  const preview = document.getElementById('addImagePreview');
  const url     = this.value.trim();
  if (url) {
    preview.src = url;
    preview.classList.remove('placeholder-img');
    preview.onerror = () => {
      preview.src = '../images/placeholder-upload.png';
      preview.classList.add('placeholder-img');
    };
  } else {
    preview.src = '../images/placeholder-upload.png';
    preview.classList.add('placeholder-img');
  }
});

/* ----------------------------------------------------------
   Form submit → validate → show confirmation popup
   ---------------------------------------------------------- */
document.getElementById('addProductForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name   = document.getElementById('addName').value.trim();
  const price  = parseFloat(document.getElementById('addPrice').value);
  const stock  = document.getElementById('addStock').value;
  const rating = document.getElementById('addRating').value;

  // Validate
  if (!name) {
    alert('Product name is required.');
    document.getElementById('addName').focus();
    return;
  }
  if (isNaN(price) || price < 0) {
    alert('Please enter a valid price (0 or greater).');
    document.getElementById('addPrice').focus();
    return;
  }
  if (stock !== '' && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
    alert('Stock must be a non-negative whole number.');
    document.getElementById('addStock').focus();
    return;
  }
  if (rating !== '' && (isNaN(parseFloat(rating)) || parseFloat(rating) < 0 || parseFloat(rating) > 5)) {
    alert('Rating must be between 0 and 5.');
    document.getElementById('addRating').focus();
    return;
  }

  // Stage data
  pendingFormData = {
    name,
    price,
    category:    document.getElementById('addCategory').value || 'Other',
    image_url:   document.getElementById('addImageUrl').value.trim()     || null,
    description: document.getElementById('addDescription').value.trim()  || null,
    stock:       stock  !== '' ? parseInt(stock)    : 0,
    rating:      rating !== '' ? parseFloat(rating) : null,
  };

  // Show popup
  document.getElementById('savePopup').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('confirmSaveBtn').focus();
});

/* ----------------------------------------------------------
   Popup: Close
   ---------------------------------------------------------- */
function closeSavePopup() {
  document.getElementById('savePopup').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('closeSavePopup').addEventListener('click', closeSavePopup);
document.getElementById('cancelSaveBtn').addEventListener('click',  closeSavePopup);
document.getElementById('savePopup').addEventListener('click', function (e) {
  if (e.target === this) closeSavePopup();
});

/* ----------------------------------------------------------
   Popup: Confirm → POST /api/products
   ---------------------------------------------------------- */
document.getElementById('confirmSaveBtn').addEventListener('click', async function () {
  if (!pendingFormData) return;

  const btn = this;
  btn.disabled    = true;
  btn.textContent = 'Saving…';

  try {
    const res = await fetch(`${API_BASE}/products`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(pendingFormData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error ${res.status}`);
    }

    window.location.href = 'products.html';

  } catch (err) {
    closeSavePopup();
    alert(`Failed to save product:\n${err.message}\n\nMake sure the server is running.`);
    console.error('add-product.js error:', err);
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Yes, Save';
    pendingFormData = null;
  }
});

/* ----------------------------------------------------------
   Keyboard: Escape closes popup
   ---------------------------------------------------------- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('savePopup').classList.contains('active')) {
    closeSavePopup();
  }
});
