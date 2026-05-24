const loginForm = document.getElementById('loginForm');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const message = document.getElementById('message');

// 1. Show/Hide Password Toggle Logic
if (togglePassword) {
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : 'hide';
    });
}

// 2. Login Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Login button clicked...");

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log("Data received from server:", data);

        if (response.ok) {
            console.log("Login OK! Saving to storage...");
            
            // We use optional chaining (?.) so the code doesn't crash if data.user is missing
            localStorage.setItem('firstName', data.user?.firstName || "User");
            localStorage.setItem('lastName', data.user?.lastName || "");
            localStorage.setItem('username', data.user?.username || "");
            localStorage.setItem('email', data.user?.email || email);

            message.style.color = "green";
            message.textContent = "Redirecting...";

            // FORCE REDIRECT
            window.location.href = 'dashboard.html';
        } else {
            message.style.color = "red";
            message.textContent = data.message;
        }
    } catch (error) {
        console.error("CRITICAL ERROR:", error);
        message.textContent = "Server Connection Error";
    }
});