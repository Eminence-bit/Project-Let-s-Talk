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

    const logging = firebase.analytics(); 
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log('User signed in:', user);
            logging.logEvent('user_login', { uid: user.uid });
            loadSavedContacts(user.uid);
        } else {
            console.log('User signed out');
            logging.logEvent('user_logout');
            window.location.href = 'login.html';
        }
    });

    // Sign in anonymously for testing
    auth.signInAnonymously().catch(error => {
        console.error('Authentication error:', error);
        logging.logEvent('auth_error', { error: error.message });
    });

    const findNewButton = document.getElementById('find-new');
    const contactsList = document.getElementById('contacts-list');

    // Function to generate a combined chat ID
    const generateChatId = (uid1, uid2) => {
        return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
    };

    // Find new chat partner
    findNewButton.addEventListener('click', async () => {
        const user = auth.currentUser;
        const userId = user.uid;

        logging.logEvent('find_new_chat_attempt', { uid: userId });

        // Add user to matchmaking queue
        const queueRef = database.ref('queue');
        await queueRef.child(userId).set({ timestamp: Date.now() });

        // Check for a match
        const findMatch = async () => {
            const snapshot = await queueRef.once('value');
            const users = snapshot.val();
            const userIds = Object.keys(users).filter(id => id !== userId);

            if (userIds.length > 0) {
                const partnerId = userIds[0];
                const chatId = generateChatId(userId, partnerId);

                // Remove both users from queue
                await queueRef.child(userId).remove();
                await queueRef.child(partnerId).remove();

                logging.logEvent('chat_found', { chatId, userId, partnerId });
                window.open(`chat.html?chatId=${chatId}`, '_blank');
            } else {
                setTimeout(findMatch, 2000); // Check again after 2 seconds
                logging.logEvent('no_match_found', { uid: userId });
            }
        };

        findMatch();
    });

    // Display saved contacts
    const loadSavedContacts = (userId) => {
        database.ref(`users/${userId}/contacts`).on('child_added', snapshot => {
            const contact = snapshot.val();
            const contactElement = document.createElement('li');
            contactElement.textContent = contact.name;
            contactElement.addEventListener('click', () => {
                const chatId = generateChatId(userId, contact.uid);
                logging.logEvent('open_saved_chat', { chatId, userId, contactId: contact.uid });
                window.open(`chat.html?chatId=${chatId}`, '_blank');
            });
            contactsList.appendChild(contactElement);
        });
    };
});
