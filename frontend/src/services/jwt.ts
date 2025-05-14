// Utility to decode JWT and check expiration
export function isTokenExpired(token: string): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return true;
    // exp is in seconds
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}
