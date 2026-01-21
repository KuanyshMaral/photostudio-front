import React from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import './ClickableLinks.css';

interface ClickableLinksProps {
  address?: string;
  phone?: string;
  email?: string;
  city?: string;
}

/**
 * ClickableLinks — контактная информация с активными ссылками.
 */
export const ClickableLinks: React.FC<ClickableLinksProps> = ({
  address,
  phone,
  email,
  city = 'almaty',
}) => {
  // Формируем ссылку на 2GIS
  const getMapUrl = (addr: string): string => {
    const encoded = encodeURIComponent(addr);
    return `https://2gis.kz/${city}/search/${encoded}`;
  };

  // Формируем WhatsApp ссылку
  const getWhatsAppUrl = (phoneNumber: string): string => {
    // Убираем всё кроме цифр
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}`;
  };

  return (
    <div className="clickable-links">
      {/* Address → 2GIS */}
      {address && (
        <a 
          href={getMapUrl(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="clickable-links__item"
        >
          <MapPin size={18} className="clickable-links__icon" />
          <span className="clickable-links__text">{address}</span>
          <ExternalLink size={14} className="clickable-links__external" />
        </a>
      )}

      {/* Phone → WhatsApp */}
      {phone && (
        <a 
          href={getWhatsAppUrl(phone)}
          target="_blank"
          rel="noopener noreferrer"
          className="clickable-links__item clickable-links__item--whatsapp"
        >
          <Phone size={18} className="clickable-links__icon" />
          <span className="clickable-links__text">{phone}</span>
          <span className="clickable-links__badge">WhatsApp</span>
        </a>
      )}

      {/* Email → mailto */}
      {email && (
        <a 
          href={`mailto:${email}`}
          className="clickable-links__item"
        >
          <Mail size={18} className="clickable-links__icon" />
          <span className="clickable-links__text">{email}</span>
        </a>
      )}
    </div>
  );
};

export default ClickableLinks;
