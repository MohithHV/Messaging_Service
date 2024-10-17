Setup Instructions
1. Clone the Repository:
bash
Copy code
git clone https://github.com/your-username/your-repo.git
cd your-repo
2. Install Dependencies:
bash
Copy code
npm install
3. Setup the Database:
Import the SQL file into MySQL Workbench:
Open MySQL Workbench.
Navigate to File > Open SQL Script.
Choose sql/schema.sql or execute the SQL commands manually.
Create a new database and run the SQL schema to initialize the tables.
4. Modify the Database Credentials:
Open server.js and update the hardcoded MySQL username and password.
Example in server.js:

js
Copy code
const dbConfig = {
  host: 'localhost',
  user: 'root',          // Update with your MySQL username
  password: 'yourpassword',  // Update with your MySQL password
  database: 'messaging_db'
};
5. Run the Server:
bash
Copy code
node server.js
6. Access the Client:
Open client/index.html in your browser.