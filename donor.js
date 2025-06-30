document.getElementById('registerDonor').addEventListener('click', registerDonor);

function registerDonor() {
    console.log("Register button clicked");

    // Get form values
    const donorDetails = getDonorFormValues();

    console.log("Form values:", donorDetails);

    // Validate form inputs
    if (!validateDonorForm(donorDetails)) {
        alert("Please fill out all fields!");
        return;
    }

    // Save donor data to localStorage
    saveDonorToLocalStorage(donorDetails);

    // Optionally, send the donor data to the server
    sendDonorData(donorDetails);
}

function getDonorFormValues() {
    return {
        name: document.getElementById('donorName').value.trim(),
        bloodType: document.getElementById('donorBloodType').value.trim(),
        status: document.getElementById('donorStatus').value.trim(),
        organDonated: document.getElementById('donorOrgan').value.trim(),
    };
}

function validateDonorForm(donor) {
    return donor.name && donor.bloodType && donor.status && donor.organDonated;
}

function saveDonorToLocalStorage(donor) {
    let donors = JSON.parse(localStorage.getItem('donors')) || [];
    donors.push(donor);
    localStorage.setItem('donors', JSON.stringify(donors));
}

function sendDonorData(donor) {
    fetch('/register-donor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donor),
    })
        .then(response => response.json())
        .then(data => handleServerResponse(data))
        .catch(error => {
            console.error('Error registering donor:', error);
            alert("An unexpected error occurred. Please try again.");
        });
}

function handleServerResponse(data) {
    console.log("Server response:", data);

    if (data.success) {
        showSuccessMessage("Donor registration successful!", '/records');
    } else {
        alert(`Error: ${data.message}`);
    }
}

function showSuccessMessage(message, redirectUrl) {
    const successMessage = document.getElementById('Message');
    successMessage.textContent = message;
    successMessage.style.display = "block";

    setTimeout(() => {
        successMessage.style.display = "none";
        window.location.href = redirectUrl;
    }, 2000);
}
