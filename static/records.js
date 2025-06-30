document.addEventListener('DOMContentLoaded', function() {
    // Retrieve donor records from localStorage
    let donors = JSON.parse(localStorage.getItem('donors')) || [];

    // Populate donor records in the table
    populateDonorTable(donors);

    function populateDonorTable(donors) {
        const donorTableBody = document.getElementById('donorTable').getElementsByTagName('tbody')[0];
        donorTableBody.innerHTML = '';  // Clear the table body

        if (donors.length === 0) {
            const row = donorTableBody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 5;
            cell.textContent = 'No donor records available.';
        }

        donors.forEach((donor, index) => {
            const row = donorTableBody.insertRow();
            row.insertCell(0).textContent = donor.name;
            row.insertCell(1).textContent = donor.bloodType;
            row.insertCell(2).textContent = donor.organDonated;
            row.insertCell(3).textContent = donor.status;
            const deleteCell = row.insertCell(4);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                deleteDonor(index);
            });
            deleteCell.appendChild(deleteButton);
        });
    }

    // Delete donor record
    function deleteDonor(index) {
        let donors = JSON.parse(localStorage.getItem('donors')) || [];
        donors.splice(index, 1);  // Remove the donor from the array
        localStorage.setItem('donors', JSON.stringify(donors));  // Update localStorage
        populateDonorTable(donors);  // Re-populate the table
    }

    // Retrieve patient records from localStorage
    let patients = JSON.parse(localStorage.getItem('patients')) || [];

    // If no data exists in localStorage, ensure an empty array is used
    if (!patients) {
        patients = [];
    }

    // Populate patient records in the table
    populatePatientTable(patients);

    function populatePatientTable(patients) {
        const patientTableBody = document.getElementById('patientTable').getElementsByTagName('tbody')[0];
        patientTableBody.innerHTML = '';  // Clear the table body

        if (patients.length === 0) {
            const row = patientTableBody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = 9;
            cell.textContent = 'No patient records available.';
        }

        patients.forEach((patient, index) => {
            const row = patientTableBody.insertRow();
            row.insertCell(0).textContent = patient.name;
            row.insertCell(1).textContent = patient.gender;
            row.insertCell(2).textContent = patient.birthday;
            row.insertCell(3).textContent = patient.email;
            row.insertCell(4).textContent = patient.phone;
            row.insertCell(5).textContent = patient.address;
            row.insertCell(6).textContent = patient.organNeeded; // changed here to match the field
            row.insertCell(7).textContent = patient.healthStatus;

            // Add delete button
            const deleteCell = row.insertCell(8);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                deletePatient(index);
            });
            deleteCell.appendChild(deleteButton);
        });
    }

    // Delete patient record
    function deletePatient(index) {
        let patients = JSON.parse(localStorage.getItem('patients')) || [];
        patients.splice(index, 1);  // Remove the patient from the array
        localStorage.setItem('patients', JSON.stringify(patients));  // Update localStorage
        populatePatientTable(patients);  // Re-populate the table
    }

    // Handle the Download Data button click for Donors
    document.getElementById('downloadDonorButton').addEventListener('click', function() {
        let donorData = localStorage.getItem('donors');
        
        if (donorData) {
            // Convert the stored data into a Blob and create a download link
            let blob = new Blob([donorData], { type: 'application/json' });
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'donorData.json';  // Default download file name
            document.body.appendChild(a);
            a.click();  // Trigger download
            document.body.removeChild(a);
        } else {
            // If there's no data to download
            alert('No donor data available to download.');
        }
    });

    // Handle the Download Data button click for Patients
    document.getElementById('downloadPatientButton').addEventListener('click', function() {
        let patientData = localStorage.getItem('patients');
        
        if (patientData) {
            // Convert the stored data into a Blob and create a download link
            let blob = new Blob([patientData], { type: 'application/json' });
            let url = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'patientData.json';  // Default download file name
            document.body.appendChild(a);
            a.click();  // Trigger download
            document.body.removeChild(a);
        } else {
            // If there's no data to download
            alert('No patient data available to download.');
        }
    });

    // Handle the Delete Data button click for both Donors and Patients
    document.getElementById('deleteData').addEventListener('click', function() {
        // Remove donor and patient data from localStorage
        localStorage.removeItem('donors');
        localStorage.removeItem('patients');

        // Show success message and hide the message after a few seconds
        let message = document.getElementById('Message');
        message.style.display = 'block';
        
        setTimeout(function() {
            message.style.display = 'none';  // Hide message after 3 seconds
        }, 3000);

        // Re-populate the tables after deleting data
        populateDonorTable([]);
        populatePatientTable([]);
    });
});
