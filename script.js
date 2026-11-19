
/* ==========================================
   STUDENT ENROLLMENT FORM
   Login2Xplore - JsonPowerDB Micro Project
========================================== */

// 1. JPDB CONFIGURATION
const BASE_URL = "https://api.login2explore.com:5577";

const DB_NAME = "SCHOOL-DB";
const REL_NAME = "STUDENT-TABLE";
const PRIMARY_KEY = "Roll-No";

const TOKEN = window.JPDB_CONFIG?.token;

// 2. GET HTML ELEMENTS
const rollNo = document.getElementById("rollNo");
const fullName = document.getElementById("fullName");
const studentClass = document.getElementById("studentClass");
const birthDate = document.getElementById("birthDate");
const address = document.getElementById("address");
const enrollmentDate = document.getElementById("enrollmentDate");

const saveBtn = document.getElementById("saveBtn");
const updateBtn = document.getElementById("updateBtn");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");

let currentRecordNo = null;
let requestInProgress = false;

// 3. SHOW STATUS MESSAGE
function showMessage(text, type = "") {
    message.textContent = text;
    message.className = "message";

    if (type) {
        message.classList.add(type);
    }
}

// 4. ENABLE OR DISABLE FORM FIELDS
function enableStudentFields(enabled) {
    fullName.disabled = !enabled;
    studentClass.disabled = !enabled;
    birthDate.disabled = !enabled;
    address.disabled = !enabled;
    enrollmentDate.disabled = !enabled;
}

// 5. RESET FORM TO INITIAL STATE
function resetForm() {
    document.getElementById("studentForm").reset();

    rollNo.disabled = false;

    enableStudentFields(false);

    saveBtn.disabled = true;
    updateBtn.disabled = true;
    resetBtn.disabled = true;

    currentRecordNo = null;
    requestInProgress = false;

    showMessage("Enter a Roll Number to continue.");

    rollNo.focus();
}

// 6. JPDB API REQUEST FUNCTION
async function jpdbRequest(endpoint, requestData) {

    if (!TOKEN || TOKEN === "PASTE_YOUR_CONNECTION_TOKEN_HERE") {
        throw new Error("Connection token is missing. Check config.js.");
    }

    const response = await fetch(BASE_URL + endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    });

    const result = await response.json();

    return result;
}

// 7. CHECK WHETHER ROLL NUMBER EXISTS
async function checkRollNumber() {

    const enteredRollNo = rollNo.value.trim();

    if (!enteredRollNo) {
        return;
    }

    if (requestInProgress) {
        return;
    }

    requestInProgress = true;

    showMessage("Checking student record...");

    try {

        const requestData = {
            token: TOKEN,
            cmd: "GET_BY_KEY",
            dbName: DB_NAME,
            rel: REL_NAME,
            jsonStr: {
                [PRIMARY_KEY]: enteredRollNo
            }
        };

        const result = await jpdbRequest("/api/irl", requestData);

        if (result.status === 200 && result.data) {

            const recordData = result.data.record || result.data;

            // Existing student found
            fullName.value = recordData["Full-Name"] || "";
            studentClass.value = recordData["Class"] || "";
            birthDate.value = recordData["Birth-Date"] || "";
            address.value = recordData["Address"] || "";
            enrollmentDate.value =
                recordData["Enrollment-Date"] || "";

            currentRecordNo = result.data.rec_no;

            rollNo.disabled = true;

            enableStudentFields(true);

            saveBtn.disabled = true;
            updateBtn.disabled = false;
            resetBtn.disabled = false;

            showMessage("Existing student found. You can update the details.", "success");

            fullName.focus();

        } else if (result.status === 400) {

            // Check whether the API response indicates
            // that the record does not exist.
            const errorText = (
                (result.message || "") + " " +
                (result.error || "")
            ).toLowerCase();

            if (
                errorText.includes("not found") ||
                errorText.includes("no data") ||
                errorText.includes("does not exist") ||
                errorText.includes("no record") ||
                errorText.includes("relation") 
            ) {

                // New student
                enableStudentFields(true);

                saveBtn.disabled = false;
                updateBtn.disabled = true;
                resetBtn.disabled = false;

                showMessage("New Roll Number. Enter student details.", "success");

                fullName.focus();

            } else {
                showMessage(
                    result.message || "Database request failed.",
                    "error"
                );
            }

        } else {

            showMessage(
                result.message || "Unable to retrieve student record.",
                "error"
            );
        }

    } catch (error) {

        console.error("JPDB Error:", error);

        showMessage(
            error.message || "Unable to connect to JsonPowerDB.",
            "error"
        );

    } finally {

        requestInProgress = false;
    }
}

// 8. COLLECT AND VALIDATE FORM DATA
function getStudentData() {

    const studentData = {
        "Roll-No": rollNo.value.trim(),
        "Full-Name": fullName.value.trim(),
        "Class": studentClass.value.trim(),
        "Birth-Date": birthDate.value,
        "Address": address.value.trim(),
        "Enrollment-Date": enrollmentDate.value
    };

    for (const key in studentData) {

        if (!studentData[key]) {

            showMessage(
                "Please fill in all fields. Missing: " + key,
                "error"
            );

            return null;
        }
    }

    return studentData;
}

// 9. SAVE NEW STUDENT
async function saveStudent() {

    if (requestInProgress) return;

    const studentData = getStudentData();

    if (!studentData) return;

    requestInProgress = true;
    saveBtn.disabled = true;

    showMessage("Saving student record...");

    try {

        const requestData = {
            token: TOKEN,
            cmd: "PUT",
            dbName: DB_NAME,
            rel: REL_NAME,
            jsonStr: studentData
        };

        const result = await jpdbRequest("/api/iml", requestData);

        if (result.status === 200) {

            alert("Student record saved successfully!");

            resetForm();

        } else {

            showMessage(
                result.message || "Unable to save student record.",
                "error"
            );

        }

    } catch (error) {

        console.error("Save Error:", error);

        showMessage(error.message, "error");

    } finally {

        requestInProgress = false;

        if (!rollNo.disabled) {
            saveBtn.disabled = false;
        }
    }
}

// 10. UPDATE EXISTING STUDENT
async function updateStudent() {

    if (requestInProgress) return;

    const studentData = getStudentData();

    if (!studentData) return;

    if (currentRecordNo === null || currentRecordNo === undefined) {

        showMessage("Record number missing. Search the Roll Number again.", "error");

        return;
    }

    requestInProgress = true;
    updateBtn.disabled = true;

    showMessage("Updating student record...");

    try {

        const requestData = {
            token: TOKEN,
            cmd: "UPDATE",
            dbName: DB_NAME,
            rel: REL_NAME,
            jsonStr: {
                [currentRecordNo]: {
                    "Full-Name": studentData["Full-Name"],
                    "Class": studentData["Class"],
                    "Birth-Date": studentData["Birth-Date"],
                    "Address": studentData["Address"],
                    "Enrollment-Date": studentData["Enrollment-Date"]
                }
            }
        };

        const result = await jpdbRequest("/api/iml", requestData);

        if (result.status === 200) {

            alert("Student record updated successfully!");

            resetForm();

        } else {

            showMessage(
                result.message || "Unable to update student record.",
                "error"
            );

        }

    } catch (error) {

        console.error("Update Error:", error);

        showMessage(error.message, "error");

    } finally {

        requestInProgress = false;

        if (!rollNo.disabled) {
            updateBtn.disabled = false;
        }
    }
}

// 11. EVENT LISTENERS

rollNo.addEventListener("change", checkRollNumber);

rollNo.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        checkRollNumber();
    }
});

saveBtn.addEventListener("click", saveStudent);

updateBtn.addEventListener("click", updateStudent);

resetBtn.addEventListener("click", resetForm);

// 12. INITIALIZE FORM
document.addEventListener("DOMContentLoaded", function() {

    resetForm();

});
