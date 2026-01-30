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
                        src={`https://flagcdn.com/h40/${data.countryCode.toLowerCase()}.png`}
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
                <span>☔ Szansa na opady</span>
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

// Funkcja pomocnicza do tłumaczenia kodów pogody
const getWeatherDescription = (code) => {
    const codes = {
        0: 'Czyste niebo ☀️',
        1: 'Przeważnie słonecznie 🌤️',
        2: 'Częściowe zachmurzenie ⛅',
        3: 'Pochmurno ☁️',
        45: 'Mgła 🌫️',
        48: 'Mgła osadzająca szadź 🌫️',
        51: 'Mżawka 🌧️',
        53: 'Umiarkowana mżawka 🌧️',
        55: 'Intensywna mżawka 🌧️',
        56: 'Marznąca mżawka ❄️',
        57: 'Intensywna marznąca mżawka ❄️',
        61: 'Lekki deszcz ☔',
        63: 'Umiarkowany deszcz ☔',
        65: 'Intensywny deszcz ☔',
        66: 'Marznący deszcz 🌨️',
        67: 'Intensywny marznący deszcz 🌨️',
        71: 'Śnieg ❄️',
        73: 'Umiarkowany śnieg ❄️',
        75: 'Intensywny śnieg ❄️',
        77: 'Ziarnisty śnieg ❄️',
        80: 'Przelotne opady deszczu ☔',
        81: 'Umiarkowane opady deszczu ☔',
        82: 'Gwałtowne opady deszczu ☔',
        85: 'Przelotne opady śniegu ❄️',
        86: 'Intensywne opady śniegu ❄️',
        95: 'Burza ⚡',
        96: 'Burza z gradem ⛈️',
        99: 'Burza z gradem ⛈️'
    };
    return codes[code] || 'Nieznana pogoda ❓';
};

// Tłumaczenie kierunku wiatru
const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
};

const HourSelector = ({ selectedHour, onChange }) => {
    return (
        <div className="hour-selector">
            <label>Sprawdź godzinę: <strong>{selectedHour === null ? 'Teraz' : `${selectedHour}:00`}</strong></label>
            <input
                type="range"
                min="0"
                max="23"
                value={selectedHour === null ? new Date().getHours() : selectedHour}
                onChange={(e) => onChange(parseInt(e.target.value))}
            />
            <div className="hour-labels">
                <span>00:00</span>
                <span>12:00</span>
                <span>23:00</span>
            </div>
            {selectedHour !== null && (
                <button className="reset-hour-btn" onClick={() => onChange(null)}>Wróc do "Teraz"</button>
            )}
        </div>
    );
};

// Helper function to extract hourly data for a specific hour
const getHourlyData = (hourly, hour) => {
    return {
        temp: Math.round(hourly.temperature_2m[hour]),
        code: hourly.weather_code[hour],
        precipProb: hourly.precipitation_probability[hour],
        wind: Math.round(hourly.wind_speed_10m[hour]),
        windDir: hourly.wind_direction_10m[hour],
        pressure: Math.round(hourly.surface_pressure[hour]),
        humidity: hourly.relative_humidity_2m[hour],
        apparentTemp: Math.round(hourly.apparent_temperature[hour]),
        sunrise: "-",
        sunset: "-"
    };
};

// Helper to interpret AQI (European CAQI)
const getAQIDescription = (aqi) => {
    if (aqi <= 25) return { text: 'Bardzo dobra 🟢', color: '#57cc99' };
    if (aqi <= 50) return { text: 'Dobra 🟢', color: '#80ed99' };
    if (aqi <= 75) return { text: 'Umiarkowana 🟡', color: '#ffeb3b' };
    if (aqi <= 100) return { text: 'Zła 🟠', color: '#ff9800' };
    return { text: 'Bardzo zła 🔴', color: '#ff5252' };
};

// Local Moon Phase Calculation
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

// Map Component (Windy.com Embed)
const WeatherMap = ({ lat, lon, code }) => {
    let overlay = 'wind';
    if (code >= 51 && code <= 99) overlay = 'rain';
    else if ((code >= 1 && code <= 3) || code === 45 || code === 48) overlay = 'clouds';
    else if (code === 0) overlay = 'temp';

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
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,precipitation_probability,weather_code&hourly=temperature_2m,apparent_temperature,weather_code,precipitation_probability,wind_speed_10m,wind_direction_10m,surface_pressure,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto`);
            const data = await weatherRes.json();

            const airRes = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi`);
            const airData = await airRes.json();
            const aqi = airData.current ? airData.current.european_aqi : null;

            const forecast = data.daily.time.slice(1, 6).map((time, index) => {
                const i = index + 1;
                return {
                    date: new Date(time).toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'numeric' }),
                    maxTemp: Math.round(data.daily.temperature_2m_max[i]),
                    minTemp: Math.round(data.daily.temperature_2m_min[i]),
                    precipProb: data.daily.precipitation_probability_max[i],
                    icon: getWeatherDescription(data.daily.weather_code[i]).split(' ').pop()
                };
            });

            setWeatherData({
                city: name,
                countryCode: countryCode ? countryCode.toLowerCase() : null,
                coords: { lat: latitude, lon: longitude },
                current: {
                    temp: Math.round(data.current.temperature_2m),
                    code: data.current.weather_code,
                    condition: getWeatherDescription(data.current.weather_code),
                    humidity: data.current.relative_humidity_2m,
                    wind: Math.round(data.current.wind_speed_10m),
                    windDir: getWindDirection(data.current.wind_direction_10m),
                    pressure: Math.round(data.current.surface_pressure),
                    precipProb: data.daily.precipitation_probability_max[0] || 0,
                    apparentTemp: Math.round(data.current.apparent_temperature),
                    sunrise: new Date(data.daily.sunrise[0]).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
                    sunset: new Date(data.daily.sunset[0]).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
                    moonPhase: getMoonPhaseDescription(getMoonPhase(new Date())),
                    aqi: aqi
                },
                hourly: data.hourly,
                forecast: forecast
            });
        } catch (err) {
            throw new Error("Błąd pobierania danych pogodowych.");
        }
    };

    const fetchWeather = async (searchCity) => {
        if (!searchCity) return;
        setLoading(true);
        setNotification(null);
        setWeatherData(null);
        setCity(searchCity);
        setSelectedHour(null);
        try {
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchCity}&count=1&language=pl&format=json`);
            const geoData = await geoRes.json();
            if (!geoData.results) throw new Error("Nie znaleziono miasta.");
            const { latitude, longitude, name, country_code } = geoData.results[0];
            await fetchDataByCoords(latitude, longitude, name, country_code);
        } catch (err) {
            showNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserLocation = () => {
        if (!navigator.geolocation) {
            showNotification("Brak wsparcia geolokalizacji.", 'error');
            return;
        }
        setLoading(true);
        setNotification(null);
        setWeatherData(null);
        setSelectedHour(null);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                let name = "Twoja lokalizacja";
                let country_code = null;
                try {
                    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=pl&format=json`);
                    if (geoRes.ok) {
                        const geoData = await geoRes.json();
                        if (geoData.results && geoData.results[0]) {
                            name = geoData.results[0].name;
                            country_code = geoData.results[0].country_code;
                        }
                    }
                } catch (err) { }
                try {
                    setCity('');
                    await fetchDataByCoords(latitude, longitude, name, country_code);
                    showNotification("Lokalizacja znaleziona!", 'success');
                } catch (err) {
                    showNotification("Błąd: " + err.message, 'error');
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                showNotification("Błąd lokalizacji: " + err.message, 'error');
                setLoading(false);
            }
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

    let displayData = null;
    let mapTimestamp = null;
    if (weatherData) {
        if (selectedHour !== null) {
            const hourly = getHourlyData(weatherData.hourly, selectedHour);
            displayData = {
                city: weatherData.city,
                countryCode: weatherData.countryCode,
                ...hourly,
                condition: getWeatherDescription(hourly.code),
                aqi: weatherData.current.aqi,
                sunrise: weatherData.current.sunrise,
                sunset: weatherData.current.sunset,
                moonPhase: weatherData.current.moonPhase
            };
            const now = new Date();
            mapTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), selectedHour, 0, 0);
        } else {
            displayData = {
                city: weatherData.city,
                countryCode: weatherData.countryCode,
                ...weatherData.current
            };
        }
    }

    return (
        <div className="container">
            <Header />
            <SearchBar city={city} setCity={setCity} onSearch={() => fetchWeather(city)} onLocation={fetchUserLocation} />
            {loading && <p>Ładowanie...</p>}
            {notification && <NotificationWidget message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            {weatherData && displayData && (
                <>
                    <HourSelector selectedHour={selectedHour} onChange={setSelectedHour} />
                    <WeatherCard data={displayData} onAddFavorite={toggleFavorite} isFavorite={isFavorite} />
                    <WeatherDetails data={displayData} />
                    {weatherData.coords && <WeatherMap lat={weatherData.coords.lat} lon={weatherData.coords.lon} code={displayData.code} />}
                    <ForecastList forecast={weatherData.forecast} />
                </>
            )}
            <FavoritesList favorites={favorites} onSelect={fetchWeather} onRemove={removeFavorite} />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
