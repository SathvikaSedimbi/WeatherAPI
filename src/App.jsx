import { useState } from "react";
import { getCurrentWeather, searchLocations } from "./api/openMeteo";
import WeatherCard from "./components/WeatherCard";

export default function App() {


  const [query, setQuery] = useState("Chennai"); 
  const [status, setStatus] = useState("");      
  const [error, setError] = useState("");        
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [weather, setWeather] = useState(null);  
  const [loading, setLoading] = useState(false); 

  async function onSearch() {
    
    setError("");
    setStatus("");
    setWeather(null);
    setSelected(null);

    
    const q = query.trim();

    
    if (!q) {
      setError("Please enter a city name.");
      return;
    }

    try {
      setLoading(true);                 
      setStatus("Searching locations...");

      
      const results = await searchLocations(q);

      setLocations(results);

      if (results.length === 0) {
        setStatus("");
        setError("No matching locations found.");
      } else {
        setStatus("Select a location below.");
      }
    } catch (e) {
      
      setError("Failed to search locations. Check internet and try again.");
    } finally {
      
      setLoading(false);
    }
  }

  
  async function onPickLocation(loc) {
    setError("");
    setStatus("");
    setSelected(loc);  
    setWeather(null);  

    try {
      setLoading(true);
      setStatus("Fetching current weather...");

      
      const data = await getCurrentWeather(loc.latitude, loc.longitude);

      
      setWeather(data);

      setStatus("Done");
    } catch (e) {
      setError("Failed to fetch weather for this location.");
    } finally {
      setLoading(false);
    }
  }

  
  const placeLabel = selected
    ? `${selected.name}${selected.admin1 ? ", " + selected.admin1 : ""}, ${selected.country}`
    : "";




  return (
    <div className="min-h-screen bg-slate-100">
      
      <div className="mx-auto max-w-2xl p-6">

        
        <header className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <h1 className="text-2xl font-extrabold text-orange-500">
            React + Tailwind Weather App
          </h1>

          <p className="mt-2 text-orange-700">
            Type a city , choose location , view current weather (Open-Meteo, no API key).
          </p>

          
          <div className="mt-5 flex gap-2">
            <input
              className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Example: Vijayawada"
              value={query}
              
              onChange={(e) => setQuery(e.target.value)}
              
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
            />

            <button
              onClick={onSearch}
              className="rounded-xl bg-orange-400 px-4 py-2 font-semibold text-white hover:bg-slate-800 active:scale-[0.99] transition"
              disabled={loading}
            >
              {loading ? "..." : "Search"}
            </button>
          </div>

          
          {(status || error) && (
            <div className="mt-3 text-sm">
              {status && <p className="text-slate-600">{status}</p>}
              {error && <p className="text-red-600 font-semibold">{error}</p>}
            </div>
          )}
        </header>

        
        {locations.length > 0 && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-semibold text-slate-900">Select a location</p>

            <div className="mt-3 grid gap-2">
              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => onPickLocation(loc)}
                  className="text-left rounded-xl border border-slate-200 p-3 hover:bg-slate-50 transition"
                  disabled={loading}
                >
                  <p className="font-semibold text-slate-900">
                    {loc.name}
                    {loc.admin1 ? `, ${loc.admin1}` : ""} — {loc.country}
                  </p>

                  <p className="text-xs text-slate-500">
                    Lat: {loc.latitude}, Lon: {loc.longitude}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        
        {weather && <WeatherCard placeLabel={placeLabel} weather={weather} />}

        
        <footer className="mt-8 text-center text-xs text-slate-500">
          Built with Vite + React, Tailwind, and Open-Meteo.
        </footer>
      </div>
    </div>
  );
}
