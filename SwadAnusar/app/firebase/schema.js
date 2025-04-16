// app/firebase/schema.js
/**
 * Firestore Database Schema for Chat Functionality
 * This file serves as documentation for the structure of our Firestore database
 */

/**
 * Collections:
 * ---------------
 * 1. users
 *    - Document ID: user's UID from Firebase Auth
 *    - Fields:
 *      - email: string
 *      - name: string
 *      - uniqueId: string (same as document ID)
 *      - photoURL: string (optional)
 *      - status: string (optional)
 *      - createdAt: timestamp
 *      - updatedAt: timestamp
 * 
 * 2. individualChats
 *    - Document ID: combined IDs of both users, sorted and joined with underscore (e.g., "user1_user2")
 *    - Fields:
 *      - participants: array of user IDs
 *      - createdAt: timestamp
 *      - updatedAt: timestamp
 *      - lastMessage: string (optional)
 *      - lastMessageTimestamp: timestamp (optional)
 *    
 *    Subcollection: messages
 *    - Document ID: auto-generated
 *    - Fields:
 *      - senderId: string (user ID of sender)
 *      - senderEmail: string
 *      - senderName: string
 *      - timestamp: timestamp
 *      - type: string ("text" or "recipe")
 *      - text: string (for text messages)
 *      - recipe: object (for recipe messages)
 *        - id: string
 *        - title: string
 *        - finalImage: string (optional)
 *        - ingredients: array
 *        - steps: array
 *        - ... other recipe fields
 * 
 * 3. groupChats
 *    - Document ID: auto-generated or custom group ID
 *    - Fields:
 *      - name: string
 *      - members: array of user IDs
 *      - createdAt: timestamp
 *      - updatedAt: timestamp
 *      - createdBy: string (user ID)
 *      - photoURL: string (optional)
 *      - lastMessage: string (optional)
 *      - lastMessageTimestamp: timestamp (optional)
 *    
 *    Subcollection: messages
 *    - Document ID: auto-generated
 *    - Fields:
 *      - senderId: string (user ID of sender)
 *      - senderEmail: string
 *      - senderName: string
 *      - timestamp: timestamp
 *      - type: string ("text" or "recipe")
 *      - text: string (for text messages)
 *      - recipe: object (for recipe messages)
 *        - id: string
 *        - title: string
 *        - finalImage: string (optional)
 *        - ingredients: array
 *        - steps: array
 *        - ... other recipe fields
 * 
 * Indexes Required:
 * ----------------
 * 1. Collection: individualChats
 *    - Fields: participants (array-contains), lastMessageTimestamp (desc)
 * 
 * 2. Collection: groupChats
 *    - Fields: members (array-contains), lastMessageTimestamp (desc)
 */

// This file is for documentation purposes only
// Implementation is in the services/chat.js and services/user.js files