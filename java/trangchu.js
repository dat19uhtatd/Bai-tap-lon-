// ===== DATA STORAGE =====
let scheduleData = {};
let notifications = [];
let assignments = [];

// ===== KHỞI TẠO =====
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    renderSchedule();
    renderNotifications();
    renderAssignments();
    loadUserInfo();
    
    const savedNotification = localStorage.getItem('notificationEnabled');
    if (savedNotification !== null) {
        document.getElementById('notificationToggle').checked = savedNotification === 'true';
    }
});

// ===== LOAD & SAVE DATA =====
function loadData() {
    const savedSchedule = localStorage.getItem('scheduleData');
    const savedNotifications = localStorage.getItem('notifications');
    const savedAssignments = localStorage.getItem('assignments');
    
    if (savedSchedule) scheduleData = JSON.parse(savedSchedule);
    if (savedNotifications) notifications = JSON.parse(savedNotifications);
    if (savedAssignments) assignments = JSON.parse(savedAssignments);
}

function saveData() {
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('assignments', JSON.stringify(assignments));
}

// ===== CHUYỂN TAB =====
function switchMainTab(tabId, element) {
    // Xóa active class khỏi tất cả menu items
    document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
    
    // Thêm active class vào menu item được click
    if (element) {
        element.classList.add('active');
    }

    // Ẩn tất cả tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Hiện tab được chọn
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Cập nhật header
    updateHeader(tabId);
}

// ===== CẬP NHẬT HEADER =====
function updateHeader(tabId) {
    const titleElement = document.getElementById('main-title-text');
    const subtitleElement = document.getElementById('typing-subtitle');
    const addButton = document.getElementById('add-schedule-btn');

    switch (tabId) {
        case 'dashboard':
            // Hiển thị ảnh cho trang chủ
            titleElement.innerHTML = `
                <img src="images/home-icon.png" alt="Trang chủ" style="width:24px; height:auto; vertical-align:middle; margin-right:8px;">
                👋 Hello, I'm Dat!
            `;
            subtitleElement.textContent = 'Welcome to my timetable! 🚀';
            subtitleElement.style.display = 'block';
            addButton.style.display = 'flex';
            break;
        case 'schedule':
            titleElement.innerHTML = '📅 Thời Khóa Biểu';
            subtitleElement.style.display = 'none';
            addButton.style.display = 'flex';
            break;
        case 'assignments':
            // Hiển thị ảnh cho bài tập
            titleElement.innerHTML = `
                <img src="images/homework-icon.png" alt="Bài tập" style="width:24px; height:auto; vertical-align:middle; margin-right:8px;">
                Bài Tập
            `;
            subtitleElement.style.display = 'none';
            break;
        case 'statistics':
            titleElement.innerHTML = '📊 Thống Kê';
            subtitleElement.style.display = 'none';
            break;
        case 'settings':
            titleElement.innerHTML = '⚙️ Cài Đặt';
            subtitleElement.style.display = 'none';
            break;
    }
}
// ===== MODAL =====
function openModal() {
    document.getElementById('addModal').classList.add('active');
}

function closeModal() {
    document.getElementById('addModal').classList.remove('active');
}

// Đóng modal khi click bên ngoài
document.addEventListener('click', function(event) {
    const modal = document.getElementById('addModal');
    if (event.target === modal) {
        closeModal();
    }
});

// ===== THÊM LỊCH HỌC =====
function addClass(event) {
    event.preventDefault();
    
    const day = document.getElementById('classDay').value;
    const time = document.getElementById('classTime').value;
    const subject = document.getElementById('classSubject').value;
    const room = document.getElementById('classRoom').value;
    const teacher = document.getElementById('classTeacher').value;

    const key = `${day}-${time}`;
    
    scheduleData[key] = {
        subject: subject,
        room: room,
        teacher: teacher,
        day: day,
        time: time
    };

    saveData();
    renderSchedule();
    closeModal();
    
    // Reset form
    event.target.reset();
    
    showToast('✓ Đã thêm lịch học thành công!');
}

// ===== RENDER THỜI KHÓA BIỂU =====
function renderSchedule() {
    const scheduleBody = document.getElementById('scheduleBody');
    const times = [
        '07:00 - 08:30',
        '08:45 - 10:15',
        '10:30 - 12:00',
        '13:00 - 14:30',
        '14:45 - 16:15',
        '16:30 - 18:00'
    ];
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

    scheduleBody.innerHTML = '';

    times.forEach(time => {
        const row = document.createElement('tr');
        
        // Cột thời gian
        const timeCell = document.createElement('td');
        timeCell.textContent = time;
        row.appendChild(timeCell);

        // Các cột thứ
        days.forEach(day => {
            const cell = document.createElement('td');
            const key = `${day}-${time}`;
            
            if (scheduleData[key]) {
                const classData = scheduleData[key];
                cell.innerHTML = `
                    <div class="class-cell" onclick="editClass('${key}')">
                        <strong>${classData.subject}</strong>
                        <small><i class="fas fa-door-open"></i> ${classData.room}</small>
                        ${classData.teacher ? `<small><i class="fas fa-user"></i> ${classData.teacher}</small>` : ''}
                        <button class="delete-class-btn" onclick="deleteClass(event, '${key}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            }
            
            row.appendChild(cell);
        });

        scheduleBody.appendChild(row);
    });
}

// ===== XÓA LỊCH HỌC =====
function deleteClass(event, key) {
    event.stopPropagation();
    
    if (confirm('Bạn có chắc chắn muốn xóa lịch học này?')) {
        delete scheduleData[key];
        saveData();
        renderSchedule();
        showToast('✓ Đã xóa lịch học!');
    }
}

// ===== THÊM THÔNG BÁO =====
function addNotification() {
    const title = document.getElementById('notifTitle').value;
    const date = document.getElementById('notifDate').value;

    if (!title || !date) {
        alert('⚠️ Vui lòng điền đầy đủ thông tin!');
        return;
    }

    const notification = {
        id: Date.now(),
        title: title,
        date: date
    };

    notifications.unshift(notification);
    saveData();
    renderNotifications();

    // Reset form
    document.getElementById('notifTitle').value = '';
    document.getElementById('notifDate').value = '';
    
    showToast('✓ Đã thêm thông báo!');
}

// ===== RENDER THÔNG BÁO =====
function renderNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    
    if (notifications.length === 0) {
        notificationsList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 40px;">Chưa có thông báo nào</p>';
        return;
    }

    notificationsList.innerHTML = notifications.map(notif => `
        <div class="notification-card">
            <h4>${notif.title}</h4>
            <p><i class="far fa-calendar"></i> ${formatDate(notif.date)}</p>
            <button onclick="deleteNotification(${notif.id})">
                <i class="fas fa-trash"></i> Xóa
            </button>
        </div>
    `).join('');
}

// ===== XÓA THÔNG BÁO =====
function deleteNotification(id) {
    if (confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
        notifications = notifications.filter(notif => notif.id !== id);
        saveData();
        renderNotifications();
        showToast('✓ Đã xóa thông báo!');
    }
}

// ===== THÊM BÀI TẬP =====
function addAssignment() {
    const subject = document.getElementById('assignSubject').value;
    const title = document.getElementById('assignTitle').value;
    const deadline = document.getElementById('assignDeadline').value;

    if (!subject || !title || !deadline) {
        alert('⚠️ Vui lòng điền đầy đủ thông tin!');
        return;
    }

    const assignment = {
        id: Date.now(),
        subject: subject,
        title: title,
        deadline: deadline,
        completed: false
    };

    assignments.unshift(assignment);
    saveData();
    renderAssignments();

    // Reset form
    document.getElementById('assignSubject').value = '';
    document.getElementById('assignTitle').value = '';
    document.getElementById('assignDeadline').value = '';
    
    showToast('✓ Đã thêm bài tập!');
}

// ===== RENDER BÀI TẬP =====
function renderAssignments() {
    const assignmentsList = document.getElementById('assignmentsList');
    
    if (assignments.length === 0) {
        assignmentsList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 40px;">Chưa có bài tập nào</p>';
        return;
    }

    assignmentsList.innerHTML = assignments.map(assign => `
        <div class="assignment-card ${assign.completed ? 'completed' : ''}">
            <div class="subject"><i class="fas fa-book"></i> ${assign.subject}</div>
            <h4>${assign.title}</h4>
            <div class="deadline">
                <i class="far fa-clock"></i> Hạn: ${formatDate(assign.deadline)}
            </div>
            <div class="actions">
                <button onclick="toggleAssignment(${assign.id})" class="${assign.completed ? 'completed' : ''}">
                    <i class="fas ${assign.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                    ${assign.completed ? 'Đã hoàn thành' : 'Hoàn thành'}
                </button>
                <button class="delete" onclick="deleteAssignment(${assign.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== TOGGLE BÀI TẬP =====
function toggleAssignment(id) {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
        assignment.completed = !assignment.completed;
        saveData();
        renderAssignments();
        showToast(assignment.completed ? '✓ Đã đánh dấu hoàn thành!' : '✓ Đã bỏ đánh dấu!');
    }
}

// ===== XÓA BÀI TẬP =====
function deleteAssignment(id) {
    if (confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
        assignments = assignments.filter(a => a.id !== id);
        saveData();
        renderAssignments();
        showToast('✓ Đã xóa bài tập!');
    }
}

// ===== FORMAT DATE =====
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// ===== SETTINGS =====
function loadUserInfo() {
    const userInfo = {
        name: localStorage.getItem('userName') || 'Đạt Phan Tiến',
        email: localStorage.getItem('userEmail') || 'dat241230701@lms.utc.edu.vn',
        role: localStorage.getItem('userRole') || 'Sinh viên'
    };

    document.getElementById('userName').textContent = userInfo.name;
    document.getElementById('userEmail').textContent = userInfo.email;

    const firstLetter = userInfo.name.charAt(0).toUpperCase();
    document.getElementById('userAvatar').textContent = firstLetter;
}

function toggleNotificationSetting() {
    const toggle = document.getElementById('notificationToggle');
    const isEnabled = toggle.checked;
    localStorage.setItem('notificationEnabled', isEnabled);

    const message = isEnabled ? '✓ Đã bật thông báo' : '✓ Đã tắt thông báo';
    showToast(message);
}

function changeLanguage() {
    const languages = ['🇻🇳 Tiếng Việt', '🇬🇧 English', '🇨🇳 中文'];
    const choice = prompt('Chọn ngôn ngữ:\n1. ' + languages[0] + '\n2. ' + languages[1] + '\n3. ' + languages[2]);

    if (choice) {
        const selectedLang = languages[parseInt(choice) - 1];
        if (selectedLang) {
            localStorage.setItem('language', selectedLang);
            showToast('✓ Đã chọn: ' + selectedLang);
        }
    }
}

function showAbout() {
    alert('📱 Ứng dụng Quản lý Học tập\n\n' +
        '✨ Phiên bản: 1.0.7\n' +
        '📅 Năm phát hành: 2025\n' +
        '🏫 Trường: UTC\n' +
        '👨‍💻 Phát triển bởi: Đạt Phan Tiến\n\n' +
        '© 2025 All rights reserved');
}

function showTerms() {
    alert('📋 Điều khoản sử dụng và Chính sách bảo mật\n\n' +
        '1. Bảo mật thông tin cá nhân\n' +
        '2. Sử dụng dữ liệu hợp pháp\n' +
        '3. Tuân thủ quy định nhà trường\n' +
        '4. Không chia sẻ thông tin cho bên thứ ba\n\n' +
        'Vui lòng đọc kỹ trước khi sử dụng ứng dụng.');
}

function logoutFromSettings() {
    if (confirm('🚪 Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isLoggedIn');

        showToast('✓ Đã đăng xuất thành công!');

        setTimeout(() => {
            window.location.href = 'dangnhap.html';
        }, 1500);
    }
}

function setUserInfo(name, email, role) {
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
    localStorage.setItem('isLoggedIn', 'true');
    loadUserInfo();
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ===== DATA MẪU (TÙY CHỌN) =====
function loadSampleData() {
    if (Object.keys(scheduleData).length === 0) {
        scheduleData = {
            'Thứ 2-07:00 - 08:30': {
                subject: 'Toán cao cấp',
                room: 'A101',
                teacher: 'TS. Nguyễn Văn A',
                day: 'Thứ 2',
                time: '07:00 - 08:30'
            },
            'Thứ 2-08:45 - 10:15': {
                subject: 'Lập trình Web',
                room: 'B205',
                teacher: 'ThS. Trần Thị B',
                day: 'Thứ 2',
                time: '08:45 - 10:15'
            },
            'Thứ 3-07:00 - 08:30': {
                subject: 'Cơ sở dữ liệu',
                room: 'C301',
                teacher: 'PGS.TS. Lê Văn C',
                day: 'Thứ 3',
                time: '07:00 - 08:30'
            }
        };
    }

    if (notifications.length === 0) {
        notifications = [
            {
                id: Date.now(),
                title: 'Họp lớp quan trọng',
                date: '2025-10-25'
            },
            {
                id: Date.now() + 1,
                title: 'Nộp báo cáo cuối kỳ',
                date: '2025-10-30'
            }
        ];
    }

    if (assignments.length === 0) {
        assignments = [
            {
                id: Date.now(),
                subject: 'Lập trình Web',
                title: 'Bài tập tuần 5 - Tạo form đăng ký',
                deadline: '2025-10-22',
                completed: false
            },
            {
                id: Date.now() + 1,
                subject: 'Cơ sở dữ liệu',
                title: 'Thiết kế ERD cho hệ thống',
                deadline: '2025-10-25',
                completed: false
            }
        ];
    }

    saveData();
    renderSchedule();
    renderNotifications();
    renderAssignments();
}

// Uncomment dòng dưới nếu muốn load data mẫu khi chạy lần đầu
// loadSampleData();