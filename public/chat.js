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
    const database = firebase.database();
    const logging = firebase.analytics(); // Add Firebase Analytics for logging

    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chatId');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messagesContainer = document.getElementById('messages');

    // Auth state change listener
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log('User signed in:', user);
            logging.logEvent('user_signed_in', { uid: user.uid });
            listenForMessages(chatId);
        } else {
            console.log('User signed out');
            logging.logEvent('user_signed_out');
            window.location.href = 'login.html';
        }
    });

    // Listen for new messages
    const listenForMessages = (chatId) => {
        database.ref(`chats/${chatId}/messages`).on('child_added', data => {
            const messageElement = document.createElement('div');
            messageElement.textContent = data.val().message;
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            logging.logEvent('message_received', { message: data.val().message, chatId });
        });
    };

    // Send message on form submission
    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = messageInput.value;
        const userId = auth.currentUser.uid;

        database.ref(`chats/${chatId}/messages`).push({
            userId,
            message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        logging.logEvent('message_sent', { message, chatId, userId });
        messageInput.value = '';
    });
});
