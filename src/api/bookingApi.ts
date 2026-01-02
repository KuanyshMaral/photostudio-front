// BookingData — тип для TypeScript, не попадет в runtime
export type BookingData = {
  room_id: string;
  start_time: string;
  end_time: string;
};

// Функция mock API
export const createBooking = async (data: BookingData) => {
  console.log("Mock API received:", data);
  // эмулируем задержку и возвращаем фиктивный ответ
  return new Promise<{ booking: { id: number; status: string } }>((resolve) => {
    setTimeout(() => {
      resolve({ booking: { id: Math.floor(Math.random() * 1000), status: "pending" } });
    }, 500);
  });
};
