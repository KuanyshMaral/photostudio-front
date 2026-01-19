import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import './MessageInput.css';

interface MessageInputProps {
    onSend: (content: string) => void;
    onImageUpload?: (file: File) => void;
    onTypingStart?: () => void;
    onTypingStop?: () => void;
    disabled?: boolean;
    placeholder?: string;
}

export default function MessageInput({
    onSend,
    onImageUpload,
    onTypingStart,
    onTypingStop,
    disabled = false,
    placeholder = 'Введите сообщение...',
}: MessageInputProps) {
    const [text, setText] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<number | null>(null);
    const isTypingRef = useRef(false);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        
        // Typing indicator logic с debounce
        if (onTypingStart && onTypingStop) {
            // Начало печатания
            if (!isTypingRef.current) {
                isTypingRef.current = true;
                onTypingStart();
            }
            
            // Сбрасываем таймер
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            
            // Через 2 сек считаем что перестал печатать
            typingTimeoutRef.current = setTimeout(() => {
                isTypingRef.current = false;
                onTypingStop();
            }, 2000);
        }
    };

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed || disabled) return;
        
        // Останавливаем typing indicator
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        if (isTypingRef.current && onTypingStop) {
            isTypingRef.current = false;
            onTypingStop();
        }
        
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
                onChange={handleChange}
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
