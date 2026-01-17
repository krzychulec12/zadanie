const Header = () => {
    return (
        <header className="header">
            <h1>🌥️ Pogoda z Kirstofem</h1>
        </header>
    );
};

const SearchBar = ({ city, setCity, onSearch }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Wpisz nazwę miasta..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            />
            <button onClick={onSearch}>Szukaj</button>
        </div>
    );
};

const WeatherCard = ({ data, onAddFavorite, isFavorite }) => {
    return (
        <div className="weather-card">
            <h2>{data.city}</h2>
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
                <span>🔽 Ciśnienie</span>
                <strong>{data.pressure} hPa</strong>
            </div>
            <div className="detail-item">
                <span>☔ Szansa na deszcz</span>
                <strong>{data.precipProb}%</strong>
            </div>
        </div>
    );
};

const ForecastList = ({ forecast }) => {
    if (!forecast) return null;

    return (
        <div className="forecast-section">
            <h3>Prognoza na 3 dni</h3>
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
        61: 'Lekki deszcz ☔',
        63: 'Umiarkowany deszcz ☔',
        65: 'Intensywny deszcz ☔',
        71: 'Śnieg ❄️',
        73: 'Umiarkowany śnieg ❄️',
        75: 'Intensywny śnieg ❄️',
        95: 'Burza ⚡',
        96: 'Burza z gradem ⛈️',
        99: 'Burza z gradem ⛈️'
    };
    return codes[code] || 'Nieznana pogoda';
};

// Tłumaczenie kierunku wiatru
const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
};

const App = () => {
    const [city, setCity] = React.useState('');
    const [weatherData, setWeatherData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [favorites, setFavorites] = React.useState([]);

    React.useEffect(() => {
        const saved = localStorage.getItem('skycast_favorites');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    }, []);

    const saveFavorites = (newFavorites) => {
        setFavorites(newFavorites);
        localStorage.setItem('skycast_favorites', JSON.stringify(newFavorites));
    };

    const fetchWeather = async (searchCity) => {
        if (!searchCity) return;

        setLoading(true);
        setError(null);
        setWeatherData(null);
        setCity(searchCity);

        try {
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchCity}&count=1&language=pl&format=json`);
            const geoData = await geoRes.json();

            if (!geoData.results) {
                throw new Error("Nie znaleziono miasta.");
            }

            const { latitude, longitude, name } = geoData.results[0];

            // Pobieramy też daily forecast, pressure, wind direction i precipitation
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`);
            const data = await weatherRes.json();

            // Formatowanie prognozy (następne 3 dni)
            const forecast = data.daily.time.slice(1, 4).map((time, index) => {
                // index + 1 ponieważ slice zaczyna on 1 (jutro)
                const i = index + 1;
                return {
                    date: new Date(time).toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'numeric' }),
                    maxTemp: Math.round(data.daily.temperature_2m_max[i]),
                    minTemp: Math.round(data.daily.temperature_2m_min[i]),
                    precipProb: data.daily.precipitation_probability_max[i],
                    icon: getWeatherDescription(data.daily.weather_code[i]).split(' ').pop() // Sama ikona
                };
            });

            setWeatherData({
                city: name,
                temp: Math.round(data.current.temperature_2m),
                condition: getWeatherDescription(data.current.weather_code),
                humidity: data.current.relative_humidity_2m,
                wind: Math.round(data.current.wind_speed_10m),
                windDir: getWindDirection(data.current.wind_direction_10m),
                pressure: Math.round(data.current.surface_pressure),
                precipProb: data.current.precipitation_probability || 0, // Czasem API zwraca null jeśli brak danych
                forecast: forecast
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = () => {
        if (!weatherData) return;
        const currentCity = weatherData.city;
        if (favorites.includes(currentCity)) {
            saveFavorites(favorites.filter(c => c !== currentCity));
        } else {
            saveFavorites([...favorites, currentCity]);
        }
    };

    const removeFavorite = (cityToRemove) => {
        saveFavorites(favorites.filter(c => c !== cityToRemove));
    };

    const isFavorite = weatherData && favorites.includes(weatherData.city);

    return (
        <div className="container">
            <Header />
            <SearchBar city={city} setCity={setCity} onSearch={() => fetchWeather(city)} />

            {loading && <p>Ładowanie...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {weatherData && (
                <>
                    <WeatherCard
                        data={weatherData}
                        onAddFavorite={toggleFavorite}
                        isFavorite={isFavorite}
                    />
                    <WeatherDetails data={weatherData} />
                    <ForecastList forecast={weatherData.forecast} />
                </>
            )}

            <FavoritesList
                favorites={favorites}
                onSelect={fetchWeather}
                onRemove={removeFavorite}
            />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
