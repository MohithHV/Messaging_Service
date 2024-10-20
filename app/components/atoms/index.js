// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Chat Application</title>
//     <link rel="stylesheet" href="styles.css"> <!-- Link to the CSS file -->
//     <style>
//         body { font-family: Arial, sans-serif; }
//         #chat { border: 1px solid #ccc; padding: 10px; height: 200px; overflow-y: auto; }
//         #active-users, #groups, #group-actions { display: none; margin-bottom: 10px; } /* Hide by default */
//         .user, .group { cursor: pointer; color: blue; text-decoration: underline; }
//         #register-section { display: none; }
//         #send, #get-history { display: none; }
//         #message { display: none; }
//         #logged-in-user { font-weight: bold; margin-bottom: 10px; }
//         #selected-user-title { font-weight: bold; margin-top: 10px; }

//         /* New styles for layout */
//         .container {
//             display: flex;
//             justify-content: space-between;
//         }
//         #active-users {
//             width: 30%; /* Adjust width as necessary */
//         }       
//         #groups {
//             width: 30%; /* Adjust width as necessary */
//         }
//         #group-actions {
//             display: flex;
//             flex-direction: column; /* Stack elements vertically */
//             width: 30%; /* Adjust width to fit beside users and groups */
//             margin-left: 20px; /* Space between columns */
//         }
//         #group-actions input, #group-actions button {
//             margin: 5px 0; /* Spacing for inputs and buttons */
//             width: 50%; /* Full width */
//         }
//     </style>
// </head>

// <body>
//     <h1>Chat Application</h1>
   
//     <div id="login-section">
//         <h2>Login</h2>
//         <input type="text" id="username" placeholder="Username" />
//         <input type="password" id="password" placeholder="Password" />
//         <button id="register">Register</button>
//         <button id="login">Login</button>
//     </div>
   
//     <div id="logged-in-user"></div> <!-- Display logged-in user here -->

//     <div class="container">
//         <!-- Users section (hidden before login) -->
//         <div id="active-users">
//             <h3>Users</h3> <!-- Moved inside the div so it's hidden by default -->
//         </div>

//         <!-- Groups section (hidden before login) -->
//         <div id="groups">
//             <h3>Groups</h3> <!-- Moved inside the div so it's hidden by default -->
//         </div>

//         <!-- New buttons for creating and joining groups -->
//         <div id="group-actions">
//             <input type="text" id="new-group-name" placeholder="New group name" />
//             <button id="create-group">Create Group</button>
//             <input type="text" id="join-group-name" placeholder="Join group name" />
//             <button id="join-group">Join Group</button>
//         </div>
//     </div>

//     <div id="selected-user-title"></div> <!-- Title for selected user/group -->
   
//     <div id="chat"></div> <!-- Chat history section -->
   
//     <input type="text" id="message" placeholder="Type a message..." />
//     <button id="send">Send</button>
//     <!--<button id="get-history">Get Chat History</button>-->

//     <script>
//         const ws = new WebSocket('ws://localhost:8080');
//         const usernameInput = document.getElementById('username');
//         const passwordInput = document.getElementById('password');
//         const activeUsersDiv = document.getElementById('active-users');
//         const groupsDiv = document.getElementById('groups');
//         const chatDiv = document.getElementById('chat');
//         const messageInput = document.getElementById('message');
//         const loggedInUserDiv = document.getElementById('logged-in-user');
//         const selectedUserTitleDiv = document.getElementById('selected-user-title');
//         const groupActionsDiv = document.getElementById('group-actions');
//         let currentChatUser = null; // Track the current user whose chat history is displayed
//         let currentChatGroup = null; // Track the current group whose chat history is displayed

//         ws.onopen = () => {
//             console.log('Connected to the WebSocket server');
//         };

//         ws.onmessage = (event) => {
//             const data = JSON.parse(event.data);

//             if (data.action === 'loginPrompt') {
//                 console.log('Please register or log in');
//                 showRegisterSection();
//             }

//             // Handle active users
//             if (data.activeUsers) {
//                 displayActiveUsers(data.activeUsers);
//             }

//             // Handle groups
//             if (data.groupNames) {
//                 displayGroups(data.groupNames);
//             }

//             // Handle incoming direct messages
//             if (data.from && data.content && !data.group) {
//                 if (currentChatUser === data.from) {
//                     displayMessage(data.from, data.content);
//                 }
//             }

//             // Handle group messages - Automatically update for the group
//             if (data.from && data.content && data.group) {
//                 if (currentChatGroup === data.group) {
//                     displayMessage(data.from, data.content);
//                 } else {
//                     // Optionally, notify the user that a new message has arrived in another group
//                     console.log(`New message in group: ${data.group}`);
//                 }
//             }

//             // Handle success/error messages
//             if (data.success) {
//                 console.log(data.success);
//                 if (data.success.includes('registered')) {
//                     alert("Registration successful! You can now log in.");
//                 } else if (data.success.includes('logged in')) {
//                     alert("Login successful!");
//                     loggedInUserDiv.textContent = `Logged in as: ${usernameInput.value}`; // Show logged-in username
//                     showChatSection(); // Show users, groups, and chat section after successful login
//                 } else if (data.success.includes('Group created')) {
//                     alert('Group created successfully!');
//                 } else if (data.success.includes('joined')) {
//                     alert('Successfully joined the group!');
//                 }
//             }
//             if (data.error) {
//                 alert(data.error);
//             }

//             // Handle chat history response
//             if (data.chatHistory) {
//                 displayChatHistory(data.chatHistory);
//                 currentChatUser = data.selectedUser; // Set current chat user to selected
//                 selectedUserTitleDiv.textContent = `Chat with: ${currentChatUser}`; // Update selected user title
//             }

//             // Handle group chat history response
//             if (data.groupChatHistory) {
//                 displayGroupChatHistory(data.groupChatHistory);
//                 currentChatGroup = data.selectedGroup; // Set current chat group to selected
//                 selectedUserTitleDiv.textContent = `Group chat: ${currentChatGroup}`; // Update selected group title
//             }
//         };

//         document.getElementById('register').onclick = () => {
//             const username = usernameInput.value;
//             const password = passwordInput.value;
//             ws.send(JSON.stringify({ action: 'register', username, password }));
//         };

//         document.getElementById('login').onclick = () => {
//             const username = usernameInput.value;
//             const password = passwordInput.value;
//             ws.send(JSON.stringify({ action: 'login', username, password }));
//         };

//         // New function to create a group
//         document.getElementById('create-group').onclick = () => {
//             const groupName = document.getElementById('new-group-name').value;
//             if (groupName) {
//                 ws.send(JSON.stringify({ action: 'createGroup', groupName }));
//             } else {
//                 alert('Please enter a group name to create.');
//             }
//         };

//         // New function to join an existing group
//         document.getElementById('join-group').onclick = () => {
//             const groupName = document.getElementById('join-group-name').value;
//             if (groupName) {
//                 ws.send(JSON.stringify({ action: 'joinGroup', groupName }));
//             } else {
//                 alert('Please enter a group name to join.');
//             }
//         };

//         function displayActiveUsers(activeUsers) {
//             activeUsersDiv.innerHTML = '';
//             activeUsers.forEach(user => {
//                 const userElement = document.createElement('div');
//                 userElement.className = 'user registered-username';
//                 userElement.textContent = user;
//                 userElement.onclick = () => fetchChatHistory(user); // Fetch chat history on user click
//                 activeUsersDiv.appendChild(userElement);
//             });
//         }

//         function displayGroups(groups) {
//             groupsDiv.innerHTML = '';
//             groups.forEach(group => {
//                 const groupElement = document.createElement('div');
//                 groupElement.className = 'group registered-group-name';
//                 groupElement.textContent = group;
//                 groupElement.onclick = () => fetchGroupChatHistory(group); // Fetch group chat history on click
//                 groupsDiv.appendChild(groupElement);
//             });
//         }

//         function fetchChatHistory(withUser) {
//             ws.send(JSON.stringify({ action: 'getChatHistory', withUser }));
//         }

//         function fetchGroupChatHistory(withGroup) {
//             ws.send(JSON.stringify({ action: 'getGroupChatHistory', withGroup }));
//         }

//         function displayChatHistory(chatHistory) {
//             chatDiv.innerHTML = ''; // Clear existing messages
//             chatHistory.forEach(msg => displayMessage(msg.sender, msg.message));
//         }

//         function displayGroupChatHistory(groupChatHistory) {
//             chatDiv.innerHTML = ''; // Clear existing messages
//             groupChatHistory.forEach(msg => displayMessage(msg.sender, msg.message, 'group-message'));
//             selectedUserTitleDiv.textContent = `Group chat: ${currentChatGroup}`; // Update selected group title
//         }

//         function displayMessage(from, content) {
//             const messageElement = document.createElement('div');
//             messageElement.className = 'chat-message';
//             //messageElement.textContent = `${from}: ${content}`;
//             const usernameElement = document.createElement('span');
//             usernameElement.textContent = `${from}: `;
//             usernameElement.style.color = 'blue'; // Set username color to blue
//             usernameElement.style.fontFamily = 'Grand, sans-serif'; // Set font to Grand
            
//             // Create a span for the message content
//             const contentElement = document.createElement('span');
//             contentElement.textContent = content;
//             contentElement.style.color = 'black'; // Set message color to black
//             contentElement.style.fontFamily = 'Grand, sans-serif'; // Set font to Grand
            
//             // Append the username and content to the message element
//             messageElement.appendChild(usernameElement);
//             messageElement.appendChild(contentElement);
//             chatDiv.appendChild(messageElement);
//         }
        
//         document.getElementById('send').onclick = () => {
//             const content = messageInput.value;
//             if (currentChatUser && content) {
//                 ws.send(JSON.stringify({ action: 'sendMessage', to: currentChatUser, content }));
//                 displayMessage('You', content); // Display sent message
//                 messageInput.value = ''; // Clear input after sending
//             } else if (currentChatGroup && content) {
//                 ws.send(JSON.stringify({ action: 'sendGroupMessage', groupName: currentChatGroup, content }));
//                 displayMessage('You', content); // Display sent message in the group
//                 messageInput.value = ''; // Clear input after sending
//             }
//         };

//         function showRegisterSection() {
//             document.getElementById('login-section').style.display = 'block';
//             activeUsersDiv.style.display = 'none';
//             groupsDiv.style.display = 'none';
//             groupActionsDiv.style.display = 'none';
//             chatDiv.style.display = 'none';
//             document.getElementById('send').style.display = 'none';
//         }

//         function showChatSection() {
//             document.getElementById('login-section').style.display = 'none';
//             activeUsersDiv.style.display = 'block'; // Show users after login
//             groupsDiv.style.display = 'block'; // Show groups after login
//             groupActionsDiv.style.display = 'block'; // Show group actions after login
//             chatDiv.style.display = 'block'; // Show chat area
//             messageInput.style.display = 'block';
//             document.getElementById('send').style.display = 'block';
//             document.getElementById('get-history').style.display = 'block'; // Show get-history button
//         }
//     </script>
//     <style>
//         /* Existing CSS styles... */
    
//         /* New styles for registered usernames */
//         .registered-username {
//             font-family: 'Verdana', sans-serif; /* Update font */
//             color: #003366; /* Dark blue font color */
//             background-color: #e0f7fa; /* Light blue background for usernames */
//             padding: 5px; /* Padding around usernames */
//             border-radius: 5px; /* Rounded corners */
//             transition: background-color 0.3s; /* Smooth transition for hover effect */
//         }
    
//         .registered-username:hover {
//             background-color: #b2ebf2; /* Darker blue on hover */
//             color: #004080; /* Slightly darker color on hover */
//         }
    
//             /* New styles for registered group names */
//         .registered-group-name {
//             font-family: 'Verdana', sans-serif; /* Update font */
//             color: #663399; /* Dark purple font color */
//             background-color: #f1e7ff; /* Light purple background for group names */
//             padding: 5px; /* Padding around group names */
//             border-radius: 5px; /* Rounded corners */
//             transition: background-color 0.3s; /* Smooth transition for hover effect */
//         }

//         .registered-group-name:hover {
//             background-color: #e1d3ff; /* Darker purple on hover */
//             color: #4b2e91; /* Slightly darker color on hover */
//         }
//         .chat-message {
//             font-family: 'Arial', sans-serif; /* Update font */
//             color: #333; /* Dark gray font color for messages */
//             background-color: #edf4e1; /* Light background for messages */
//             padding: 10px; /* Padding around messages */
//             border-radius: 5px; /* Rounded corners */
//             margin: 5px 0; /* Margin between messages */
//             max-width: 80%; /* Limit width of messages */
//         }
        
        
//     </style>
    
// </body>
// </html>
            