import './TypingIndicator.css';

interface TypingIndicatorProps {
    name: string;
}

export default function TypingIndicator({ name }: TypingIndicatorProps) {
    return (
        <div className="typing-indicator">
            <span className="typing-text">{name} печатает</span>
            <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
}
