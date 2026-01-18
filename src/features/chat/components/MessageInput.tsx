import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import './MessageInput.css';

interface MessageInputProps {
    onSend: (content: string) => void;
    onImageUpload?: (file: File) => void;
    disabled?: boolean;
    placeholder?: string;
}

export default function MessageInput({
    onSend,
    onImageUpload,
    disabled = false,
    placeholder = 'Введите сообщение...',
}: MessageInputProps) {
    const [text, setText] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed || disabled) return;
        
        onSend(trimmed);
        setText('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onImageUpload) {
            onImageUpload(file);
        }
        e.target.value = '';
    };

    return (
        <div className="message-input">
            {/* Image upload button */}
            {onImageUpload && (
                <>
                    <button 
                        className="attach-btn" 
                        onClick={handleImageClick}
                        disabled={disabled}
                        title="Прикрепить изображение"
                    >
                        📎
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </>
            )}

            {/* Text input */}
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={1}
            />

            {/* Send button */}
            <button
                className="send-btn"
                onClick={handleSend}
                disabled={disabled || !text.trim()}
            >
                ➤
            </button>
        </div>
    );
}
