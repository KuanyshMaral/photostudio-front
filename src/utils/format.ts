// src/utils/format.ts

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-KZ').format(price) + ' ₸';
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};