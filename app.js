const Header = () => {
    return (
        <header className="header">
            <h1>🌥️ Pogoda z Kirstofem</h1>
        </header>
    );
};

const SearchBar = ({ city, setCity, onSearch, onLocation }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Wpisz nazwę miasta..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            />
            <button onClick={onLocation} className="location-btn" title="Twoja lokalizacja">📍</button>
            <button onClick={onSearch}>Szukaj</button>
        </div>
    );
};

const WeatherCard = ({ data, onAddFavorite, isFavorite }) => {
    return (
        <div className="weather-card">
            <h2>
                {data.city}
                {data.countryCode && (
                    <img
                        src={`https://flagcdn.com/h40/${data.countryCode}.png`}
                        alt="flag"
                        title={`Kraj: ${data.countryCode.toUpperCase()}`}
                        style={{ marginLeft: '10px', height: '24px', borderRadius: '4px', verticalAlign: 'middle', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                    />
                )}
            </h2>
            <div className="temperature">{data.temp}°C</div>
            <p className="condition">{data.condition}</p>
            <button
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={onAddFavorite}
            >
                {isFavorite ? '❤️ Usuń z ulubionych' : '🤍 Dodaj do ulubionych'}
            </button>
        </div>
    );
};

const WeatherDetails = ({ data }) => {
    return (
        <div className="weather-details">
            <div className="detail-item">
                <span>💧 Wilgotność</span>
                <strong>{data.humidity}%</strong>
            </div>
            <div className="detail-item">
                <span>💨 Wiatr</span>
                <strong>{data.wind} km/h {data.windDir}</strong>
            </div>
            <div className="detail-item">
                <span>🌡️ Odczuwalna</span>
                <strong>{data.apparentTemp}°C</strong>
            </div>
            <div className="detail-item">
                <span>🔽 Ciśnienie</span>
                <strong>{data.pressure} hPa</strong>
            </div>
            <div className="detail-item">
                <span>☔ Szansa na deszcz</span>
                <strong>{data.precipProb}%</strong>
            </div>
            {data.aqi !== undefined && (
                <div className="detail-item">
                    <span>🍃 Jakość powietrza</span>
                    <strong style={{ color: getAQIDescription(data.aqi).color }}>
                        {getAQIDescription(data.aqi).text} (AQI: {data.aqi})
                    </strong>
                </div>
            )}
            <div className="detail-item">
                <span>🌅 Wschód / Zachód</span>
                <strong>{data.sunrise} / {data.sunset}</strong>
            </div>
            <div className="detail-item">
                <span>🌑 Faza Księżyca</span>
                <strong>{data.moonPhase}</strong>
            </div>
        </div>
    );
};

const ForecastList = ({ forecast }) => {
    if (!forecast) return null;

    return (
        <div className="forecast-section">
            <h3>Prognoza na kolejne dni</h3>
            <div className="forecast-grid">
                {forecast.map((day, index) => (
                    <div key={index} className="forecast-item">
                        <span className="date">{day.date}</span>
                        <span className="icon">{day.icon}</span>
                        <div className="temps">
                            <span className="max">{day.maxTemp}°</span> / <span className="min">{day.minTemp}°</span>
                        </div>
                        <span className="rain">☔ {day.precipProb}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FavoritesList = ({ favorites, onSelect, onRemove }) => {
    if (favorites.length === 0) return null;

    return (
        <div className="favorites-section">
            <h3>Twoje Ulubione</h3>
            <div className="favorites-list">
                {favorites.map(city => (
                    <div key={city} className="favorite-item">
                        <span onClick={() => onSelect(city)}>{city}</span>
                        <button onClick={() => onRemove(city)}>❌</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// OWM API Key
const API_KEY = 'eee8e52ec3a0285eaf211cbd1d544bff';

// Funkcja pomocnicza do tłumaczenia kodów pogody (OpenWeatherMap)
const getWeatherDescription = (code) => {
    // OWM returns codes like '01d', '02n', etc. or condition IDs. 
    // We will use the 'icon' code or the main condition ID.
    // For simplicity, let's map icon codes to descriptions/emojis.
    // Note: 'code' here will be the icon string from OWM (e.g. '01d').
    const icons = {
        '01d': 'Czyste niebo ☀️', '01n': 'Czyste niebo 🌙',
        '02d': 'Niewielkie zachmurzenie 🌤️', '02n': 'Niewielkie zachmurzenie ☁️',
        '03d': 'Pochmurno ☁️', '03n': 'Pochmurno ☁️',
        '04d': 'Zachmurzenie całkowite ☁️', '04n': 'Zachmurzenie całkowite ☁️',
        '09d': 'Ulewa 🌧️', '09n': 'Ulewa 🌧️',
        '10d': 'Deszcz 🌦️', '10n': 'Deszcz 🌧️',
        '11d': 'Burza ⛈️', '11n': 'Burza ⛈️',
        '13d': 'Śnieg ❄️', '13n': 'Śnieg ❄️',
        '50d': 'Mgła 🌫️', '50n': 'Mgła 🌫️'
    };
    return icons[code] || 'Nieznana pogoda ❓';
};

// Tłumaczenie kierunku wiatru
const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
};

const HourSelector = ({ selectedHour, onChange }) => {
    // With OWM Free, we only have 3-hour steps. We should probably adjust this UI or map roughly.
    // Ideally, for free tier, a "Next 24h" list might be better than a slider, but let's keep the slider for "App feel".
    // We will map 0-23 to the closest available 3-hour slot.
    return (
        <div className="hour-selector">
            <label>Sprawdź godzinę (prognoza 3h): <strong>{selectedHour === null ? 'Teraz' : `${selectedHour}:00`}</strong></label>
            <input
                type="range"
                min="0"
                max="21"
                step="3"
                value={selectedHour === null ? new Date().getHours() - (new Date().getHours() % 3) : selectedHour}
                onChange={(e) => onChange(parseInt(e.target.value))}
            />
            <div className="hour-labels">
                <span>00:00</span>
                <span>12:00</span>
                <span>21:00</span>
            </div>
            {selectedHour !== null && (
                <button className="reset-hour-btn" onClick={() => onChange(null)}>Wróc do "Teraz"</button>
            )}
        </div>
    );
};

// Helper to extract closest hourly data
const getHourlyData = (list, hour) => {
    // Find the forecast item closest to the selected hour today (or tomorrow if late).
    // OWM 'list' contains items with 'dt' (timestamp).
    // We need to find items for "today" or "matches expectation".
    // For this simplified app, we'll try to find an item in the list whose time matches closely.

    // Simplification: We just look for the first item that has a time >= hour for today.
    // Or simpler: The list is sorted.
    // Let's iterate and find a match.

    const now = new Date();
    // We want details for 'hour' of TODAY (or tomorrow if hour < now?). 
    // Let's assume user means "Today's view at hour X". If X < current hour, it's past, so maybe show tomorrow?
    // Let's stick to "upcoming closest match".

    const targetTime = new Date();
    targetTime.setHours(hour, 0, 0, 0);
    if (targetTime < now) {
        // If selected time is in past, maybe show user means "Today at X" conceptually?
        // Let's just find the item in the list that matches the hour (ignoring date)
        // This is tricky with 5-day lists. 
        // Approach: Find the first item in the list where (item.dt * 1000) hour is roughly equal to 'hour'.
    }

    const match = list.find(item => {
        const d = new Date(item.dt * 1000);
        return d.getHours() === hour || d.getHours() === hour + 1 || d.getHours() === hour - 1;
    });

    const item = match || list[0]; // Fallback to first

    const desc = item.weather[0];

    return {
        temp: Math.round(item.main.temp),
        code: desc.icon, // Store icon code
        precipProb: Math.round(item.pop * 100), // pop is probability of precipitation 0-1
        wind: Math.round(item.wind.speed * 3.6), // m/s to km/h
        windDir: item.wind.deg,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        apparentTemp: Math.round(item.main.feels_like),
        sunrise: "-", // Hourly doesn't have it
        sunset: "-",
        // Helper to infer full description if needed, or use getWeatherDescription in render
    };
};

const getAQIDescription = (aqi) => {
    // OWM Air Pollution returns 1 (Good) to 5 (Very Poor).
    if (aqi === 1) return { text: 'Dobra 🟢', color: '#57cc99' };
    if (aqi === 2) return { text: 'Przyzwoita 🟢', color: '#80ed99' };
    if (aqi === 3) return { text: 'Umiarkowana 🟡', color: '#ffeb3b' };
    if (aqi === 4) return { text: 'Słaba 🟠', color: '#ff9800' };
    return { text: 'Bardzo zła 🔴', color: '#ff5252' };
};

const getMoonPhase = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 3) { year--; month += 12; }
    ++month;
    let c = 365.25 * year;
    let e = 30.6 * month;
    let jd = c + e + day - 694039.09;
    jd /= 29.5305882;
    let b = parseInt(jd);
    jd -= b;
    b = Math.round(jd * 8);
    if (b >= 8) b = 0;
    return b;
};

const getMoonPhaseDescription = (phaseIndex) => {
    const phases = ['🌑 Nów', '🌒 Wzrastający sierp', '🌓 Pierwsza kwadra', '🌔 Wzr. garbaty', '🌕 Pełnia', '🌖 Zan. garbaty', '🌗 Ostatnia kwadra', '🌘 Zanikający sierp'];
    return phases[phaseIndex] || '🌑';
};

// Map Component (Windy.com Embed) - Remains mostly same but code usage needs check
const WeatherMap = ({ lat, lon, code }) => {
    // Map OWM codes/icons to Windy overlays if possible
    // code is e.g. '01d'
    let overlay = 'wind';
    if (code.startsWith('09') || code.startsWith('10') || code.startsWith('11')) overlay = 'rain';
    else if (code.startsWith('01')) overlay = 'temp';
    else overlay = 'clouds';

    const embedUrl = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=650&height=450&zoom=10&level=surface&overlay=${overlay}&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`;

    return (
        <div className="weather-map-container">
            <iframe title="Mapa Pogodowa" src={embedUrl}></iframe>
        </div>
    );
};

const NotificationWidget = ({ message, type, onClose }) => {
    if (!message) return null;
    let icon = 'ℹ️';
    if (type === 'error') icon = '⚠️';
    if (type === 'success') icon = '✅';
    return (
        <div className={`notification-widget ${type}`}>
            <span>{icon}</span>
            <span>{message}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', marginLeft: 'auto', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
        </div>
    );
};

const App = () => {
    const [city, setCity] = React.useState('');
    const [weatherData, setWeatherData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [notification, setNotification] = React.useState(null);
    const [favorites, setFavorites] = React.useState([]);
    const [selectedHour, setSelectedHour] = React.useState(null);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    React.useEffect(() => {
        const saved = localStorage.getItem('skycast_favorites');
        if (saved) setFavorites(JSON.parse(saved));
    }, []);

    const saveFavorites = (newFavorites) => {
        setFavorites(newFavorites);
        localStorage.setItem('skycast_favorites', JSON.stringify(newFavorites));
    };

    const fetchDataByCoords = async (latitude, longitude, name, countryCode) => {
        try {
            // 1. Current Weather
            const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pl&appid=${API_KEY}`);
            const currentData = await currentRes.json();
            if (!currentRes.ok) throw new Error(currentData.message);

            // 2. Forecast (5 day / 3 hour)
            const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=pl&appid=${API_KEY}`);
            const forecastData = await forecastRes.json();

            // 3. Air Pollution
            let aqi = null;
            try {
                const airRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
                const airData = await airRes.json();
                if (airData.list && airData.list[0]) aqi = airData.list[0].main.aqi;
            } catch (e) {
                console.warn("AQI fetch failed", e);
            }

            // Process Forecast to get Daily
            // We group by date string
            const dailyMap = {};
            forecastData.list.forEach(item => {
                const date = new Date(item.dt * 1000).toLocaleDateString();
                if (!dailyMap[date]) {
                    dailyMap[date] = {
                        dt: item.dt,
                        temps: [],
                        icons: [],
                        pop: [],
                        min: 100, max: -100
                    };
                }
                dailyMap[date].temps.push(item.main.temp);
                dailyMap[date].icons.push(item.weather[0].icon);
                dailyMap[date].pop.push(item.pop);
                dailyMap[date].min = Math.min(dailyMap[date].min, item.main.temp_min);
                dailyMap[date].max = Math.max(dailyMap[date].max, item.main.temp_max);
            });

            // Convert map to array (next 5 days)
            const forecastList = Object.values(dailyMap).slice(1, 6).map(day => {
                // Determine most frequent icon or just take noon
                const icon = day.icons[Math.floor(day.icons.length / 2)];
                return {
                    date: new Date(day.dt * 1000).toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'numeric' }),
                    maxTemp: Math.round(day.max),
                    minTemp: Math.round(day.min),
                    precipProb: Math.round(Math.max(...day.pop) * 100),
                    icon: getWeatherDescription(icon).split(' ').pop()
                };
            });

            setWeatherData({
                city: name || currentData.name,
                countryCode: countryCode || currentData.sys.country,
                coords: { lat: latitude, lon: longitude },
                current: {
                    temp: Math.round(currentData.main.temp),
                    code: currentData.weather[0].icon, // '01d' etc.
                    condition: getWeatherDescription(currentData.weather[0].icon),
                    humidity: currentData.main.humidity,
                    wind: Math.round(currentData.wind.speed * 3.6),
                    windDir: getWindDirection(currentData.wind.deg),
                    pressure: currentData.main.pressure,
                    precipProb: Math.round((forecastData.list[0].pop || 0) * 100),
                    apparentTemp: Math.round(currentData.main.feels_like),
                    sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
                    sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
                    moonPhase: getMoonPhaseDescription(getMoonPhase(new Date())),
                    aqi: aqi
                },
                hourly: forecastData.list, // Pass the whole list for helper to process
                forecast: forecastList
            });

        } catch (err) {
            console.error(err);
            throw new Error("Błąd pobierania danych pogodowych (OWM): " + err.message);
        }
    };

    const fetchWeather = async (searchCity) => {
        if (!searchCity) return;
        setLoading(true); setNotification(null); setWeatherData(null); setCity(searchCity); setSelectedHour(null);
        try {
            const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&limit=1&appid=${API_KEY}`);
            const geoData = await geoRes.json();
            if (!geoData || geoData.length === 0) throw new Error("Nie znaleziono miasta.");
            const { lat, lon, name, country } = geoData[0];
            await fetchDataByCoords(lat, lon, name, country);
        } catch (err) {
            showNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserLocation = () => {
        if (!navigator.geolocation) { showNotification("Brak geolokalizacji.", 'error'); return; }
        setLoading(true); setNotification(null); setWeatherData(null); setSelectedHour(null);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                let name = "Twoja lokalizacja"; let country = null;
                try {
                    const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`);
                    const geoData = await geoRes.json();
                    if (geoData && geoData[0]) { name = geoData[0].name; country = geoData[0].country; }
                } catch (e) { console.warn("Reverse geo failed"); }

                try {
                    setCity('');
                    await fetchDataByCoords(latitude, longitude, name, country);
                    showNotification("Lokalizacja znaleziona!", 'success');
                } catch (err) {
                    showNotification("Błąd: " + err.message, 'error');
                } finally { setLoading(false); }
            },
            (err) => { showNotification("Błąd lokalizacji: " + err.message, 'error'); setLoading(false); }
        );
    };

    const toggleFavorite = () => {
        if (!weatherData) return;
        const currentCity = weatherData.city;
        if (favorites.includes(currentCity)) {
            saveFavorites(favorites.filter(c => c !== currentCity));
            showNotification(`Usunięto ${currentCity} z ulubionych`, 'info');
        } else {
            saveFavorites([...favorites, currentCity]);
            showNotification(`Dodano ${currentCity} do ulubionych`, 'success');
        }
    };

    const removeFavorite = (city) => saveFavorites(favorites.filter(c => c !== city));
    const isFavorite = weatherData && favorites.includes(weatherData.city);

    // Render Logic Adaptation
    // IMPORTANT: 'displayData' logic needs to know if we are showing Current or Hourly.
    let displayData = null;
    let mapTimestamp = null;

    if (weatherData) {
        if (selectedHour !== null) {
            // Hourly logic
            const hourlyItem = getHourlyData(weatherData.hourly, selectedHour);
            displayData = {
                city: weatherData.city,
                countryCode: weatherData.countryCode,
                ...hourlyItem, // spreads temp, code, etc.
                condition: getWeatherDescription(hourlyItem.code),
                aqi: weatherData.current.aqi, // assume constant aqi
                sunrise: weatherData.current.sunrise, // fallback
                sunset: weatherData.current.sunset,
                moonPhase: weatherData.current.moonPhase
            };
            const now = new Date();
            mapTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), selectedHour, 0, 0);
        } else {
            // Current logic
            displayData = {
                city: weatherData.city,
                countryCode: weatherData.countryCode,
                ...weatherData.current
            };
        }
    }

    return (
        <>

            <div className="container">
                <Header />
                <SearchBar
                    city={city}
                    setCity={setCity}
                    onSearch={() => fetchWeather(city)}
                    onLocation={fetchUserLocation}
                />

                {loading && <p>Ładowanie...</p>}

                {/* Notification Widget Render */}
                {notification && (
                    <NotificationWidget
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}

                {weatherData && displayData && (
                    <>
                        <HourSelector selectedHour={selectedHour} onChange={setSelectedHour} />

                        <WeatherCard
                            data={displayData}
                            onAddFavorite={toggleFavorite}
                            isFavorite={isFavorite}
                        />
                        <WeatherDetails data={displayData} />

                        {/* Weather Map Integration */}
                        {weatherData.coords && (
                            <WeatherMap
                                lat={weatherData.coords.lat}
                                lon={weatherData.coords.lon}
                                code={displayData.code}
                                timestamp={mapTimestamp}
                            />
                        )}

                        <ForecastList forecast={weatherData.forecast} />
                    </>
                )}

                <FavoritesList
                    favorites={favorites}
                    onSelect={fetchWeather}
                    onRemove={removeFavorite}
                />
            </div>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
