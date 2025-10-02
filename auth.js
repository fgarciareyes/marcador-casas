// Credenciales de acceso (en un caso real, esto estaría en el servidor)
const validCredentials = {
    username: "admin",
    password: "admin123"
};

// Verificar si el usuario está logueado
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Manejo del formulario de login
function setupAuth() {
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === validCredentials.username && password === validCredentials.password) {
                localStorage.setItem('isLoggedIn', 'true');
                showPage('points-entry');
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            selectedGrade = "";
            updateGradeDisplay();
            showPage('login');
        });
    }
}