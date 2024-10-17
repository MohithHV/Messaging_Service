CREATE DATABASE messaging_service;

USE messaging_service;

-- Create users table
CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(50) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL
);

-- Create chat history table for direct messages
CREATE TABLE chat_history (
	id INT AUTO_INCREMENT PRIMARY KEY,
	sender VARCHAR(50),
	receiver VARCHAR(50),
	message TEXT,
	timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (sender) REFERENCES users(username),
	FOREIGN KEY (receiver) REFERENCES users(username)
);

-- Create groups table
CREATE TABLE chat_groups (
	id INT AUTO_INCREMENT PRIMARY KEY,
	group_name VARCHAR(100) NOT NULL UNIQUE
);

-- Create group members table
CREATE TABLE group_members (
	id INT AUTO_INCREMENT PRIMARY KEY,
	group_id INT,
	username VARCHAR(50),
	FOREIGN KEY (group_id) REFERENCES chat_groups(id),
	FOREIGN KEY (username) REFERENCES users(username)
);

-- Create group chat history table for group messages
CREATE TABLE group_chat_history (
	id INT AUTO_INCREMENT PRIMARY KEY,
	group_id INT,
	sender VARCHAR(50),
	message TEXT,
	timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (group_id) REFERENCES chat_groups(id),
	FOREIGN KEY (sender) REFERENCES users(username)
);


