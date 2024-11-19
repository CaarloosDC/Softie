// components/teams-chat/teamsService.ts
import { Client } from "@microsoft/microsoft-graph-client";
import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";

export interface Message {
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

export class TeamsService {
  private graphClient: Client;
  private lastKnownMessageId: string | null = null;

  constructor(msalInstance: PublicClientApplication, account: AccountInfo) {
    this.graphClient = Client.init({
      authProvider: async (done) => {
        try {
          const response = await msalInstance.acquireTokenSilent({
            account,
            scopes: ["Chat.ReadWrite", "ChatMessage.Read", "ChatMessage.Send"]
          });
          done(null, response.accessToken);
        } catch (error) {
          done(error as Error, null);
        }
      }
    });
  }

  async getMessages(chatId: string) {
    try {
      const response = await this.graphClient
        .api(`/chats/${chatId}/messages`)
        .query({
          $top: 50
        })
        .get();

      const messages = response.value || [];
      console.log('Fetched messages:', messages);

      return messages.sort((a: { createdDateTime: string | number | Date; }, b: { createdDateTime: string | number | Date; }) => 
        new Date(a.createdDateTime).getTime() - new Date(b.createdDateTime).getTime()
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async sendMessage(chatId: string, content: string) {
    try {
      return await this.graphClient
        .api(`/chats/${chatId}/messages`)
        .post({
          body: {
            content,
            contentType: "text"
          }
        });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}