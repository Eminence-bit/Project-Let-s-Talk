document.addEventListener('DOMContentLoaded', () => {
    const firebaseConfig = {
        apiKey: "AIzaSyDaEDw7HNKBm1jRzDOofQTw-d1NRCBa43Q",
        authDomain: "let-s-talk-95d7c.firebaseapp.com",
        projectId: "let-s-talk-95d7c",
        storageBucket: "let-s-talk-95d7c.firebasestorage.app",
        messagingSenderId: "776483665832",
        appId: "1:776483665832:web:f87e1889d24cf7ebf68f9d",
        measurementId: "G-QGQKNKFY2V"
      };

    firebase.initializeApp(firebaseConfig);

    const auth = firebase.auth();

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = loginForm.username.value;
        const password = loginForm.password.value;

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log('Login successful:', userCredential.user);
            // Redirect or show success message
        } catch (error) {
            console.error('Login failed:', error.message);
            // Show error message to user
        }
    });

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = registerForm.newUsername.value;
        const password = registerForm.newPassword.value;

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            console.log('Registration successful:', userCredential.user);
            // Redirect or show success message
        } catch (error) {
            console.error('Registration failed:', error.message);
            // Show error message to user
        }
    });
});

function login() {
    document.querySelector('.form-container-l').style.display = 'block';
    document.querySelector('.form-container-r').style.display = 'none';
}

function register() {
    document.querySelector('.form-container-l').style.display = 'none';
    document.querySelector('.form-container-r').style.display = 'block';
}
