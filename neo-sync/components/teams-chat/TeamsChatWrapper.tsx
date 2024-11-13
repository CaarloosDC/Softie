// components/teams-chat/TeamsChatWrapper.tsx
"use client"

import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./msGraphConfig";
import TeamsChat from "./TeamsChat";

const msalInstance = new PublicClientApplication(msalConfig);

export default function TeamsChatWrapper() {
  return (
    <MsalProvider instance={msalInstance}>
      <TeamsChat />
    </MsalProvider>
  );
}