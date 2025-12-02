# PostgreSQL to MongoDB Migration Summary

This document summarizes the changes made to migrate from PostgreSQL to MongoDB.

## Why MongoDB?

MongoDB is an excellent choice for chat applications because:

1. **Flexible Schema**: Easy to add new fields (metadata, reactions, attachments) without schema migrations
2. **Document-Based**: Chat messages are naturally document-based with varying structures
3. **Fast Writes**: Optimized for high-frequency insert operations
4. **Horizontal Scaling**: Easy to scale with sharding for large datasets
5. **JSON-Native**: Seamless integration with JavaScript/TypeScript
6. **Rich Queries**: Powerful query language for complex conversation analytics

## Changes Made

### Backend Dependencies (`package.json`)

**Removed:**
- `@nestjs/typeorm`
- `typeorm`
- `pg` (PostgreSQL driver)

**Added:**
- `@nestjs/mongoose` (^10.0.2)
- `mongoose` (^8.0.3)

### Code Changes

#### 1. Message Entity → Mongoose Schema

**Before (TypeORM Entity):**
```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationId: string;

  @Column()
  role: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

**After (Mongoose Schema):**
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true, collection: 'messages' })
export class Message {
  @Prop({ required: true, index: true })
  conversationId: string;

  @Prop({ required: true, enum: ['user', 'assistant', 'system'] })
  role: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
```

#### 2. App Module Configuration

**Before (TypeORM):**
```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'chatbot',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
})
```

**After (Mongoose):**
```typescript
MongooseModule.forRoot(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbot',
  {
    // Connection options
  },
)
```

#### 3. Chatbot Module

**Before:**
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
```

**After:**
```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
```

#### 4. Service Implementation

**Before (TypeORM Repository):**
```typescript
constructor(
  @InjectRepository(Message)
  private messageRepository: Repository<Message>,
) {}

// Create
const userMessage = this.messageRepository.create({ ... });
await this.messageRepository.save(userMessage);

// Query
return await this.messageRepository.find({
  where: { conversationId },
  order: { createdAt: 'ASC' },
});
```

**After (Mongoose Model):**
```typescript
constructor(
  @InjectModel(Message.name)
  private messageModel: Model<MessageDocument>,
) {}

// Create
const userMessage = new this.messageModel({ ... });
await userMessage.save();

// Query
return await this.messageModel
  .find({ conversationId })
  .sort({ createdAt: 1 })
  .exec();
```

### Environment Variables

**Before:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=chatbot_user
DB_PASSWORD=your_password
DB_DATABASE=chatbot
```

**After:**
```env
MONGODB_URI=mongodb://localhost:27017/chatbot
```

### Database Setup

**Before (PostgreSQL):**
```bash
# Install
brew install postgresql@15
brew services start postgresql@15

# Create database
psql postgres
CREATE DATABASE chatbot;
CREATE USER chatbot_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE chatbot TO chatbot_user;
```

**After (MongoDB):**
```bash
# Install
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0

# Verify (database created automatically)
mongosh --eval "db.adminCommand('ping')"
```

## Benefits of the Migration

### 1. Simpler Setup
- No user management or privileges
- Database and collection created automatically
- Single connection string

### 2. Better Data Model
- Flexible schema for future enhancements (file attachments, reactions, metadata)
- Automatic timestamp management with `timestamps: true`
- Easy to add conversation-level metadata

### 3. Performance
- Optimized for write-heavy workloads (chat messages)
- Built-in indexing on conversationId
- Better suited for horizontal scaling

### 4. Developer Experience
- More intuitive for JavaScript developers
- Rich query API
- Excellent tooling (MongoDB Compass)

## Backward Compatibility

No migration script is needed if starting fresh. If you have existing PostgreSQL data:

1. Export from PostgreSQL:
```sql
COPY messages TO '/tmp/messages.csv' DELIMITER ',' CSV HEADER;
```

2. Import to MongoDB:
```javascript
// Use a migration script or manually import
db.messages.insertMany([/* transformed data */]);
```

## Future Enhancements Enabled

With MongoDB, you can now easily add:

- **File attachments**: Store file metadata in messages
- **Reactions**: Embed reactions array in messages
- **Rich metadata**: Add user info, sentiment, tags without schema changes
- **Conversation summaries**: Store generated summaries at conversation level
- **Search indexing**: Use MongoDB text search or Atlas Search

## Testing

After migration, verify functionality:

1. Start MongoDB: `brew services start mongodb-community@7.0`
2. Check connection: `mongosh "mongodb://localhost:27017/chatbot"`
3. Start backend: `cd backend && npm run start:dev`
4. Send test message via frontend or API
5. Verify in MongoDB:
```bash
mongosh
use chatbot
db.messages.find().pretty()
```

## Rollback (if needed)

If you need to rollback to PostgreSQL:

1. Restore old code from git: `git checkout <commit-before-migration>`
2. Update package.json dependencies
3. Run `npm install`
4. Update `.env` with PostgreSQL credentials

## Support

For MongoDB-specific issues, see:
- `database/mongodb-setup.md` - Detailed setup guide
- `SETUP.md` - General setup instructions
- MongoDB docs: https://docs.mongodb.com/

