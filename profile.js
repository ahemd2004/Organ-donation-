document.getElementById('logoutButton').addEventListener('click', () => {
    fetch('/logout', { method: 'GET' })
        .then(() => {
            alert('Logged out successfully.');
            window.location.href = '/login';
        })
});