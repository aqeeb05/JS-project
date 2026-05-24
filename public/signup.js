const signupForm = document.getElementById('signupForm');
const showPwdCheckbox = document.getElementById('showPwdCheckbox');

// 1. Toggle Visibility Logic
showPwdCheckbox.addEventListener('change', function() {
    // We select the fields INSIDE the listener to make sure we get them
    const pwdFields = document.querySelectorAll('.pwd-field');
    const type = this.checked ? 'text' : 'password';
    
    pwdFields.forEach(field => {
        field.type = type;
    });
});

// 2. Form Submission & Validation
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('signupMessage');

    // Frontend Check: Do passwords match?
    if (password !== confirmPassword) {
        message.style.color = "red";
        message.textContent = "Passwords do not match!";
        return; 
    }

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = data.message;
            signupForm.reset(); // Clears the form after success
        } else {
            message.style.color = "red";
            message.textContent = data.message;
        }
    } catch (error) {
        message.style.color = "red";
        message.textContent = "Error connecting to server.";
    }
});