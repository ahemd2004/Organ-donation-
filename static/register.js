document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = {
        username: document.getElementById('signupUsername').value.trim(),
        email: document.getElementById('signupEmail').value.trim(),
        telephone: document.getElementById('signupTelephone').value.trim(),
        country: document.getElementById('signupCountry').value.trim(),
        birthday: document.getElementById('signupBirthday').value.trim(),
        status: document.getElementById('signupStatus').value.trim(),
        password: document.getElementById('signupPassword').value.trim()
    };

    if (Object.values(formData).some(field => !field)) {
        alert('All fields are required!');
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.href = '/login';
            } else {
                alert(data.message);
            }
        });
});
