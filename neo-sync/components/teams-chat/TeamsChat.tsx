"use client"

import React, { useState, useEffect, useRef } from 'react';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import parse from 'html-react-parser';
import { TeamsService } from './teamsService';
import { loginRequest } from './msGraphConfig';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from 'lucide-react';

interface Message {
  id: string;
  from?: {
    user?: {
      displayName?: string;
      id?: string;
    }
  };
  body?: {
    content?: string;
    contentType?: string;
  };
  messageType?: string;
  createdDateTime: string;
}

export default function TeamsChat() {
  const { instance, accounts } = useMsal();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [teamsService, setTeamsService] = useState<TeamsService | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatId = process.env.NEXT_PUBLIC_TEAMS_CHAT_ID;
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoginError(null);
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  useEffect(() => {
    const initTeamsService = async () => {
      if (!accounts[0] || !chatId) return;

      try {
        setLoading(true);
        const service = new TeamsService(instance, accounts[0]);
        setTeamsService(service);
        const response = await service.getMessages(chatId);
        if (response?.messages) {
          setMessages(response.messages);
        }
      } catch (err) {
        console.error('Error initializing Teams service:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize chat');
      } finally {
        setLoading(false);
      }
    };

    initTeamsService();
  }, [instance, accounts, chatId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamsService || !chatId || !newMessage.trim()) return;

    try {
      await teamsService.sendMessage(chatId, newMessage);
      setNewMessage("");
      const response = await teamsService.getMessages(chatId);
      if (response?.messages) {
        setMessages(response.messages);
        setShouldScrollToBottom(true);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader>
        <h2 className="text-2xl font-bold">Teams Chat</h2>
      </CardHeader>
      <UnauthenticatedTemplate>
        <div className="flex flex-col justify-center items-center h-full space-y-4">
          <Button 
            onClick={handleLogin}
            className="px-6 py-3"
          >
            Sign in with Microsoft
          </Button>
          {loginError && (
            <p className="text-red-500 text-sm">{loginError}</p>
          )}
        </div>
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <CardContent className="flex-1 overflow-hidden p-0">
          {error ? (
            <div className="flex items-center justify-center h-full p-4">
              <p className="text-red-500">{error}</p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-full p-4">
              <p>Loading messages...</p>
            </div>
          ) : (
            <ScrollArea 
              ref={scrollAreaRef} 
              className="h-[calc(600px-8rem)] px-6"
              onScroll={(e) => {
                const target = e.currentTarget;
                const isNearBottom = 
                  target.scrollHeight - target.scrollTop - target.clientHeight < 100;
                setShouldScrollToBottom(isNearBottom);
              }}
            >
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarImage 
                        src={`https://graph.microsoft.com/v1.0/users/${message.from?.user?.id}/photo/$value`} 
                      />
                      <AvatarFallback>
                        {message.from?.user?.displayName?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">
                          {message.from?.user?.displayName || 'Unknown User'}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdDateTime).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="mt-1 prose prose-sm max-w-none">
                        {message.body?.content && parse(message.body.content)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-2">
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              disabled={loading || !!error}
            />
            <Button type="submit" size="icon" disabled={loading || !!error}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </AuthenticatedTemplate>
    </Card>
  );
}