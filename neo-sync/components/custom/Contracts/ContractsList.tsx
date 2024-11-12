"use client";

import React, { useState, useEffect } from "react";
import ContractCard from "./ContractCard";
import { FileObject } from "@supabase/storage-js";
import { supabase } from "@/lib/db";
import { format } from "date-fns";

interface DocumentWithPreview extends FileObject {
  previewUrl: string | null;
}

export default function ContractsList() {
  const [documents, setDocuments] = useState<DocumentWithPreview[]>([]);

  // Obtener los contratos del bucket de Supabase
  useEffect(() => {
    const fetchContracts = async () => {
      const { data, error } = await supabase.storage.from("contratosMarco").list();

      if (error) {
        console.error("Error fetching contracts:", error);
        return;
      }

      if (!data || data.length === 0) {
        console.log("No contracts found in the bucket.");
        return;
      }

      console.log("Fetching contracts:", data);

      // Para cada documento, obtener la URL firmada
      const documentsWithPreview = await Promise.all(
        data.map(async (doc) => {
          const { data: signedUrlData, error: urlError } = await supabase.storage
            .from("contratosMarco")
            .createSignedUrl(doc.name, 60);

          if (urlError) {
            console.error("Error fetching preview URL:", urlError);
            return { ...doc, previewUrl: null };
          }

          return { ...doc, previewUrl: signedUrlData?.signedUrl };
        })
      );

      setDocuments(documentsWithPreview);
    };

    fetchContracts();
  }, []);

  return (
    <div className="flex flex-wrap gap-2 w-full">
      { documents.map((doc) => (
        <ContractCard
          key={doc.name}
          title={doc.name}
          contractId={doc.id}
          previewUrl={doc.previewUrl || ""}
          createdAt={format(new Date(doc.created_at), "dd/MM/yyyy")}
        />
      ))
      }
    </div>
  );
}

