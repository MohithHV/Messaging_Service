// "use client"; // This line is necessary to mark this as a Client Component 

// import Image from "next/image";
// import MessageBubble from "./components/MessageBubble";
// import ChatInput from "./components/ChatInput";
// import LoginForm from "./components/LoginForm"; // Import the LoginForm component
// import { useState, useEffect } from "react";

// interface Message {
//   text: string;
//   timestamp: string;
//   isSent: boolean;
//   groupId?: string; // Optional: group ID for group messages
// }

// interface Group {
//   id: string;
//   name: string;
//   members: string[]; // Array of usernames
// }

// export default function Home() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputValue, setInputValue] = useState("");
//   const [username, setUsername] = useState("");
//   const [ws, setWs] = useState<WebSocket | null>(null);
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

//   // Fetch messages from local storage when the component mounts
//   useEffect(() => {
//     const storedMessages = localStorage.getItem("messages");
//     if (storedMessages) {
//       setMessages(JSON.parse(storedMessages));
//     }

//     // Create WebSocket connection
//     const websocket = new WebSocket("ws://localhost:8080");

//     websocket.onopen = () => {
//       console.log("Connected to WebSocket server");
//       // Test functionality: Send a test message to ensure the connection works
//       websocket.send(JSON.stringify({ message: "Test connection established." }));
//     };

//     websocket.onmessage = (event) => {
//       try {
//         const newMessage = JSON.parse(event.data);
//         setMessages((prevMessages) => [...prevMessages, newMessage]);
//       } catch (error) {
//         console.error("Error parsing message:", error);
//       }
//     };

//     websocket.onclose = () => {
//       console.log("Disconnected from WebSocket server");
//     };

//     setWs(websocket);

//     // Cleanup on unmount
//     return () => {
//       websocket.close(); // Clean up the connection on component unmount
//     };
//   }, []);

//   const handleSendMessage = () => {
//     if (inputValue.trim() !== "" && ws && currentGroupId) {
//       const newMessage = {
//         text: inputValue,
//         timestamp: new Date().toLocaleTimeString(),
//         isSent: true,
//         groupId: currentGroupId, // Attach the current group ID
//       };

//       // Send message to the WebSocket server
//       ws.send(JSON.stringify({ groupId: currentGroupId, message: newMessage }));
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//       setInputValue(""); // Clear the input after sending
//     }
//   };

//   const handleLogin = (username: string) => {
//     setUsername(username); // Set the username state
//   };

//   const handleLogout = () => {
//     setUsername(""); // Clear the username state
//     setCurrentGroupId(null); // Clear current group on logout
//   };

//   // Update local storage whenever messages change
//   useEffect(() => {
//     localStorage.setItem("messages", JSON.stringify(messages));
//   }, [messages]);

//   // Create a new group
//   const createGroup = (groupName: string) => {
//     const newGroup = {
//       id: Date.now().toString(),
//       name: groupName,
//       members: [username],
//     };
//     setGroups((prevGroups) => [...prevGroups, newGroup]);
//     setCurrentGroupId(newGroup.id); // Switch to the newly created group
//   };

//   // Leave a group
//   const leaveGroup = (groupId: string) => {
//     setGroups((prevGroups) =>
//       prevGroups.map((group) => {
//         if (group.id === groupId) {
//           return { ...group, members: group.members.filter(member => member !== username) };
//         }
//         return group;
//       })
//     );
//     setCurrentGroupId(null); // Clear current group
//   };

//   // Manage group members (future implementation)
//   const manageGroupMembers = (groupId: string, action: string, member: string) => {
//     setGroups((prevGroups) =>
//       prevGroups.map((group) => {
//         if (group.id === groupId) {
//           if (action === "add") {
//             return { ...group, members: [...group.members, member] }; // Add member
//           } else if (action === "remove") {
//             return { ...group, members: group.members.filter(m => m !== member) }; // Remove member
//           }
//         }
//         return group;
//       })
//     );
//   };

//   // Promote group admin (future implementation)
//   const promoteAdmin = (groupId: string, member: string) => {
//     // Implementation to promote a member to admin (you can store admins in the group object)
//     console.log(`Promoting ${member} to admin in group ${groupId}.`);
//   };

//   // Adding direct messaging feature (future implementation)
//   const sendDirectMessage = (recipient: string, message: string) => {
//     // Implement logic to send direct messages to users
//     console.log(`Sending direct message to ${recipient}: ${message}`);
//   };

//   // Render the component
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
//         <h1 className="text-3xl font-bold">Welcome to Connected!</h1>
//         <Image
//           className="dark:invert"
//           src="https://nextjs.org/icons/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />

//         {/* Show the LoginForm if the user is not logged in */}
//         {!username ? (
//           <LoginForm handleLogin={handleLogin} />
//         ) : (
//           <>
//             {/* Group selection */}
//             <div className="flex flex-col gap-2">
//               <h2 className="text-2xl">Groups</h2>
//               {groups.map((group) => (
//                 <button
//                   key={group.id}
//                   onClick={() => setCurrentGroupId(group.id)}
//                   className="bg-blue-500 text-white p-2 rounded"
//                 >
//                   {group.name}
//                 </button>
//               ))}
//               {/* Button to create a new group */}
//               <button
//                 onClick={() => createGroup(prompt("Enter group name") || "")}
//                 className="bg-green-500 text-white p-2 rounded"
//               >
//                 Create New Group
//               </button>
//             </div>

//             {/* Displaying the message bubbles for the selected group */}
//             <div className="flex flex-col gap-4 w-full max-w-md">
//               {messages
//                 .filter((msg) => msg.groupId === currentGroupId) // Filter messages by group ID
//                 .map((messageObj, index) => (
//                   <MessageBubble
//                     key={index}
//                     message={messageObj.text}
//                     timestamp={messageObj.timestamp}
//                     isSent={messageObj.isSent}
//                     onDelete={() => {
//                       // Add your delete functionality here if needed
//                     }}
//                   />
//                 ))}
//             </div>

//             {/* Chat input component */}
//             <ChatInput
//               inputValue={inputValue}
//               setInputValue={setInputValue}
//               handleSendMessage={handleSendMessage}
//             />

//             {/* Leave group button */}
//             {currentGroupId && (
//               <button
//                 onClick={() => leaveGroup(currentGroupId)}
//                 className="bg-red-500 text-white p-2 rounded"
//               >
//                 Leave Group
//               </button>
//             )}

//             {/* Logout button */}
//             <button onClick={handleLogout} className="mt-4 bg-red-500 text-white p-2 rounded">
//               Logout
//             </button>
//           </>
//         )}
//       </main>

//       <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="https://nextjs.org/icons/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="https://nextjs.org/icons/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="https://nextjs.org/icons/next.svg"
//             alt="Next.js logo"
//             width={16}
//             height={16}
//           />
//           Docs
//         </a>
//       </footer>
//     </div>
//   );
// }

"use client"; // This line is necessary to mark this as a Client Component 

import Image from "next/image";
import MessageBubble from "./molecules/MessageBubble";
import ChatInput from "./organisms/ChatInput";
import LoginForm from "./templates/LoginForm"; // Import the LoginForm component
import { useState, useEffect } from "react";

interface Message {
  text: string;
  timestamp: string;
  isSent: boolean;
  groupId?: string; // Optional: group ID for group messages
}

interface Group {
  id: string;
  name: string;
  members: string[]; // Array of usernames
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  // Fetch messages from local storage when the component mounts
  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    // Create WebSocket connection
    const websocket = new WebSocket("ws://localhost:8080");

    websocket.onopen = () => {
      console.log("Connected to WebSocket server");
      // Test functionality: Send a test message to ensure the connection works
      websocket.send(JSON.stringify({ message: "Test connection established." }));
    };

    websocket.onmessage = (event) => {
      try {
        const newMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    websocket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    setWs(websocket);

    // Cleanup on unmount
    return () => {
      websocket.close(); // Clean up the connection on component unmount
    };
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim() !== "" && ws && currentGroupId) {
      const newMessage = {
        text: inputValue,
        timestamp: new Date().toLocaleTimeString(),
        isSent: true,
        groupId: currentGroupId, // Attach the current group ID
      };

      // Send message to the WebSocket server
      ws.send(JSON.stringify({ groupId: currentGroupId, message: newMessage }));
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputValue(""); // Clear the input after sending
    }
  };

  const handleLogin = (username: string) => {
    setUsername(username); // Set the username state
  };

  const handleLogout = () => {
    setUsername(""); // Clear the username state
    setCurrentGroupId(null); // Clear current group on logout
  };

  // Update local storage whenever messages change
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  // Create a new group
  const createGroup = (groupName: string) => {
    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      members: [username],
    };
    setGroups((prevGroups) => [...prevGroups, newGroup]);
    setCurrentGroupId(newGroup.id); // Switch to the newly created group
  };

  // Leave a group
  const leaveGroup = (groupId: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          return { ...group, members: group.members.filter(member => member !== username) };
        }
        return group;
      })
    );
    setCurrentGroupId(null); // Clear current group
  };


  // Render the component
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Welcome to Connected!</h1>
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {/* Show the LoginForm if the user is not logged in */}
        {!username ? (
          <LoginForm handleLogin={handleLogin} />
        ) : (
          <>
            {/* Group selection */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">Groups</h2>
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setCurrentGroupId(group.id)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  {group.name}
                </button>
              ))}
              {/* Button to create a new group */}
              <button
                onClick={() => createGroup(prompt("Enter group name") || "")}
                className="bg-green-500 text-white p-2 rounded"
              >
                Create New Group
              </button>
            </div>

            {/* Displaying the message bubbles for the selected group */}
            <div className="flex flex-col gap-4 w-full max-w-md">
              {messages
                .filter((msg) => msg.groupId === currentGroupId) // Filter messages by group ID
                .map((messageObj, index) => (
                  <MessageBubble
                    key={index}
                    message={messageObj.text}
                    timestamp={messageObj.timestamp}
                    isSent={messageObj.isSent}
                    onDelete={() => {
                      // Add your delete functionality here if needed
                    }}
                  />
                ))}
            </div>

            {/* Chat input component */}
            <ChatInput
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
            />

            {/* Leave group button */}
            {currentGroupId && (
              <button
                onClick={() => leaveGroup(currentGroupId)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Leave Group
              </button>
            )}

            {/* Logout button */}
            <button onClick={handleLogout} className="mt-4 bg-red-500 text-white p-2 rounded">
              Logout
            </button>
          </>
        )}
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/next.svg"
            alt="Next.js logo"
            width={16}
            height={16}
          />
          Docs
        </a>
      </footer>
    </div>
  );
}
