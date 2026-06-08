document.addEventListener('DOMContentLoaded', () => {
    const patientForm = document.getElementById('patientForm');
    const patientIdInput = document.getElementById('patientId');
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    const diagnosisInput = document.getElementById('diagnosis');
    const patientTableBody = document.getElementById('patientTableBody');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Ambil data dari LocalStorage
    let patients = JSON.parse(localStorage.getItem('patients')) || [];

    // Fungsi menampilkan data ke tabel (Read)
    function displayPatients() {
        patientTableBody.innerHTML = '';
        patients.forEach((patient, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${patient.name}</td>
                <td>${patient.age} Tahun</td>
                <td>${patient.diagnosis}</td>
                <td>
                    <button class="btn-edit" onclick="editPatient(${patient.id})">Edit</button>
                    <button class="btn-delete" onclick="deletePatient(${patient.id})">Hapus</button>
                </td>
            `;
            patientTableBody.appendChild(tr);
        });
    }

    // Fungsi menambah / memperbarui data (Create & Update)
    patientForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = patientIdInput.value;
        const name = nameInput.value;
        const age = ageInput.value;
        const diagnosis = diagnosisInput.value;

        if (id) {
            // Logika Update data pasien
            patients = patients.map(p => p.id == id ? { id: parseInt(id), name, age, diagnosis } : p);
        } else {
            // Logika Create data pasien baru
            const newPatient = {
                id: Date.now(),
                name,
                age,
                diagnosis
            };
            patients.push(newPatient);
        }

        localStorage.setItem('patients', JSON.stringify(patients));
        resetForm();
        displayPatients();
    });

    // Fungsi memicu mode Edit (mengisi form dengan data lama)
    window.editPatient = function(id) {
        const patient = patients.find(p => p.id === id);
        if (patient) {
            patientIdInput.value = patient.id;
            nameInput.value = patient.name;
            ageInput.value = patient.age;
            diagnosisInput.value = patient.diagnosis;
            submitBtn.textContent = 'Update Data';
            cancelBtn.style.display = 'inline-block';
        }
    };

    // Fungsi menghapus data (Delete)
    window.deletePatient = function(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data pasien ini?')) {
            patients = patients.filter(p => p.id !== id);
            localStorage.setItem('patients', JSON.stringify(patients));
            displayPatients();
        }
    };

    // Fungsi membatalkan edit
    cancelBtn.addEventListener('click', resetForm);

    function resetForm() {
        patientForm.reset();
        patientIdInput.value = '';
        submitBtn.textContent = 'Simpan Data';
        cancelBtn.style.display = 'none';
    }

    // Panggil fungsi tampilkan data pertama kali aplikasi dibuka
    displayPatients();
});