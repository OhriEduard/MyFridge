const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

var goodRegisterEmail = false;
var goodRegisterPassword = false;

registerBtn.addEventListener('click', () =>{
    container.classList.add("active");
});

loginBtn.addEventListener('click', () =>{
    container.classList.remove("active");
});

document.getElementById('signupButton').addEventListener('click', function (event) {
    event.preventDefault();
    if (document.querySelector('.form-container.sign-up input[placeholder="Firstname"]').value !== ''){
        if (document.querySelector('.form-container.sign-up input[placeholder="Lastname"]').value !== ''){
            if (goodRegisterEmail){
                if (goodRegisterPassword){
                    registerUser(event);
                }
                else {
                    alert('Password not strong enough, please introduce a valid password !');
                }
            }
            else {
                alert('Email not valid, please introduce a valid email !');
            }
        }else{
            alert('Please write your lastname !');
        }
    }
    else {
        alert('Please write your firstname !');
    }

  });

function registerUser(){
      const formData = {
            firstname: document.querySelector('.form-container.sign-up input[placeholder="Firstname"]').value,
            lastname: document.querySelector('.form-container.sign-up input[placeholder="Lastname"]').value,
            email: document.querySelector('.form-container.sign-up input[placeholder="Email"]').value,
            password: document.querySelector('.form-container.sign-up input[placeholder="Password"]').value
        };

        fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Răspuns de la server:', data);
        openConfirmModal();
    })
    .catch(error => {
         console.error('Eroare:', error);
    });
  }

  document.getElementById('signinButton').addEventListener('click', function (event) {
      event.preventDefault();
      authenticateUser();
  });
  
  async function authenticateUser() {
      // Obțineți valorile din formularul de autentificare
      const email = document.querySelector('.form-container.sign-in input[placeholder="Email"]').value;
      const password = document.querySelector('.form-container.sign-in input[placeholder="Password"]').value;
  
      // Construiește obiectul de autentificare
      const credentials = {
          email: email,
          password: password
      };
  
      // Realizează un POST request pentru autentificare
      try {
          const response = await fetch('http://localhost:8080/auth/authenticate', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(credentials)
          });
  
          if (response.ok) {
              const data = await response.json();
              console.log('Autentificare cu succes. Token obținut:', data.token);
              localStorage.setItem('token', data.token);
              window.location.href = 'http://127.0.0.1:5500/src/main/resources/static/index2.html';
          } else {
              console.error('Eroare la autentificare:', response.statusText);
              document.getElementById('incorrectCredentialsAlert').classList.add('active');
          }
      } catch (error) {
          console.error('Eroare în timpul POST request pentru autentificare:', error);
      }
  }

const eyeToggle = document.getElementById('togglePassword');
const eyeToggleLogin = document.getElementById('togglePasswordLogin');
const passwordInput = document.getElementById('passwordInput');
const passwordInputLogin = document.getElementById('passwordInputLogin');


eyeToggle.addEventListener('click', function(e){
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    if (type === 'password') {
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
    } else {
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
    }
});

eyeToggleLogin.addEventListener('click', function(e){
    const type = passwordInputLogin.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInputLogin.setAttribute('type', type);
    if (type === 'password') {
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
    } else {
        this.classList.remove('fa-eye');
        this.classList.add('fa-eye-slash');
    }
});

document.getElementById('firstNameInput').addEventListener('blur', capitalizeInput);
document.getElementById('lastNameInput').addEventListener('blur', capitalizeInput);

function capitalizeInput(event){
    const input = event.target;
    input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
}

const emailInput = document.getElementById('emailInput');
const emailInputLogin = document.getElementById('emailInputLogin');

emailInput.addEventListener('input', checkEmail);
passwordInput.addEventListener('input', checkPassword);

emailInputLogin.addEventListener('click', function(){
    document.getElementById('incorrectCredentialsAlert').classList.remove('active');
});
passwordInputLogin.addEventListener('click', function(){
    document.getElementById('incorrectCredentialsAlert').classList.remove('active');
});

const passwordStrength = document.getElementById('passwordStrength');


function checkEmail(){
    const email = emailInput.value.trim();
    const isValid = validateEmailFormat(email);
    if (isValid){
        emailInput.classList.remove('input-error');
        emailInput.classList.add('input-success');
        goodRegisterEmail = true;
    }
    else{
        emailInput.classList.remove('input-success');
        emailInput.classList.add('input-error');
        goodRegisterEmail = false;
    }
}

function validateEmailFormat(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function checkPassword(){
    const password = passwordInput.value;
    const strength = calculatePasswordStrength(password);
    passwordStrength.textContent = `Password Strength: ${strength}`;
}

function calculatePasswordStrength(password){
    const length = password.length;
    if (length < 6) {
        passwordInput.classList.remove('input-success');
        passwordInput.classList.remove('input-part-success');
        passwordInput.classList.add('input-error');
        goodRegisterPassword = false;
        return 'Weak';
    } else if (length < 10) {
        passwordInput.classList.remove('input-error');
        passwordInput.classList.add('input-part-success');
        goodRegisterPassword = true;
        return 'Moderate';
    } else {
        passwordInput.classList.remove('input-part-success');
        passwordInput.classList.add('input-success');
        goodRegisterPassword = true;
        return 'Strong';
    }
}

function openConfirmModal(){
    document.getElementById('confirmModal').classList.add('active');
}

function closeModal(clickedElement){
    const modal = clickedElement.parentNode.parentNode;
    modal.classList.remove('active');
}

passwordInput.addEventListener('focus', () => {
    passwordStrength.classList.add('active');
});

passwordInput.addEventListener('blur', () => {
    passwordStrength.classList.remove('active');
});