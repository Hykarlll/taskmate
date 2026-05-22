/* ============================================
   TASKMATE UI PROTOTYPE
   IMS566 Individual Project
   ============================================ */

function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  const currentPage = window.location.pathname.split('/').pop();
  if (!isLoggedIn && currentPage !== 'index.html') {
    window.location.href = 'index.html';
  }
}

function logout() {
  sessionStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('username');
  window.location.href = 'index.html';
}

// Add Task Modal - shows form
function openAddModal() {
  const modal = document.getElementById('addModalOverlay');
  if (modal) modal.classList.remove('hidden');
}

function closeAddModal(event) {
  if (!event || event.target === document.getElementById('addModalOverlay')) {
    const modal = document.getElementById('addModalOverlay');
    if (modal) modal.classList.add('hidden');
  }
}

function saveTask() {
  closeAddModal();
}

// Other buttons do nothing (UI only)
function openViewModal(taskId) { return false; }
function openEditModal() { return false; }
function deleteTask() { return false; }
function changeCalMonth(direction) { return false; }
function closeModal(event) { return false; }

document.addEventListener('DOMContentLoaded', function() {
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage !== 'index.html') {
    checkAuth();
  }
});

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
}
