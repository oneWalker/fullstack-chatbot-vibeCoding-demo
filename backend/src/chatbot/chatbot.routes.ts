import { Routes } from '@nestjs/core';
import { ChatbotModule } from './chatbot.module';

export const chatbotRoutes: Routes = [
  {
    path: 'api',
    children: [
      {
        path: 'chatbot',
        module: ChatbotModule,
      },
    ],
  },
];

