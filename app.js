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

const App = () => {
    const [city, setCity] = React.useState('');
    const [weatherData, setWeatherData] = React.useState(null);

    const handleSearch = () => {
        // Symulacja pobrania danych (na razie na sztywno, żebyś widział efekt)
        setWeatherData({
            city: city,
            temp: 22,
            condition: 'Słonecznie',
            humidity: 45,
            wind: 12
        });
    };

    return (
        <div className="container">
            <Header />
            <SearchBar city={city} setCity={setCity} onSearch={handleSearch} />

            {/* Wyświetl karty tylko jeśli mamy dane */}
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
