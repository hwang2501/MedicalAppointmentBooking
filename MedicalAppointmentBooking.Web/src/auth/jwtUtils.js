function base64UrlDecode(value) {
  // JWT uses base64url (replace chars for standard base64)
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
  return decodeURIComponent(
    atob(base64 + pad)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export function decodeJwt(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const payload = base64UrlDecode(parts[1]);
  return JSON.parse(payload);
}

export function getRoleFromToken(token) {
  const payload = decodeJwt(token);
  if (!payload) return null;

  // ClaimTypes.Role in .NET => URI claim name.
  const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  return payload[roleClaimKey] || payload.role || null;
}

export function getUsernameFromToken(token) {
  const payload = decodeJwt(token);
  if (!payload) return null;
  return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.name || null;
}

