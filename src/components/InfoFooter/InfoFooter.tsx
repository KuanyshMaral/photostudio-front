import React from 'react';
import { Shield, CheckCircle, Clock, Award } from 'lucide-react';
import './InfoFooter.css';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: <Shield size={32} />,
    title: 'Безопасные платежи',
    description: 'Все транзакции защищены',
  },
  {
    icon: <CheckCircle size={32} />,
    title: 'Проверенные студии',
    description: 'Каждая студия проходит верификацию',
  },
  {
    icon: <Clock size={32} />,
    title: 'Быстрое бронирование',
    description: 'Забронируйте за 2 минуты',
  },
  {
    icon: <Award size={32} />,
    title: 'Лучшие цены',
    description: 'Гарантия лучшей цены на рынке',
  },
];

const partners = [
  { name: 'Partner 1', logo: '/images/partners/partner1.png' },
  { name: 'Partner 2', logo: '/images/partners/partner2.png' },
  { name: 'Partner 3', logo: '/images/partners/partner3.png' },
  { name: 'Partner 4', logo: '/images/partners/partner4.png' },
];

export const InfoFooter: React.FC = () => {
  return (
    <footer className="info-footer">
      {/* Benefits Section */}
      <section className="info-footer__benefits">
        <div className="info-footer__container">
          <h2 className="info-footer__title">Почему выбирают нас?</h2>
          <div className="info-footer__grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-card__icon">{benefit.icon}</div>
                <h3 className="benefit-card__title">{benefit.title}</h3>
                <p className="benefit-card__description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="info-footer__partners">
        <div className="info-footer__container">
          <h3 className="info-footer__partners-title">Наши партнёры</h3>
          <div className="info-footer__partners-grid">
            {partners.map((partner, index) => (
              <div key={index} className="partner-logo">
                <img src={partner.logo} alt={partner.name} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Copyright */}
      <div className="info-footer__copyright">
        <div className="info-footer__container">
          <p>© 2026 StudioBooking. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default InfoFooter;
