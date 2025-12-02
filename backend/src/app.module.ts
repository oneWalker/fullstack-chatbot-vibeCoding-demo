import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ChatbotModule } from "./chatbot/chatbot.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || "mongodb://localhost:27017/chatbot",
      {
        // Connection options
      }
    ),
    ChatbotModule,
  ],
})
export class AppModule {}
