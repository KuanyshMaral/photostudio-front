export async function mockLogin(email: string, password: string) {
  return new Promise<{ token: string }>((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        resolve({ token: "mock-jwt-token-123" });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 500);
  });
}
