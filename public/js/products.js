/* ==========================================================
   products.js — Admin Product Management
   Full CRUD: load table, search, edit modal (PUT), delete popup (DELETE)
   Fields: name, category, price, stock, rating, image_url, description
   ========================================================== */

const API_BASE = 'http://localhost:3000/api';

let allProducts    = [];
let deleteTargetId = null;

/* ----------------------------------------------------------
   UTILITY: Stock badge HTML
   ---------------------------------------------------------- */
function stockBadge(stock) {
  const s = parseInt(stock) || 0;
  if (s === 0)  return `<span class="stock-badge no-stock">Out of stock</span>`;
  if (s <= 5)   return `<span class="stock-badge low-stock">${s} left</span>`;
  return              `<span class="stock-badge in-stock">${s}</span>`;
}

/* ----------------------------------------------------------
   UTILITY: Rating star display
   ---------------------------------------------------------- */
function ratingStars(rating) {
  if (rating === null || rating === undefined || rating === '') return '<span style="color:#ccc">—</span>';
  const r = parseFloat(rating);
  return `<span class="rating-star">★</span><span>${r.toFixed(1)}</span>`;
}

/* ----------------------------------------------------------
   UTILITY: Toast notification
   ---------------------------------------------------------- */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;

  Object.assign(toast.style, {
    position:     'fixed',
    bottom:       '28px',
    right:        '28px',
    background:   type === 'success' ? '#2e7d32' : '#c62828',
    color:        '#fff',
    padding:      '12px 22px',
    borderRadius: '10px',
    fontSize:     '14px',
    fontWeight:   '600',
    zIndex:       '9999',
    boxShadow:    '0 6px 20px rgba(0,0,0,0.22)',
    animation:    'toastIn 0.25s ease',
  });

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/* ----------------------------------------------------------
   LOAD: fetch all products → render table
   ---------------------------------------------------------- */
async function loadProducts() {
  const loading = document.getElementById('tableLoading');
  const table   = document.getElementById('productTable');
  const empty   = document.getElementById('tableEmpty');

  loading.style.display = 'flex';
  table.style.display   = 'none';
  empty.style.display   = 'none';

  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    allProducts = await res.json();

    loading.style.display = 'none';
    table.style.display   = 'table';
    renderRows(allProducts);
  } catch (err) {
    loading.style.display = 'none';
    table.style.display   = 'table';
    document.getElementById('productTableBody').innerHTML = `
      <tr>
        <td colspan="6" class="table-empty" style="color:#c62828">
          ⚠️ Failed to load products. Is the server running at <code>${API_BASE}</code>?
        </td>
      </tr>`;
    console.error('loadProducts error:', err);
  }
}

/* ----------------------------------------------------------
   RENDER: build table rows from a product array
   ---------------------------------------------------------- */
function renderRows(products) {
  const tbody = document.getElementById('productTableBody');
  const empty = document.getElementById('tableEmpty');
  tbody.innerHTML = '';

  if (products.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  products.forEach(p => {
    const tr       = document.createElement('tr');
    const imgSrc   = p.image_url || '../images/placeholder-upload.png';
    const nameDesc = p.description
      ? p.description.substring(0, 55) + (p.description.length > 55 ? '…' : '')
      : '—';

    tr.innerHTML = `
      <td>
        <img class="table-product-img"
          src="${imgSrc}" alt="${p.name}" loading="lazy"
          onerror="this.src='../images/placeholder-upload.png'">
      </td>
      <td>
        <div class="product-name-cell">${p.name}</div>
        <div class="product-desc-cell">${nameDesc}</div>
        <div class="rating-cell">${ratingStars(p.rating)}</div>
      </td>
      <td><span class="category-badge">${p.category || '—'}</span></td>
      <td class="price-cell">${Number(p.price).toFixed(2)} THB</td>
      <td class="col-stock">${stockBadge(p.stock)}</td>
      <td>
        <div class="action-btns">
          <button class="btn-edit"   data-id="${p.id}" title="Edit ${p.name}"   aria-label="Edit ${p.name}">
            <img src="../images/icons/edit.svg"   alt="Edit">
          </button>
          <button class="btn-delete" data-id="${p.id}" title="Delete ${p.name}" aria-label="Delete ${p.name}">
            <img src="../images/icons/delete.svg" alt="Delete">
          </button>
        </div>
      </td>`;

    tbody.appendChild(tr);
  });

  // Attach button events
  tbody.querySelectorAll('.btn-edit').forEach(btn =>
    btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id)))
  );
  tbody.querySelectorAll('.btn-delete').forEach(btn =>
    btn.addEventListener('click', () => openDeletePopup(parseInt(btn.dataset.id)))
  );
}

/* ----------------------------------------------------------
   SEARCH: real-time filter
   ---------------------------------------------------------- */
document.getElementById('searchInput').addEventListener('input', function () {
  const q = this.value.trim().toLowerCase();
  if (!q) { renderRows(allProducts); return; }
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.category    || '').toLowerCase().includes(q) ||
    (p.description || '').toLowerCase().includes(q)
  );
  renderRows(filtered);
});

/* ----------------------------------------------------------
   EDIT MODAL — open and pre-fill all fields
   ---------------------------------------------------------- */
function openEditModal(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;

  document.getElementById('editProductId').value    = product.id;
  document.getElementById('editName').value         = product.name;
  document.getElementById('editCategory').value     = product.category || 'Other';
  document.getElementById('editPrice').value        = product.price;
  document.getElementById('editStock').value        = product.stock  ?? 0;
  document.getElementById('editRating').value       = product.rating ?? '';
  document.getElementById('editImageUrl').value     = product.image_url   || '';
  document.getElementById('editDescription').value  = product.description || '';

  // Image preview
  const preview = document.getElementById('editImagePreview');
  if (product.image_url) {
    preview.src = product.image_url;
    preview.classList.remove('placeholder-img');
  } else {
    preview.src = '../images/placeholder-upload.png';
    preview.classList.add('placeholder-img');
  }

  document.getElementById('editModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('editName').focus();
}

function closeEditModal() {
  document.getElementById('editModal').classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('editProductForm').reset();
  const preview = document.getElementById('editImagePreview');
  preview.src = '../images/placeholder-upload.png';
  preview.classList.add('placeholder-img');
}

document.getElementById('closeEditModal').addEventListener('click', closeEditModal);
document.getElementById('cancelEditBtn').addEventListener('click', closeEditModal);
document.getElementById('editModal').addEventListener('click', function (e) {
  if (e.target === this) closeEditModal();
});

// Live image URL preview
document.getElementById('editImageUrl').addEventListener('input', function () {
  const preview = document.getElementById('editImagePreview');
  if (this.value.trim()) {
    preview.src = this.value.trim();
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
   EDIT MODAL — submit (PUT /api/products/:id)
   ---------------------------------------------------------- */
document.getElementById('editProductForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const id     = document.getElementById('editProductId').value;
  const name   = document.getElementById('editName').value.trim();
  const price  = parseFloat(document.getElementById('editPrice').value);
  const stock  = document.getElementById('editStock').value;
  const rating = document.getElementById('editRating').value;

  if (!name)             { alert('Product name is required.'); document.getElementById('editName').focus();  return; }
  if (isNaN(price) || price < 0) { alert('Please enter a valid price.'); document.getElementById('editPrice').focus(); return; }

  const payload = {
    name,
    price,
    category:    document.getElementById('editCategory').value,
    image_url:   document.getElementById('editImageUrl').value.trim()    || null,
    description: document.getElementById('editDescription').value.trim() || null,
    stock:       stock  !== '' ? parseInt(stock)    : 0,
    rating:      rating !== '' ? parseFloat(rating) : null,
  };

  const btn = document.getElementById('editSubmitBtn');
  btn.disabled    = true;
  btn.textContent = 'Saving…';

  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error ${res.status}`);
    }
    closeEditModal();
    await loadProducts();
    showToast('✓ Product updated successfully!', 'success');
  } catch (err) {
    showToast(`✗ ${err.message}`, 'error');
    console.error('Edit error:', err);
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Save Changes';
  }
});

/* ----------------------------------------------------------
   DELETE POPUP — open / close
   ---------------------------------------------------------- */
function openDeletePopup(id) {
  deleteTargetId = id;
  document.getElementById('deletePopup').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('confirmDeleteBtn').focus();
}

function closeDeletePopup() {
  deleteTargetId = null;
  document.getElementById('deletePopup').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('closeDeletePopup').addEventListener('click', closeDeletePopup);
document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeletePopup);
document.getElementById('deletePopup').addEventListener('click', function (e) {
  if (e.target === this) closeDeletePopup();
});

/* ----------------------------------------------------------
   DELETE POPUP — confirm (DELETE /api/products/:id)
   ---------------------------------------------------------- */
document.getElementById('confirmDeleteBtn').addEventListener('click', async function () {
  if (!deleteTargetId) return;

  const btn = this;
  btn.disabled    = true;
  btn.textContent = 'Deleting…';

  try {
    const res = await fetch(`${API_BASE}/products/${deleteTargetId}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server error ${res.status}`);
    }
    closeDeletePopup();
    await loadProducts();
    showToast('✓ Product deleted.', 'success');
  } catch (err) {
    showToast(`✗ ${err.message}`, 'error');
    console.error('Delete error:', err);
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Yes, Delete';
  }
});

/* ----------------------------------------------------------
   Keyboard: Escape closes any open overlay
   ---------------------------------------------------------- */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (document.getElementById('editModal').classList.contains('active'))   closeEditModal();
  if (document.getElementById('deletePopup').classList.contains('active')) closeDeletePopup();
});

/* ----------------------------------------------------------
   Initialize
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', loadProducts);
