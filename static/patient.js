document.getElementById('patientForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    let formData = {
        name: document.getElementById('name').value,
        gender: document.getElementById('gender').value,
        birthday: document.getElementById('birthday').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        organNeeded: document.getElementById('donorOrgan').value,  // changed here to match the form field
        healthStatus: document.getElementById('health_status').value,
    };
    

    // Store the data in local storage
    let patientRecords = JSON.parse(localStorage.getItem('patients')) || [];
    patientRecords.push(formData);
    localStorage.setItem('patients', JSON.stringify(patientRecords));

    // Show a message to the user
    document.getElementById('patientMessage').style.display = 'block';
    document.getElementById('patientMessage').innerText = 'Patient registration successful!';
    window.location.href = '/records';


    // Optionally, submit data to the backend too:
    sendPatientData(formData);
});
