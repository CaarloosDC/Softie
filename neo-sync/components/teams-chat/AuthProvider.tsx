// components/teams-chat/AuthProvider.tsx
"use client"
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/lib/msGraphConfig";
import { useEffect, useState } from "react";

const msalInstance = new PublicClientApplication(msalConfig);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await msalInstance.initialize();
        
        // Check for IE11
        if (typeof window !== 'undefined') {
          const isIE11 = window.navigator.userAgent.indexOf("MSIE ") > -1 || 
                        window.navigator.userAgent.indexOf("Trident/") > -1;
                        
          if (!msalInstance.getConfiguration().system?.allowRedirectInIframe && isIE11) {
            msalInstance.setNavigationClient(msalInstance.getConfiguration().system?.navigationClient!);
          }
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error("MSAL Initialization Error:", error);
      }
    };

    initializeMsal();
  }, []);

  if (!isInitialized) {
    return <div>Initializing authentication...</div>; // Or any loading component
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
} 