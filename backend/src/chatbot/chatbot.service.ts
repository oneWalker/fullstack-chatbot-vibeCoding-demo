import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import OpenAI from "openai";
import { Response } from "express";
import { Message, MessageDocument } from "./entities/message.entity";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class ChatbotService {
  private openai: OpenAI;

  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>
  ) {
    this.openai = new OpenAI({
      baseURL: process.env.OPENAI_BASE_URL,
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log(process.env.OPENAI_BASE_URL);
    console.log(process.env.OPENAI_API_KEY);
    console.log(process.env.MODEL);
  }

  async processMessage(createMessageDto: CreateMessageDto) {
    const { message, conversationId } = createMessageDto;

    // Save user message to database
    const userMessage = new this.messageModel({
      conversationId,
      role: "user",
      content: message,
    });
    await userMessage.save();

    // Get conversation history for context
    const history = await this.getConversationHistory(conversationId);

    // Prepare messages for OpenAI
    const messages = history.map((msg) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    }));

    try {
      // Call OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: process.env.MODEL,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Be concise and friendly.",
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const aiResponse =
        completion.choices[0]?.message?.content ||
        "Sorry, I could not generate a response.";

      // Save AI response to database
      const assistantMessage = new this.messageModel({
        conversationId,
        role: "assistant",
        content: aiResponse,
      });
      await assistantMessage.save();

      return {
        message: aiResponse,
        conversationId,
        timestamp: assistantMessage.createdAt,
      };
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      return {
        message: "Sorry, I encountered an error processing your request.",
        conversationId,
        error: error.message,
      };
    }
  }

  async getConversationHistory(conversationId: string) {
    return await this.messageModel
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .exec();
  }

  async getAllConversations() {
    // Get all unique conversation IDs with their latest message
    const conversations = await this.messageModel.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$content" },
          lastMessageRole: { $first: "$role" },
          lastMessageTime: { $first: "$createdAt" },
          messageCount: { $sum: 1 },
          firstMessage: { $last: "$content" },
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
      {
        $project: {
          conversationId: "$_id",
          lastMessage: 1,
          lastMessageRole: 1,
          lastMessageTime: 1,
          messageCount: 1,
          firstMessage: 1,
          _id: 0,
        },
      },
    ]);

    return conversations;
  }

  async deleteConversation(conversationId: string) {
    return await this.messageModel.deleteMany({ conversationId }).exec();
  }

  async processMessageStream(
    createMessageDto: CreateMessageDto,
    res: Response
  ) {
    const { message, conversationId } = createMessageDto;

    try {
      // Save user message to database
      const userMessage = new this.messageModel({
        conversationId,
        role: "user",
        content: message,
      });
      await userMessage.save();

      // Get conversation history for context
      const history = await this.getConversationHistory(conversationId);

      // Prepare messages for OpenAI
      const messages = history.map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      }));

      // Call OpenAI API with streaming
      const stream = await this.openai.chat.completions.create({
        model: process.env.MODEL,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Be concise and friendly.",
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
        stream: true,
      });

      let fullResponse = "";

      // Send initial metadata
      res.write(
        `data: ${JSON.stringify({ type: "start", conversationId })}\n\n`
      );

      // Stream the response chunks
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(
            `data: ${JSON.stringify({ type: "content", content })}\n\n`
          );
        }
      }

      // Save AI response to database
      const assistantMessage = new this.messageModel({
        conversationId,
        role: "assistant",
        content: fullResponse,
      });
      await assistantMessage.save();

      // Send completion signal with metadata
      res.write(
        `data: ${JSON.stringify({
          type: "end",
          conversationId,
          timestamp: assistantMessage.createdAt,
        })}\n\n`
      );

      res.end();
    } catch (error) {
      console.error("Error in stream:", error);
      res.write(
        `data: ${JSON.stringify({
          type: "error",
          message: "Sorry, I encountered an error processing your request.",
          error: error.message,
        })}\n\n`
      );
      res.end();
    }
  }
}
