const API_BASE = '/api';

async function api(path, options = {}) {
  const token = localStorage.getItem('adminToken');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const campusAPI = {
  health:          ()           => api('/health'),
  // Locations
  getLocations:    ()           => api('/locations'),
  getLocation:     (id)         => api(`/locations/${id}`),
  searchLocations: (q)          => api(`/locations/search?q=${encodeURIComponent(q)}`),
  // Buildings
  getBuildings:    ()           => api('/buildings'),
  // Departments
  getDepartments:  ()           => api('/departments'),
  // Faculty
  getFaculty:      ()           => api('/faculty'),
  // Navigation
  getNavNodes:     ()           => api('/navigation/nodes'),
  getNavEdges:     ()           => api('/navigation/edges'),
  getRoute:        (body)       => api('/navigation/route', { method: 'POST', body: JSON.stringify(body) }),
  // Panoramas
  getPanoramas:    ()           => api('/navigation/panoramas'),
  getPanorama:     (id)         => api(`/navigation/panoramas/${id}`),
  // Chat
  chat:            (message, startNodeId) =>
    api('/chat', { method: 'POST', body: JSON.stringify({ message, startNodeId }) }),
  // Auth
  login:           (username, password) =>
    api('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  verifyToken:     (token) =>
    api('/auth/verify', { method: 'POST', body: JSON.stringify({ token }) }),
  // Admin
  adminStats:      ()           => api('/admin/stats'),
  adminLocations:  ()           => api('/admin/locations'),
  adminAddLocation:(data)       => api('/admin/locations', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateLocation: (id, d)  => api(`/admin/locations/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  adminDeleteLocation: (id)     => api(`/admin/locations/${id}`, { method: 'DELETE' }),
  adminFaculty:    ()           => api('/admin/faculty'),
  adminAddFaculty: (data)       => api('/admin/faculty', { method: 'POST', body: JSON.stringify(data) }),
  adminDeleteFaculty: (id)      => api(`/admin/faculty/${id}`, { method: 'DELETE' }),
};
