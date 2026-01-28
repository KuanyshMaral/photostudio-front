import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import ChatWindow from '../features/chat/ChatWindow';
import type { Conversation } from '../features/chat/chat.api';

interface ChatModalProps {
  conversation: Conversation | null;
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ 
  conversation, 
  isOpen, 
  onClose 
}) => {
  useEffect(() => {
    // Store the original scroll position
    const scrollY = window.scrollY;
    
    if (isOpen) {
      // Lock body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Store scroll position for restoration
      (document.body as any).dataset.scrollY = scrollY.toString();
    } else {
      // Restore body scroll
      const storedScrollY = (document.body as any).dataset.scrollY;
      if (storedScrollY) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, parseInt(storedScrollY, 10));
        delete (document.body as any).dataset.scrollY;
      }
    }

    // Cleanup function
    return () => {
      const storedScrollY = (document.body as any).dataset.scrollY;
      if (storedScrollY) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, parseInt(storedScrollY, 10));
        delete (document.body as any).dataset.scrollY;
      }
    };
  }, [isOpen]);

  if (!isOpen || !conversation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Чат с {conversation.other_user.name}
            {conversation.studio && (
              <span className="text-sm text-gray-500 ml-2">
                - {conversation.studio.name}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Закрыть"
          >
            <X className="w-6 h-6 text-gray-600 hover:text-gray-900" />
          </button>
        </div>
        
        {/* Chat Window */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <ChatWindow conversation={conversation} />
          </div>
        </div>
        
        {/* Footer with Close Button */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Закрыть чат
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
