interface AuthUser {
  id: number;
  email: string;
  displayName: string;
  role: string;
}

let _user: AuthUser | null = null;

export function getUser() {
  return _user;
}

export function setUser(u: AuthUser | null) {
  _user = u;
}

export function getToken() {
  return localStorage.getItem('shaswat_admin_token');
}

export function saveToken(token: string) {
  localStorage.setItem('shaswat_admin_token', token);
}

export function clearAuth() {
  _user = null;
  localStorage.removeItem('shaswat_admin_token');
}
