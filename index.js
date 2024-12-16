//  load existing students from cache
let students = JSON.parse(localStorage.getItem('students')) || [];
let editingIndex = -1;

// form validation pattern
const patterns = {
    name: /^[A-Za-z\s]+$/,
    id: /^\d+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    contact: /^\d{10}$/
};

// display students data  when page loads
window.onload = function () {
    displayStudents();
};

function handleSubmit(event) {
    event.preventDefault();

    // extract form values
    const name = document.getElementById('studentName').value.trim();
    const id = document.getElementById('studentId').value.trim();
    const email = document.getElementById('email').value.trim();
    const contact = document.getElementById('contact').value.trim();

    // Check empty values
    if (!name || !id || !email || !contact) {
        alert('Please fill in all fields');
        return false;
    }

    //  input Validation
    if (!validateInput(name, 'name') ||
        !validateInput(id, 'id') ||
        !validateInput(email, 'email') ||
        !validateInput(contact, 'contact')) {
        return false;
    }

    // Check  duplicate student_id
    if (editingIndex === -1 && students.some(student => student.id === id)) {
        alert('Student ID already exists!');
        return false;
    }

    const student = { name, id, email, contact };

    if (editingIndex === -1) {
        // add student
        students.push(student);
    } else {
        // update  student
        students[editingIndex] = student;
        editingIndex = -1;
        document.querySelector('button[type="submit"]').textContent = 'Add Student';
    }

    // Save& update display
    localStorage.setItem('students', JSON.stringify(students));
    document.getElementById('studentForm').reset();
    displayStudents();

    return false;
}

function validateInput(value, type) {
    const error = document.getElementById(`${type}Error`);
    if (!patterns[type].test(value)) {
        error.style.display = 'block';
        return false;
    }
    error.style.display = 'none';
    return true;
}

function displayStudents() {
    const tbody = document.getElementById('studentRecords');

    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="no-records">No student records found</td>
            </tr>`;
        return;
    }

    tbody.innerHTML = students.map((student, index) => `
        <tr>
            <td>${student.name}</td>
            <td>${student.id}</td>
            <td>${student.email}</td>
            <td>${student.contact}</td>
            <td class="action-buttons">
                <button onclick="editStudent(${index})" class="edit">Edit</button>
                <button onclick="deleteStudent(${index})" class="delete">Delete</button>
            </td>
        </tr>
    `).join('');
}

function editStudent(index) {
    const student = students[index];
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentId').value = student.id;
    document.getElementById('email').value = student.email;
    document.getElementById('contact').value = student.contact;
    editingIndex = index;
    document.querySelector('button[type="submit"]').textContent = 'Update Student';
}

function deleteStudent(index) {
    if (confirm('Are you sure you want to delete this student?')) {
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        displayStudents();
    }
}