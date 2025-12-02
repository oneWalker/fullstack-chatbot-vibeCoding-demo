# MongoDB Setup Guide

This guide explains how to set up MongoDB for the chatbot application.

## Installation

### macOS

Using Homebrew:
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
```

Start MongoDB:
```bash
brew services start mongodb-community@7.0
```

### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Windows

Download and install from: https://www.mongodb.com/try/download/community

## Verify Installation

```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ping')"
```

## Create Database and Collection

MongoDB will automatically create the database and collection when you first insert data, but you can also create them manually:

```bash
# Connect to MongoDB
mongosh

# Switch to chatbot database (creates if doesn't exist)
use chatbot

# Create messages collection with validation
db.createCollection("messages", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["conversationId", "role", "content"],
      properties: {
        conversationId: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        role: {
          bsonType: "string",
          enum: ["user", "assistant", "system"],
          description: "must be a string and is required"
        },
        content: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        createdAt: {
          bsonType: "date",
          description: "timestamp when message was created"
        },
        updatedAt: {
          bsonType: "date",
          description: "timestamp when message was updated"
        }
      }
    }
  }
})

# Create index on conversationId for better query performance
db.messages.createIndex({ "conversationId": 1 })
db.messages.createIndex({ "createdAt": 1 })

# Exit mongosh
exit
```

## Connection String

The application uses the following connection string format:

```
mongodb://localhost:27017/chatbot
```

For MongoDB Atlas (cloud):
```
mongodb+srv://username:password@cluster.mongodb.net/chatbot?retryWrites=true&w=majority
```

## Configuration in .env

```env
MONGODB_URI=mongodb://localhost:27017/chatbot
```

## Useful MongoDB Commands

### View all databases
```bash
mongosh
show dbs
```

### View collections in current database
```bash
use chatbot
show collections
```

### Query messages
```bash
# Get all messages
db.messages.find().pretty()

# Get messages for a specific conversation
db.messages.find({ conversationId: "conv_123" }).sort({ createdAt: 1 })

# Count messages
db.messages.countDocuments()
```

### Delete data
```bash
# Delete all messages
db.messages.deleteMany({})

# Delete messages from a specific conversation
db.messages.deleteMany({ conversationId: "conv_123" })

# Drop the entire collection
db.messages.drop()
```

## MongoDB Compass (GUI)

For a graphical interface, install MongoDB Compass:

Download from: https://www.mongodb.com/try/download/compass

Connection string: `mongodb://localhost:27017`

## Why MongoDB for Chat Messages?

MongoDB is well-suited for chat applications because:

1. **Flexible Schema**: Easy to add new fields (metadata, attachments, etc.) without migrations
2. **Document Structure**: Messages are naturally document-based
3. **Fast Writes**: Optimized for high-frequency inserts
4. **Scalability**: Easy to scale horizontally with sharding
5. **JSON-like**: Works seamlessly with JavaScript/TypeScript applications
6. **Indexing**: Efficient queries on conversationId and timestamps

