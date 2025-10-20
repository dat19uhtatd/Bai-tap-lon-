document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Ngăn tải lại trang

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Danh sách tài khoản mẫu
  const accounts = [
    { email: "admin@gmail.com", password: "123456", role: "Quản trị viên" },
    { email: "sv001", password: "sv001", role: "Sinh viên 1" },
    { email: "sv002", password: "sv002", role: "Sinh viên 2" },
    { email: "user@gmail.com", password: "abc123", role: "Người dùng" },
    {email: "phantiendatka2006@gmail.com", password: "123456", role: "Người dùng"}
  ];

  // Kiểm tra tài khoản
  const found = accounts.find(acc => acc.email === email && acc.password === password);

  if (found) {
    alert("Đăng nhập thành công!\nXin chào " + found.role);

    // Lưu thông tin người dùng tạm thời trong localStorage
    localStorage.setItem("username", found.role);

    // Chuyển sang trang chủ
    window.location.href = "trangchu.html";
  } else {
    alert("Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!");
  }
});

// Ẩn/hiện mật khẩu
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("eyeIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.innerHTML = `
      <path d="M12 6a9.77 9.77 0 018.94 6A9.77 9.77 0 0112 18a9.77 9.77 0 01-8.94-6A9.77 9.77 0 0112 6m0-2C6 4 1.73 7.11 0 12c1.73 4.89 6 8 12 8s10.27-3.11 12-8c-1.73-4.89-6-8-12-8zm0 5a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3z"/>`;
  } else {
    passwordInput.type = "password";
    eyeIcon.innerHTML = `
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17
      c-2.76 0-5-2.24-5-5s2.24-5 5-5
      5 2.24 5 5-2.24 5-5 5z"/>`;
  }
}
