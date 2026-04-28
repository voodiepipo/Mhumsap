document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupFormContainer');
    
    if (signupForm) {
      signupForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 
  
        //get data from screen
        const fname = document.getElementById('fNameInput').value.trim();
        const lname = document.getElementById('lNameInput').value.trim();
        const email = document.getElementById('signupEmailInput').value.trim();
        const username = document.getElementById('signupUsernameInput').value.trim();
        const pass = document.getElementById('signupPasswordInput').value.trim();
  
        //check Format Email 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Swal.fire({ 
            icon: 'warning', 
            title: 'Oops!', 
            text: 'Please check your email format again.',  
            confirmButtonColor: '#c92323', 
            confirmButtonText: 'Got it'
          });
          return; 
        }
  
        const btn = document.getElementById('submitSignupBtn');
        btn.textContent = 'Creating account...';
        btn.disabled = true;
  
        try {
          //URL related to server.js  /api/auth/signup
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            //server.js 
            body: JSON.stringify({ 
              firstName: fname,    
              lastName: lname,     
              email: email, 
              username: username, 
              password: pass 
            }) 
          });
  
          const result = await response.json();
  
          if (response.ok && result.success) {
            Swal.fire({
              icon: 'success',
              title: 'Account Created!',
              text: 'You can now log in with your new account.',
              showConfirmButton: true
            }).then(() => {
              window.location.href = 'login.html'; 
            });
          } else {
            Swal.fire({ icon: 'error', title: 'Sign Up Failed', text: result.message || 'Unable to create account. Username or Email might already exist.' });
          }
        } catch (error) {
          Swal.fire({ icon: 'error', title: 'Connection Error', text: 'Unable to connect to the server.' });
          console.error('Error:', error);
        } finally {
          btn.textContent = 'Sign Up';
          btn.disabled = false;
        }
      });
    }
  });