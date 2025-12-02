import { Controller, Post, Body, Get, Param, Res } from "@nestjs/common";
import { Response } from "express";
import { ChatbotService } from "./chatbot.service";
import { CreateMessageDto } from "./dto/create-message.dto";

@Controller("chatbot")
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post("message")
  async sendMessage(@Body() createMessageDto: CreateMessageDto) {
    return await this.chatbotService.processMessage(createMessageDto);
  }

  @Post("message/stream")
  async sendMessageStream(
    @Body() createMessageDto: CreateMessageDto,
    @Res() res: Response
  ) {
    // Set headers for Server-Sent Events
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    
    // CORS headers for streaming (已由全局 CORS 配置处理，这里保留以确保兼容)
    const origin = res.req.headers.origin;
    if (origin && (origin === 'http://localhost:5173' || origin === 'http://localhost:5174')) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }

    await this.chatbotService.processMessageStream(createMessageDto, res);
  }

  @Get("conversations")
  async getAllConversations(@Res() res: Response) {
    // 禁用缓存，让每次都返回 200 而不是 304
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    
    const conversations = await this.chatbotService.getAllConversations();
    return res.json(conversations);
  }

  @Get("history/:conversationId")
  async getHistory(
    @Param("conversationId") conversationId: string,
    @Res() res: Response
  ) {
    // 禁用缓存，让每次都返回 200 而不是 304
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    
    const history = await this.chatbotService.getConversationHistory(conversationId);
    return res.json(history);
  }

  @Post("conversations/:conversationId/delete")
  async deleteConversation(@Param("conversationId") conversationId: string) {
    await this.chatbotService.deleteConversation(conversationId);
    return { success: true, message: "Conversation deleted successfully" };
  }

  @Get("health")
  healthCheck() {
    return { status: "ok", message: "Chatbot service is running" };
  }
}
