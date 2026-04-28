document.addEventListener('DOMContentLoaded', () => {
    const isAuth = sessionStorage.getItem('isAuthenticated');
    const firstName = sessionStorage.getItem('firstName');
    
    //if login hide form show Hi, User
    if (isAuth === 'true') {
        document.getElementById('loginFormContainer').style.display = 'none';
        document.getElementById('loggedInContainer').style.display = 'block';
        document.getElementById('greetingText').textContent = `Hi, ${firstName || 'Admin'}`;
    }

    //Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            sessionStorage.clear();
            window.location.reload();
        };
    }

    // Login
    const loginForm = document.getElementById('loginFormContainer');
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const username = document.getElementById('emailInput').value.trim();
            const password = document.getElementById('passwordInput').value.trim();

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const result = await response.json();

                if (response.ok && result.success) {
                    sessionStorage.setItem('isAuthenticated', 'true');
                    sessionStorage.setItem('userRole', result.role);
                    sessionStorage.setItem('firstName', result.firstName);

                    Swal.fire({ icon: 'success', title: 'Welcome!', timer: 1500, showConfirmButton: false })
                    .then(() => window.location.href = 'home.html');
                } else {
                    Swal.fire({ icon: 'error', title: 'Login Failed', text: result.message });
                }
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Server connection failed.' });
            }
        };
    }
});