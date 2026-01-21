import React from 'react';
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
  if (!isOpen || !conversation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
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
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Chat Window */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <ChatWindow conversation={conversation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
