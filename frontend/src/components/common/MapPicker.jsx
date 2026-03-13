/**
 * MapPicker.jsx — Leaflet map (OpenStreetMap, no API key needed)
 * Supports custom accent color per feature page
 */
import { useEffect, useRef, useState } from 'react';

export function MapView({ markers = [], height = 400, center = [40.7128, -74.006], zoom = 12, accentColor = '#0ea5e9' }) {
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css'; link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    if (window.L) { setReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current) return;

    // Destroy old instance
    if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }

    const L = window.L;
    mapInstance.current = L.map(mapRef.current, { zoomControl: true }).setView(center, zoom);

    // Dark-themed tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    // Custom color markers
    const icon = L.divIcon({
      html: `<div style="background:${accentColor};width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 10px rgba(0,0,0,0.5)"></div>`,
      className: '', iconSize: [16, 16], iconAnchor: [8, 8],
    });

    markers.forEach(m => {
      if (!m.lat || !m.lng) return;
      const popup = `
        <div style="font-family:sans-serif;min-width:170px;padding:2px">
          <strong style="color:${accentColor};font-size:13px">${m.title || 'Location'}</strong><br/>
          <span style="color:#aaa;font-size:12px">${m.subtitle || ''}</span>
          ${m.price ? `<br/><strong style="color:#22c55e;font-size:13px">${m.price}</strong>` : ''}
          ${m.id ? `<br/><a href="/posts/${m.id}" style="color:${accentColor};font-size:12px;margin-top:4px;display:inline-block">View post →</a>` : ''}
        </div>`;
      L.marker([m.lat, m.lng], { icon }).addTo(mapInstance.current).bindPopup(popup);
    });

    if (markers.length > 1) {
      const valid = markers.filter(m => m.lat && m.lng);
      if (valid.length > 1) mapInstance.current.fitBounds(valid.map(m => [m.lat, m.lng]), { padding: [40,40] });
    }

    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, [ready, markers, center, zoom, accentColor]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-xl" style={{ height }}>
      {!ready && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"/>
            Loading map...
          </div>
        </div>
      )}
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}

export async function geocodeAddress(address) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      { headers: { 'Accept-Language': 'en', 'User-Agent': 'StudentHub/1.0' } }
    );
    const d = await r.json();
    if (d[0]) return { lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon), display: d[0].display_name };
    return null;
  } catch { return null; }
}

export function LocationSearch({ onSelect, placeholder = 'Search location...', className = '' }) {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);

  const search = async (q) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`,
        { headers: { 'Accept-Language': 'en', 'User-Agent': 'StudentHub/1.0' } }
      );
      const d = await r.json();
      setResults(d); setOpen(true);
    } catch { setResults([]); }
    finally { setLoading(false); }
  };

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => { if (query.length > 2) search(query); else setResults([]); }, 500);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); }}
          onFocus={() => results.length && setOpen(true)}
          placeholder={placeholder}
          className="form-input w-full text-sm pr-8"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700
          rounded-xl shadow-2xl z-50 overflow-hidden max-h-52 overflow-y-auto">
          {results.map((r, i) => (
            <button key={i}
              onClick={() => {
                onSelect({ lat: parseFloat(r.lat), lng: parseFloat(r.lon), display: r.display_name });
                setQuery(r.display_name.split(',').slice(0,2).join(', '));
                setOpen(false); setResults([]);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800
                border-b border-gray-800 last:border-0 transition-colors flex items-start gap-2">
              <span className="mt-0.5 shrink-0">📍</span>
              <span className="truncate">{r.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default MapView;
