const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Auth endpoints
  register: (data: { name: string; email: string; password: string }) =>
    fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  // Authenticated requests
  getProfile: () =>
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('splitease_token')}` },
    }),

  getExpenses: () =>
    fetch(`${API_BASE}/expenses`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('splitease_token')}` },
    }),

  createExpense: (data: any) =>
    fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('splitease_token')}`,
      },
      body: JSON.stringify(data),
    }),

  updateExpense: (id: string, data: any) =>
    fetch(`${API_BASE}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('splitease_token')}`,
      },
      body: JSON.stringify(data),
    }),

  deleteExpense: (id: string) =>
    fetch(`${API_BASE}/expenses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('splitease_token')}` },
    }),

  getAnalytics: () =>
    fetch(`${API_BASE}/analytics/summary`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('splitease_token')}` },
    }),

  // Groups
  getGroups: () =>
    fetch(`${API_BASE}/groups`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('splitease_token')}` },
    }),

  createGroup: (data: any) =>
    fetch(`${API_BASE}/groups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('splitease_token')}`,
      },
      body: JSON.stringify(data),
    }),

  joinGroup: (inviteCode: string) =>
    fetch(`${API_BASE}/groups/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('splitease_token')}`,
      },
      body: JSON.stringify({ inviteCode }),
    }),

  addMember: (groupId: string, email: string) =>
    fetch(`${API_BASE}/groups/${groupId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('splitease_token')}`,
      },
      body: JSON.stringify({ email }),
    }),

  getGroupDetails: (groupId: string) =>
    fetch(`${API_BASE}/groups/${groupId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('splitease_token')}` },
    }),

  // Settlements
  markAsPaid: (expenseId: string, userId: string) =>
    fetch(`${API_BASE}/settlements/mark-paid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('splitease_token')}`,
      },
      body: JSON.stringify({ expenseId, userId }),
    }),

  getUserDebts: () =>
    fetch(`${API_BASE}/settlements/debts`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('splitease_token')}` },
    }),
};