
        // Initialize localStorage
        function initLocalStorage() {
            if (!localStorage.getItem('users')) {
                localStorage.setItem('users', JSON.stringify([]));
            }

            if (!localStorage.getItem('patients')) {
                localStorage.setItem('patients', JSON.stringify([]));
            }

            if (!localStorage.getItem('donors')) {
                localStorage.setItem('donors', JSON.stringify([]));
            }
        }

        // Call the initialization function when the page loads
        document.addEventListener('DOMContentLoaded', initLocalStorage);

//register page
function signupUser() {
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const telephone = document.getElementById('signupTelephone').value.trim();
    const country = document.getElementById('signupCountry').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    if (!username || !email || !telephone || !country || !password) {
        alert('All fields are required!');
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, telephone, country, password }),
    })
    .then(response => response.json().then(data => ({ status: response.ok, message: data })))
    .then(({ status, message }) => {
        if (status) {
            alert(message.message);
            window.location.href = '/login'; // Redirect to login page after successful signup
        } else {
            alert(`Error: ${message.message}`);
        }
    })
    .catch(error => {
        alert('An error occurred during signup. Please try again.');
        console.error(error);
    });
}
//login page
function loginUser() {
    const identifier = document.getElementById('loginIdentifier').value.trim(); // Username or Email
    const password = document.getElementById('loginPassword').value.trim();

    if (!identifier || !password) {
        alert('Username/Email and password are required!');
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
    })
    .then(response => response.json().then(data => ({ status: response.ok, message: data })))
    .then(({ status, message }) => {
        if (status) {
            document.cookie = `identifier=${identifier}; path=/`; // Set cookie for logged-in user
            alert(message.message);
            window.location.href = '/user-actions'; // Redirect to user actions page
        } else {
            alert(`Error: ${message.message}`);
        }
    })
    .catch(error => {
        alert('An error occurred during login. Please try again.');
        console.error(error);
    });
}

//profile page
document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    // Function to display data from local storage
    function displayData() {
        const storedData = localStorage.getItem('userInformation');
        if (storedData) {
            const userData = JSON.parse(storedData);
            console.log('User Data from Local Storage:', userData);
            // Display data on the page
            document.getElementById('userName').textContent = userData.name;
            document.getElementById('userEmail').textContent = userData.email;
            document.getElementById('userPhone').textContent = userData.phoneNumbers.join(', ');
            document.getElementById('userAddress').textContent = userData.address;
        } else {
            console.log('No user data found in local storage. Redirecting to registration page.');
            window.location.href = '/register';
        }
    }

    displayData();
});
