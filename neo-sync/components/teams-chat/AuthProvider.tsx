"use client"
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/lib/msGraphConfig";
import { useEffect } from "react";

const msalInstance = new PublicClientApplication(msalConfig);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check for IE11 only on client side
    if (typeof window !== 'undefined') {
      const isIE11 = window.navigator.userAgent.indexOf("MSIE ") > -1 || 
                     window.navigator.userAgent.indexOf("Trident/") > -1;
                     
      if (!msalInstance.getConfiguration().system?.allowRedirectInIframe && isIE11) {
        msalInstance.setNavigationClient(msalInstance.getConfiguration().system?.navigationClient!);
      }
    }
  }, []);

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
} 