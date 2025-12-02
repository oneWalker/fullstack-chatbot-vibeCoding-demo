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

