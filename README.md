# Student Enrollment Form

## 1. Description

The Student Enrollment Form is a web-based application developed using HTML, CSS, JavaScript, and JsonPowerDB (JPDB).

The application allows users to manage student enrollment records through a simple and interactive form. It supports inserting new student records, retrieving existing records using the student's Roll Number, updating student information, and resetting the form.

The project uses JsonPowerDB as its database and communicates with it through REST APIs.

### Features

- Add new student enrollment records.
- Retrieve student details using Roll Number.
- Update existing student information.
- Validate input fields to prevent empty submissions.
- Reset the form to its initial state.
- Enable or disable form fields and buttons according to the operation being performed.

### Student Information Fields

- Roll-No (Primary Key)
- Full-Name
- Class
- Birth-Date
- Address
- Enrollment-Date

## 2. Technologies Used

- HTML5
- CSS3
- JavaScript
- JsonPowerDB (JPDB)
- AJAX / Fetch API
- JSON

## 3. Database Configuration

| Configuration | Value |
|---|---|
| Database Name | SCHOOL-DB |
| Relation Name | STUDENT-TABLE |
| Primary Key | Roll-No |
| API URL | https://api.login2explore.com:5577 |

## 4. Benefits of Using JsonPowerDB

- **Simple and easy to use:** JsonPowerDB provides REST APIs for database operations.
- **JSON-based database:** It works with JSON data, making it convenient to use with JavaScript applications.
- **Schema-free approach:** It provides flexibility when working with JSON documents.
- **Less development effort:** Database operations can be performed through API requests without building a separate database access layer.
- **Fast development:** Its simple API structure helps developers build database-driven applications efficiently.

## 5. How to Run the Project

1. Clone or download this repository.
2. Open the project folder.
3. Create a `config.js` file in the project directory.
4. Add your own JsonPowerDB Connection Token to `config.js`:

   ```javascript
   window.JPDB_CONFIG = {
       token: "YOUR_CONNECTION_TOKEN_HERE"
   };
   ```

5. Ensure that the database `SCHOOL-DB` and relation `STUDENT-TABLE` are configured in JsonPowerDB.
6. Open `index.html` in a web browser.
7. Use the form to insert, retrieve, update, and reset student records.

**Note:** Never upload your actual connection token or `config.js` file to a public GitHub repository.

## 6. Release History

### Version 1.0.0

- Initial release of Student Enrollment Form.
- Implemented student record insertion.
- Implemented retrieval using Roll-No.
- Implemented updating existing student records.
- Added form validation and reset functionality.
- Integrated JsonPowerDB for data storage.