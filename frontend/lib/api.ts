const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function normalize(p: any) {
  if (!p) return p
  return { ...p, id: p.id || (p._id ? String(p._id) : undefined) }
}

// ---- Public API ----

export async function getSiteData() {
  const res = await fetch(`${API}/api/site`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch site data');
  const json = await res.json();
  return json.data ?? json;
}

export async function getProducts(collection?: string) {
  const url = collection
    ? `${API}/api/products?collection=${encodeURIComponent(collection)}`
    : `${API}/api/products`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  const json = await res.json();
  const data = json.data ?? json;
  return Array.isArray(data) ? data.map(normalize) : data;
}

export async function getProduct(id: string) {
  const res = await fetch(`${API}/api/products/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch product');
  const json = await res.json();
  return normalize(json.data ?? json);
}

export async function getCollections() {
  const res = await fetch(`${API}/api/collections`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch collections');
  const json = await res.json();
  return json.data ?? json;
}

// ---- Auth ----

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function verifyToken(token: string) {
  const res = await fetch(`${API}/api/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ---- Site sections ----

export async function updateSiteSection(section: string, data: unknown, token: string) {
  const res = await fetch(`${API}/api/site/${section}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Update failed');
  return result;
}

// ---- Products ----

export async function createProduct(data: unknown, token: string) {
  const res = await fetch(`${API}/api/products`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Create failed');
  return result.data ?? result;
}

export async function updateProduct(id: string, data: unknown, token: string) {
  const res = await fetch(`${API}/api/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Update failed');
  return result.data ?? result;
}

export async function deleteProduct(id: string, token: string) {
  const res = await fetch(`${API}/api/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Delete failed');
  return result;
}

// ---- Collections ----

export async function createCollection(data: unknown, token: string) {
  const res = await fetch(`${API}/api/collections`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Create failed');
  return result.data ?? result;
}

export async function updateCollection(id: string, data: unknown, token: string) {
  const res = await fetch(`${API}/api/collections/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Update failed');
  return result.data ?? result;
}

export async function deleteCollection(id: string, token: string) {
  const res = await fetch(`${API}/api/collections/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Delete failed');
  return result;
}

// ---- Users ----

export async function registerUser(data: { name: string; email: string; password: string; phone?: string; address?: string; city?: string }) {
  const res = await fetch(`${API}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Registration failed');
  return result;
}

export async function loginUserApi(email: string, password: string) {
  const res = await fetch(`${API}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Login failed');
  return result;
}

export async function getUserProfile(token: string) {
  const res = await fetch(`${API}/api/users/profile`, {
    headers: authHeaders(token),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to fetch profile');
  return result.user;
}

export async function updateUserProfile(data: unknown, token: string) {
  const res = await fetch(`${API}/api/users/profile`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Update failed');
  return result.user;
}

// ---- Orders ----

export async function createOrder(data: unknown, token: string) {
  const res = await fetch(`${API}/api/orders`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Order failed');
  return result.data;
}

export async function getUserOrders(token: string) {
  const res = await fetch(`${API}/api/orders`, {
    headers: authHeaders(token),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to fetch orders');
  return result.data ?? [];
}

// ---- Upload ----

export async function uploadImage(file: File, token: string) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Upload failed');
  return result;
}
