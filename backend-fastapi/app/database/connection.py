from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

# Global MongoDB client
mongo_client: Optional[AsyncIOMotorClient] = None
database = None

async def connect_to_mongo(mongodb_uri: str):
    """Connect to MongoDB"""
    global mongo_client, database
    mongo_client = AsyncIOMotorClient(mongodb_uri)
    database = mongo_client.get_default_database()
    print(f"Connected to MongoDB at {mongodb_uri}")

async def close_mongo_connection():
    """Close MongoDB connection"""
    global mongo_client
    if mongo_client:
        mongo_client.close()
        print("Closed MongoDB connection")

def get_database():
    """Get the database instance"""
    global database
    return database

def get_collection(collection_name: str):
    """Get a collection from the database"""
    db = get_database()
    if db is None:
        # Return None instead of raising an exception
        # This allows the application to import modules without database connection
        return None
    return db[collection_name]