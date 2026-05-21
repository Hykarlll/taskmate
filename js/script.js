/* ============================================
   TASKMATE UI PROTOTYPE
   IMS566 Individual Project
   NO PROGRAMMING LOGIC - UI ONLY
   ============================================ */

// ==================== GLOBAL VARIABLES ====================
let pieChart = null;
let barChart = null;
let vantaEffect = null;

// ==================== VANTA.JS INITIALIZATION ====================
function initVanta() {
  if (typeof VANTA !== 'undefined' && document.getElementById('vanta-bg')) {
    vantaEffect = VANTA.WAVES({
      el: '#vanta-bg',
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x0d0e1a,
      shininess: 40,
      waveHeight: 18,
      waveSpeed: 0.6,
      zoom: 0.9
    });
  }
}

// ==================== STATIC CHARTS ====================
function initCharts() {
  // Pie Chart
  const pieCtx = document.getElementById('pieChart')?.getContext('2d');
  if (pieCtx) {
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Pending', 'In Progress', 'Completed'],
        datasets: [{
          data: [4, 1, 3],
          backgroundColor: ['rgba(251,191,36,0.75)', 'rgba(99,102,241,0.75)', 'rgba(52,211,153,0.75)'],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', padding: 16, font: { family: 'Inter', size: 11 } }
          }
        },
        responsive: true
      }
    });
  }

  // Bar Chart
  const barCtx = document.getElementById('barChart')?.getContext('2d');
  if (barCtx) {
    if (barChart) barChart.destroy();
    barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['High', 'Medium', 'Low'],
        datasets: [{
          label: 'Number of Tasks',
          data: [3, 3, 2],
          backgroundColor: '#6366f1',
          borderRadius: 6,
          barPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#94a3b8', stepSize: 1 },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          x: {
            ticks: { color: '#94a3b8' },
            grid: { color: 'rgba(255,255,255,0.04)' }
          }
        },
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } }
        }
      }
    });
  }
}

// ==================== PAGE LOADING ====================
async function loadPage(pageName) {
  try {
    const response = await fetch(`pages/${pageName}.html`);
    const html = await response.text();
    document.getElementById('pageContainer').innerHTML = html;
    
    // Re-initialize page-specific content after HTML is loaded
    if (pageName === 'dashboard') {
      setTimeout(() => {
        initCharts();
        const welcomeSpan = document.getElementById('welcomeName');
        if (welcomeSpan) welcomeSpan.textContent = 'User';
      }, 100);
    }
  } catch (error) {
    console.error('Error loading page:', error);
    document.getElementById('pageContainer').innerHTML = '<div class="p-6 text-center text-red-400">Error loading page. Please make sure the pages folder exists with all HTML files.</div>';
  }
}

// ==================== NAVIGATION ====================
function navigate(page) {
  loadPage(page);
  
  // Update active nav link styling
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    link.classList.add('text-slate-400');
  });
  
  const activeLink = document.getElementById(`nav-${page}`);
  if (activeLink) {
    activeLink.classList.add('active');
    activeLink.classList.remove('text-slate-400');
  }
  
  // Update page title
  const titles = {
    dashboard: 'Dashboard',
    mytasks: 'My Tasks',
    completed: 'Completed Tasks',
    calendar: 'Calendar'
  };
  document.getElementById('pageTitle').textContent = titles[page] || 'TaskMate';
  
  // Close sidebar on mobile
  closeSidebar();
}

// ==================== SIDEBAR FUNCTIONS ====================
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

// ==================== AUTHENTICATION (UI ONLY) ====================
function doLogin() {
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value.trim();
  const errorDiv = document.getElementById('loginError');
  
  errorDiv.classList.add('hidden');
  
  if (!username || !password) {
    errorDiv.classList.remove('hidden');
  } else {
    // FAKE SUCCESS - just show the app
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appShell').style.display = 'flex';
    
    // Set user display name
    const displayName = username === 'admin' ? 'Admin User' : username === 'user' ? 'Student User' : 'Demo User';
    const initials = username === 'admin' ? 'AD' : username === 'user' ? 'SU' : 'DU';
    
    document.getElementById('sidebarUsername').textContent = displayName;
    document.getElementById('avatarInitials').textContent = initials;
    
    // Set today's date
    const today = new Date();
    const todayDateElem = document.getElementById('todayDate');
    if (todayDateElem) {
      todayDateElem.textContent = today.toLocaleDateString('en-MY', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
    
    // Load dashboard
    navigate('dashboard');
  }
}

function doLogout() {
  document.getElementById('appShell').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginError').classList.add('hidden');
}

function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('loginForm').classList.toggle('hidden', !isLogin);
  document.getElementById('registerForm').classList.toggle('hidden', isLogin);
  
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  
  if (isLogin) {
    tabLogin.style.background = '#6366f1';
    tabLogin.classList.remove('text-slate-400');
    tabLogin.classList.add('text-white');
    tabRegister.style.background = '';
    tabRegister.classList.remove('text-white');
    tabRegister.classList.add('text-slate-400');
  } else {
    tabRegister.style.background = '#6366f1';
    tabRegister.classList.remove('text-slate-400');
    tabRegister.classList.add('text-white');
    tabLogin.style.background = '';
    tabLogin.classList.remove('text-white');
    tabLogin.classList.add('text-slate-400');
  }
}

function doRegister() {
  alert('✓ Registration UI Demo!\n\nIn a real app, this would create an account.\nFor demo, please login with:\nadmin / task123');
  switchAuthTab('login');
}

// ==================== TASK BUTTONS (UI ONLY) ====================
function openAddModal() {
  document.getElementById('addModalOverlay').classList.remove('hidden');
}

function closeAddModal(event) {
  if (!event || event.target === document.getElementById('addModalOverlay')) {
    document.getElementById('addModalOverlay').classList.add('hidden');
  }
}

function saveTask() {
  alert('✓ UI Prototype: Task would be saved here.\n\nThis is a demonstration of the user interface only.');
  closeAddModal();
}

function openViewModal(taskId) {
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <div class="mb-5 pr-6">
      <div class="flex items-center gap-2 mb-3 flex-wrap">
        <span class="badge-high text-xs px-2.5 py-1 rounded-full">High Priority</span>
        <span class="badge-pending text-xs px-2.5 py-1 rounded-full">Pending</span>
      </div>
      <h3 class="font-poppins font-bold text-white text-xl leading-snug">Sample Task Title</h3>
    </div>
    <p class="text-slate-300 text-sm leading-relaxed mb-6">
      This is a demonstration of the task details modal. In a real application, 
      this would show the actual task description, due date, and other details.
    </p>
    <div class="grid grid-cols-2 gap-3 mb-6">
      <div class="rounded-xl p-3" style="background:#12131f;">
        <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Category</p>
        <p class="text-sm font-medium text-white">📁 University</p>
      </div>
      <div class="rounded-xl p-3" style="background:#12131f;">
        <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Due Date</p>
        <p class="text-sm font-medium text-white">📅 15 June 2025</p>
      </div>
    </div>
    <div class="flex gap-3">
      <button onclick="openEditModal();closeModal();"
              class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style="background:linear-gradient(135deg,#6366f1,#818cf8);">
        <i class="fa-solid fa-pen mr-2"></i>Edit Task
      </button>
      <button onclick="deleteTask()"
              class="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:text-white transition-all"
              style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `;
  document.getElementById('modalOverlay').classList.add('open');
}

function openEditModal() {
  closeModal();
  document.getElementById('addModalTitle').innerHTML = '<i class="fa-solid fa-pen text-indigo-400 mr-2"></i>Edit Task';
  document.getElementById('addModalOverlay').classList.remove('hidden');
}

function deleteTask() {
  if (confirm('Delete this task? (UI Prototype - No actual deletion)')) {
    alert('🗑️ UI Prototype: Task would be deleted here.');
    closeModal();
  }
}

function closeModal(event) {
  if (!event || event.target === document.getElementById('modalOverlay')) {
    document.getElementById('modalOverlay').classList.remove('open');
  }
}

// ==================== CALENDAR FUNCTIONS ====================
function changeCalMonth(direction) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const calLabel = document.getElementById('calMonthLabel');
  if (calLabel) {
    const currentText = calLabel.textContent;
    let currentMonth = 5; // Default June
    for (let i = 0; i < months.length; i++) {
      if (currentText.includes(months[i])) {
        currentMonth = i;
        break;
      }
    }
    let newMonth = currentMonth + direction;
    if (newMonth < 0) newMonth = 11;
    if (newMonth > 11) newMonth = 0;
    calLabel.textContent = `${months[newMonth]} 2025`;
  }
  alert('📅 UI Prototype: Calendar would update with actual task due dates.');
}

// ==================== PAGE LOAD INITIALIZATION ====================
window.addEventListener('DOMContentLoaded', function() {
  initVanta();
  
  const now = new Date();
  document.getElementById('footerYear').textContent = now.getFullYear();
  document.getElementById('footerDate').textContent = now.toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});