"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, User } from "lucide-react"; // Importamos X para el botón de cerrar

// Tipos para los mensajes del chatbot
interface Message {
  sender: "AI" | "User";
  text: string;
}

// Componente para el mensaje del Chat
const ChatMessage: React.FC<{ message: Message }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3 }}
    className="flex gap-3 my-4 text-gray-600 text-sm"
  >
    {/* Avatar del usuario o AI */}
    <Avatar sender={message.sender} />

    {/* Contenido del mensaje */}
    <p
      className={`leading-relaxed max-w-[75%] p-2 rounded-md ${
        message.sender === "User"
          ? "bg-gray-100 text-gray-700 self-end"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      <span className="block font-bold">{message.sender}</span> {message.text}
    </p>
  </motion.div>
);

// Componente para el avatar del remitente
const Avatar: React.FC<{ sender: "AI" | "User" }> = ({ sender }) => (
  <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
    <div className="rounded-full bg-gray-100 border p-1">
      {sender === "AI" ? (
        <Bot size={20} className="text-black" />
      ) : (
        <User size={20} className="text-black" />
      )}
    </div>
  </span>
);

// Componente principal del Chatbot
const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para el despliegue del chatbot
  const [messages, setMessages] = useState<Message[]>([
    { sender: "AI", text: "Hola, ¿En qué puedo ayudarte?" },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Manejo del envío de mensajes
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage: Message = { sender: "User", text: inputValue };
      setMessages([...messages, newMessage]);
      setInputValue(""); // Limpiar el input después de enviar el mensaje
    }
  };

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
            className="fixed inset-0 z-50 bg-white p-6 rounded-lg border border-gray-200 w-full h-full md:w-[440px] md:h-[634px] md:max-w-[440px] md:inset-auto md:ml-4 md:bottom-4 md:left-auto flex flex-col"
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
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSendMessage={handleSendMessage}
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
    className="absolute bottom-4 left-4 z-50 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 cursor-pointer border-gray-200 p-0 normal-case leading-5"
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
  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
    <div className="flex flex-col">
      <h2 className="font-semibold text-lg tracking-tight">Chatbot</h2>
      <p className="text-sm text-gray-500">Por Softies</p>
    </div>
    <button onClick={close} className="text-gray-600 hover:text-gray-900">
      <X size={20} />
    </button>
  </div>
);

// Componente de la caja de entrada de texto
const ChatInput: React.FC<{
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}> = ({ inputValue, setInputValue, handleSendMessage }) => (
  <div className="mt-auto flex items-center pt-4">
    <form
      className="flex items-center justify-center w-full space-x-2"
      onSubmit={handleSendMessage}
    >
      <input
        className="flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-900"
        placeholder="Escribe tu mensaje"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        className="inline-flex items-center justify-center rounded-md text-sm font-medium text-white disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-gray-900 h-10 px-4 py-2"
        type="submit"
      >
        Enviar
      </button>
    </form>
  </div>
);

export default Chatbot;