// //test temp


// import { WebSocketServer } from 'ws';
// import mysql from 'mysql2/promise';

// // Create a connection to the MySQL database
// const db = await mysql.createConnection({
//   host: 'localhost',
//   user: 'root', // Replace with your MySQL username
//   password: 'Mohith@2003', // Replace with your MySQL password
//   database: 'messaging_service'
// });

// const wss = new WebSocketServer({ port: 8080 });
// let clients = {}; // Store connected clients by username

// // Function to broadcast the list of active users to all connected clients
// const broadcastActiveUsers = async () => {
//   // const activeUsernames = Object.keys(clients);
//   const [rows] = await db.execute('SELECT username FROM users');
//   const registeredUsernames = rows.map(row => row.username);
//   const activeUsersMessage = JSON.stringify({ activeUsers: registeredUsernames });

//   for (const client of Object.values(clients)) {
//     client.send(activeUsersMessage);
//   }
// };

// // Function to broadcast the list of active users to all connected clients
// const broadcastGroups = async () => {
//   // const activeUsernames = Object.keys(clients);
//   console.log('reached broadcasegroups');
//   const [rows] = await db.execute('SELECT group_name FROM chat_groups');
//   const groupNames = rows.map(row => row.group_name);
//   const groupNamesMessage = JSON.stringify({ groupNames: groupNames });

//   for (const client of Object.values(clients)) {
//     client.send(groupNamesMessage);
//   }
// };

// // Function to store chat history in the database
// const storeChatMessage = async (sender, receiver, message) => {
//   try {
//     await db.execute(
//       'INSERT INTO chat_history (sender, receiver, message) VALUES (?, ?, ?)',
//       [sender, receiver, message]
//     );
//   } catch (error) {
//     console.error('Error storing chat message:', error);
//   }
// };

// // Function to store group message in the database
// const storeGroupMessage = async (groupId, sender, message) => {
//   try {
//     await db.execute(
//       'INSERT INTO group_chat_history (group_id, sender, message) VALUES (?, ?, ?)',
//       [groupId, sender, message]
//     );
//   } catch (error) {
//     console.error('Error storing group message:', error);
//   }
// };

// // WebSocket connection
// wss.on('connection', (ws) => {
//   console.log('A new client connected');

//   // Prompt the client to register or log in
//   ws.send(JSON.stringify({ action: 'loginPrompt' }));

//   ws.on('message', async (message) => {
//     const data = JSON.parse(message);

//     // Handle user registration
//     if (data.action === 'register') {
//       const { username, password } = data;

//       try {
//         const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
//         if (rows.length > 0) {
//           return ws.send(JSON.stringify({ error: 'Username already exists' }));
//         }

//         await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
//         ws.send(JSON.stringify({ success: `User ${username} registered successfully. Please login.` }));
//         console.log(`User ${username} registered`);
//       } catch (error) {
//         console.error('Error during registration:', error);
//         ws.send(JSON.stringify({ error: 'Registration failed' }));
//       }
//     }

//     // Handle user login
//     if (data.action === 'login') {
//       const { username, password } = data;

//       try {
//         const [rows] = await db.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
//         if (rows.length > 0) {
//           clients[username] = ws;
//           ws.username = username;
//           ws.send(JSON.stringify({ success: `User ${username} logged in successfully` }));
//           console.log(`User ${username} logged in`);
//           await broadcastActiveUsers();
//           await broadcastGroups();
//         } else {
//           ws.send(JSON.stringify({ error: 'Invalid username or password' }));
//         }
//       } catch (error) {
//         console.error('Error during login:', error);
//         ws.send(JSON.stringify({ error: 'Login failed' }));
//       }
//     }

//     // Handle direct messages between users
//     if (data.action === 'sendMessage') {
//       const { to, content } = data;
//       if (ws.username) {
//         await storeChatMessage(ws.username, to, content); // Store the chat message in the database
//         if (clients[to]) {
//           const message = { from: ws.username, content };
//           clients[to].send(JSON.stringify(message));
          
//         }
//       } else {
//         ws.send(JSON.stringify({ error: 'You must be logged in to send messages' }));
//       }
//     }

//     // Handle group creation
//     if (data.action === 'createGroup') {
//       const { groupName } = data;
//       try {
//         const [result] = await db.execute('INSERT INTO chat_groups (group_name) VALUES (?)', [groupName]);
//         if (result.affectedRows > 0) {
//           ws.send(JSON.stringify({ success: `Group ${groupName} created successfully.` }));
//           console.log(`Group ${groupName} created`);
//         } else {
//           ws.send(JSON.stringify({ error: `Failed to create group ${groupName}.` }));
//         }
//       } catch (error) {
//         console.error('Error during group creation:', error);
//         ws.send(JSON.stringify({ error: 'Group creation failed' }));
//       }
//     }

//     // Handle joining a group
//     if (data.action === 'joinGroup') {
//       const { groupName } = data;
//       try {
//         const [groupRows] = await db.execute('SELECT id FROM chat_groups WHERE group_name = ?', [groupName]);
//         if (groupRows.length > 0) {
//           const groupId = groupRows[0].id;
//           await db.execute('INSERT INTO group_members (group_id, username) VALUES (?, ?)', [groupId, ws.username]);
//           ws.send(JSON.stringify({ success: `Joined group ${groupName}.` }));
//           console.log(`${ws.username} joined group ${groupName}`);
//         } else {
//           ws.send(JSON.stringify({ error: `Group ${groupName} does not exist.` }));
//         }
//       } catch (error) {
//         console.error('Error joining group:', error);
//         ws.send(JSON.stringify({ error: 'Failed to join group' }));
//       }
//     }

//     // Handle sending group messages
//     if (data.action === 'sendGroupMessage') {
//       const { groupName, content } = data;
//       try {
//         const [groupRows] = await db.execute('SELECT id FROM chat_groups WHERE group_name = ?', [groupName]);
//         if (groupRows.length > 0) {
//           const groupId = groupRows[0].id;
//           const members = await db.execute('SELECT username FROM group_members WHERE group_id = ?', [groupId]);
          
//           members[0].forEach(member => {
//             if (clients[member.username]) {
//               const message = { from: ws.username, content, group: groupName };
//               clients[member.username].send(JSON.stringify(message));
//             }
//           });
//           await storeGroupMessage(groupId, ws.username, content); // Store the group message in the database
//         } else {
//           ws.send(JSON.stringify({ error: `Group ${groupName} does not exist.` }));
//         }
//       } catch (error) {
//         console.error('Error sending group message:', error);
//         ws.send(JSON.stringify({ error: 'Failed to send group message' }));
//       }
//     }

//     // Handle request for chat history
//     if (data.action === 'getChatHistory') {
//       const { withUser } = data;
//       if (ws.username) {
//         try {
//           // Retrieve chat history between the two users
//           const [rows] = await db.execute(
//             'SELECT * FROM chat_history WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY timestamp',
//             [ws.username, withUser, withUser, ws.username]
//           );

//           // Send chat history along with selected user to the requesting user
//           ws.send(JSON.stringify({ chatHistory: rows, selectedUser: withUser }));
//         } catch (error) {
//           console.error('Error retrieving chat history:', error);
//           ws.send(JSON.stringify({ error: 'Failed to retrieve chat history' }));
//         }
//       } else {
//         ws.send(JSON.stringify({ error: 'You must be logged in to retrieve chat history' }));
//       }
//     }

//      // Handle request for group chat history
//     if (data.action === 'getGroupChatHistory') {
//       const { withGroup } = data;
//       try {
//         // Retrieve the group ID for the specified group name
//         const [groupRows] = await db.execute('SELECT id FROM chat_groups WHERE group_name = ?', [withGroup]);

//         if (groupRows.length > 0) {
//           const groupId = groupRows[0].id;

//           // Retrieve the chat history for the specified group
//           const [chatRows] = await db.execute(
//             'SELECT sender, message, timestamp FROM group_chat_history WHERE group_id = ? ORDER BY timestamp',
//             [groupId]
//           );

//           // Send group chat history back to the client
//           ws.send(JSON.stringify({ groupChatHistory: chatRows, selectedGroup: withGroup }));
//         } else {
//           ws.send(JSON.stringify({ error: `Group ${withGroup} does not exist.` }));
//         }
//       } catch (error) {
//         console.error('Error retrieving group chat history:', error);
//         ws.send(JSON.stringify({ error: 'Failed to retrieve group chat history' }));
//       }
//     }
//     // Handle call requests
//     if (data.action === 'callUser') {
//       const { to } = data;
//       if (clients[to]) {
//         // Notify the receiving client about the incoming call
//         clients[to].send(JSON.stringify({ action: 'incomingCall', from: ws.username }));
//       } else {
//         ws.send(JSON.stringify({ error: 'User not online' }));
//       }
//     }
//     // Handle answer to a call
//     if (data.action === 'sendAnswer') {
//       const { answer, to } = data;
//       if (clients[to]) {
//         clients[to].send(JSON.stringify({ action: 'callAnswer', answer: answer, from: ws.username }));
//       }
//     }
//     // Handle call decline
//     if (data.action === 'callDeclined') {
//       const { to } = data;
//       if (clients[to]) {
//         clients[to].send(JSON.stringify({ action: 'callDeclined', from: ws.username }));
//       }
//     }
//     // Handle ICE candidate exchange
//     if (data.action === 'sendICECandidate') {
//       const { candidate, to } = data;
//       if (clients[to]) {
//         clients[to].send(JSON.stringify({ action: 'receiveICECandidate', candidate: candidate, from: ws.username }));
//       }
//     }
//     // Handle ending the call
//     if (data.action === 'endCall') {
//       const { to } = data;
//       if (clients[to]) {
//         clients[to].send(JSON.stringify({ action: 'callEnded', from: ws.username }));
//       }
//     }


//   });

//   ws.on('close', () => {
//     console.log('A client disconnected');
//     delete clients[ws.username]; // Remove the user from the clients list on disconnect
//     // broadcastActiveUsers();
//   });
// });
