## Setup Instructions
1. Clone the Repository:
  git clone https://github.com/your-username/your-repo.git
  cd your-repo

2. Install Dependencies:
  npm install
  
3. Setup the Database:
  Import the SQL file into MySQL Workbench:
4. MySQL Workbench.
  Navigate to Database > database.sql
  Create a new database and run the SQL schema to initialize the tables.
5. Modify the Database Credentials:
  Open server.js and update the hardcoded MySQL username and password.
  Example in server.js:

    ```
    // Create a connection to the MySQL database
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'username', // Replace with your MySQL username
      password: 'password', // Replace with your MySQL password
      database: 'messaging_service'
    });
    ```
6. Run the Server:
  run the command in terminal
  ```
  node server.js
  ```
* Access the Client:
  Open client/index.html in your browser.
