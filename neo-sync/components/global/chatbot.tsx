"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, User } from "lucide-react";
import { useChat, Message } from "ai/react";

// Componente para el mensaje del Chat
const ChatMessage: React.FC<{ message: Message }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3 }}
    className="flex gap-3 my-4 text-gray-600 dark:text-gray-300 text-sm"
  >
    {/* Avatar del usuario o AI */}
    <Avatar sender={message.role} />

    {/* Contenido del mensaje */}
    <p
      className={`leading-relaxed max-w-[75%] p-2 rounded-md ${
        message.role === "user"
          ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 self-end"
          : "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100"
      }`}
    >
      <span className="block font-bold">
        {message.role === "user" ? "User" : "AI"}
      </span>{" "}
      {message.content}
    </p>
  </motion.div>
);

// Componente para el avatar del remitente
const Avatar: React.FC<{ sender: "assistant" | "user" }> = ({ sender }) => (
  <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
    <div className="rounded-full bg-gray-100 dark:bg-gray-700 border p-1">
      {sender === "assistant" ? (
        <Bot size={20} className="text-black dark:text-white" />
      ) : (
        <User size={20} className="text-black dark:text-white" />
      )}
    </div>
  </span>
);

// Componente principal del Chatbot
const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      { role: "assistant", content: "Hola, ¿En qué puedo ayudarte?" },
    ],
    api: "/api/chat",
  });

  return (
    <div className="relative">
      {/* Botón para abrir/cerrar el chatbot */}
      <ChatbotButton isOpen={isOpen} toggleOpen={() => setIsOpen(!isOpen)} />

      {/* Contenedor del chatbot con animación */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 w-full h-full md:w-[440px] md:h-[634px] md:max-w-[440px] md:inset-auto md:ml-4 md:bottom-4 md:left-auto flex flex-col"
          >
            <ChatbotHeader close={() => setIsOpen(false)} />

            {/* Contenedor de los mensajes */}
            <div className="pr-4 h-full overflow-auto mt-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
              </AnimatePresence>
            </div>

            {/* Caja de entrada de texto */}
            <ChatInput
              inputValue={input}
              handleInputChange={handleInputChange}
              handleSendMessage={handleSubmit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente del botón del chatbot
const ChatbotButton: React.FC<{ isOpen: boolean; toggleOpen: () => void }> = ({
  isOpen,
  toggleOpen,
}) => (
  <button
    className="absolute bottom-4 left-4 z-50 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer border-gray-200 dark:border-gray-600 p-0 normal-case leading-5"
    type="button"
    aria-haspopup="dialog"
    aria-expanded={isOpen}
    onClick={toggleOpen}
  >
    <Bot className="text-white" size={30} />
  </button>
);

// Componente del encabezado del chatbot
const ChatbotHeader: React.FC<{ close: () => void }> = ({ close }) => (
  <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
    <div className="flex flex-col">
      <h2 className="font-semibold text-lg tracking-tight text-gray-900 dark:text-gray-100">
        Botsie
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">Por Softies</p>
    </div>
    <button
      onClick={close}
      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
    >
      <X size={20} />
    </button>
  </div>
);

// Componente de la caja de entrada de texto
const ChatInput: React.FC<{
  inputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}> = ({ inputValue, handleInputChange, handleSendMessage }) => (
  <div className="mt-auto flex items-center pt-4">
    <form
      className="flex items-center justify-center w-full space-x-2"
      onSubmit={handleSendMessage}
    >
      <input
        className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
        placeholder="Escribe tu mensaje"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button
        className="inline-flex items-center justify-center rounded-md text-sm font-medium text-white disabled:pointer-events-none disabled:opacity-50 bg-black dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 h-10 px-4 py-2"
        type="submit"
      >
        Enviar
      </button>
    </form>
  </div>
);

export default Chatbot;
