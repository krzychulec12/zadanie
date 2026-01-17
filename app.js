const Header = () => {
    return (
        <header className="header">
            <h1>🌥️ SkyCast</h1>
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
            />
            <button onClick={onSearch}>Szukaj</button>
        </div>
    );
};

const WeatherCard = ({ data }) => {
    return (
        <div className="weather-card">
            <h2>{data.city}</h2>
            <div className="temperature">{data.temp}°C</div>
            <p className="condition">{data.condition}</p>
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
                <strong>{data.wind} km/h</strong>
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

const App = () => {
    const [city, setCity] = React.useState('');
    const [weatherData, setWeatherData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleSearch = async () => {
        if (!city) return;

        setLoading(true);
        setError(null);
        setWeatherData(null);

        try {
            // 1. Znajdź współrzędne miasta (Geocoding)
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=pl&format=json`);
            const geoData = await geoRes.json();

            if (!geoData.results) {
                throw new Error("Nie znaleziono miasta.");
            }

            const { latitude, longitude, name } = geoData.results[0];

            // 2. Pobierz pogodę dla współrzędnych
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
            const weatherData = await weatherRes.json();

            // 3. Zapisz dane
            setWeatherData({
                city: name,
                temp: Math.round(weatherData.current.temperature_2m),
                condition: getWeatherDescription(weatherData.current.weather_code),
                humidity: weatherData.current.relative_humidity_2m,
                wind: weatherData.current.wind_speed_10m
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <Header />
            <SearchBar city={city} setCity={setCity} onSearch={handleSearch} />

            {loading && <p>Ładowanie...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {weatherData && (
                <>
                    <WeatherCard data={weatherData} />
                    <WeatherDetails data={weatherData} />
                </>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
