const html = htm.bind(React.createElement);

const Header = () => {
    return html`
        <header className="header">
            <h1>🌥️ Pogoda z Kirstofem</h1>
        </header>
    `;
};

const SearchBar = ({ city, setCity, onSearch, onLocation }) => {
    return html`
        <div className="search-bar">
            <input
                type="text"
                placeholder="Wpisz nazwę miasta..."
                value=${city}
                onChange=${(e) => setCity(e.target.value)}
                onKeyPress=${(e) => e.key === 'Enter' && onSearch()}
            />
            <button onClick=${onLocation} className="location-btn" title="Twoja lokalizacja">📍</button>
            <button onClick=${onSearch}>Szukaj</button>
        </div>
    `;
};

const WeatherDetails = ({ data }) => {
    return html`
        <div className="weather-details">
            <div className="detail-item">
                <span>💧 Wilgotność</span>
                <strong>${data.humidity}%</strong>
            </div>
            <div className="detail-item">
                <span>💨 Wiatr</span>
                <strong>${data.wind} km/h ${data.windDir}</strong>
            </div>
            <div className="detail-item">
                <span>🌡️ Odczuwalna</span>
                <strong>${data.apparentTemp}°C</strong>
            </div>
            <div className="detail-item">
                <span>🔽 Ciśnienie</span>
                <strong>${data.pressure} hPa</strong>
            </div>
            <div className="detail-item">
                <span>☔ Szansa na opady</span>
                <strong>${data.precipProb}%</strong>
            </div>
            ${data.uvIndex !== undefined && html`
                <div className="detail-item">
                    <span>☀️ Indeks UV</span>
                    <strong>${data.uvIndex}</strong>
                </div>
            `}
            <div className="detail-item">
                <span>👁️ Widoczność</span>
                <strong>${data.visibility} km</strong>
            </div>
            <div className="detail-item">
                <span>☁️ Zachmurzenie</span>
                <strong>${data.cloudCover}%</strong>
            </div>
            <div className="detail-item">
                <span>🌬️ Porywy wiatru</span>
                <strong>${data.windGusts} km/h</strong>
            </div>
            ${data.aqi !== undefined && html`
                <div className="detail-item">
                    <span>🍃 Jakość powietrza</span>
                    <strong style=${{ color: getAQIDescription(data.aqi).color }}>
                        ${getAQIDescription(data.aqi).text} (AQI: ${data.aqi})
                    </strong>
                </div>
            `}
            <div className="detail-item">
                <span>🌅 Wschód / Zachód</span>
                <strong>${data.sunrise} / ${data.sunset}</strong>
            </div>
            <div className="detail-item">
                <span>🌑 Faza Księżyca</span>
                <strong>${data.moonPhase}</strong>
            </div>
        </div>
    `;
};

const ForecastList = ({ forecast, selectedDayIndex, onSelectDay }) => {
    if (!forecast) return null;

    return html`
        <div className="forecast-section">
            <h3>Prognoza na kolejne dni</h3>
            <div className="forecast-grid">
                ${forecast.map((day, index) => html`
                    <div
                        key=${index}
                        className=${`forecast-item ${selectedDayIndex === index + 1 ? 'active' : ''}`}
                        onClick=${() => onSelectDay(index + 1)}
                        style=${{ cursor: 'pointer' }}
                    >
                        <span className="date">${day.date}</span>
                        <span className="icon">${day.icon}</span>
                        <div className="temps">
                            <span className="max">${day.maxTemp}°</span> / <span className="min">${day.minTemp}°</span>
                        </div>
                        <span className="rain">☔ ${day.precipProb}%</span>
                    </div>
                `)}
            </div>
        </div>
    `;
};

const FavoritesList = ({ favorites, onSelect, onRemove }) => {
    if (favorites.length === 0) return null;

    return html`
        <div className="favorites-section">
            <h3>Twoje Ulubione</h3>
            <div className="favorites-list">
                ${favorites.map(city => html`
                    <div key=${city} className="favorite-item">
                        <span onClick=${() => onSelect(city)}>${city}</span>
                        <button onClick=${() => onRemove(city)}>❌</button>
                    </div>
                `)}
            </div>
        </div>
    `;
};

// Funkcja pomocnicza do tłumaczenia kodów pogody z uwzględnieniem dnia/nocy
const getWeatherDescription = (code, isDay = true) => {
    const codes = {
        0: isDay ? 'Czyste niebo ☀️' : 'Bezchmurnie 🌙',
        1: isDay ? 'Przeważnie słonecznie 🌤️' : 'Przeważnie bezchmurnie 🌙',
        2: isDay ? 'Częściowe zachmurzenie ⛅' : 'Częściowe zachmurzenie ☁️',
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
    return html`
        <div className="hour-selector">
            <label>Sprawdź godzinę: <strong>${selectedHour === null ? 'Teraz' : `${selectedHour}:00`}</strong></label>
            <input
                type="range"
                min="0"
                max="23"
                value=${selectedHour === null ? new Date().getHours() : selectedHour}
                onChange=${(e) => onChange(parseInt(e.target.value))}
            />
            <div className="hour-labels">
                <span>00:00</span>
                <span>12:00</span>
                <span>23:00</span>
            </div>
            ${selectedHour !== null && html`
                <button className="reset-hour-btn" onClick=${() => onChange(null)}>Wróc do "Teraz"</button>
            `}
        </div>
    `;
};

// Helper function to extract hourly data for a specific hour
const getHourlyData = (hourly, hour, dayIndex = 0) => {
    const offset = dayIndex * 24 + hour;
    const rawVisibility = hourly.visibility ? hourly.visibility[offset] : null;
    // Cap visibility at 24.1 km (meteorological standard for "excellent")
    const processedVisibility = rawVisibility !== null ? Math.min(rawVisibility / 1000, 24.1).toFixed(1) : '-';

    return {
        temp: Math.round(hourly.temperature_2m[offset]),
        code: hourly.weather_code[offset],
        isDay: hourly.is_day ? !!hourly.is_day[offset] : true,
        precipProb: hourly.precipitation_probability[offset],
        wind: Math.round(hourly.wind_speed_10m[offset]),
        windDir: getWindDirection(hourly.wind_direction_10m[offset]),
        pressure: Math.round(hourly.surface_pressure[offset]),
        humidity: hourly.relative_humidity_2m[offset],
        apparentTemp: Math.round(hourly.apparent_temperature[offset]),
        uvIndex: hourly.uv_index ? Math.round(hourly.uv_index[offset]) : '-',
        visibility: processedVisibility,
        cloudCover: hourly.cloud_cover ? hourly.cloud_cover[offset] : '-',
        windGusts: hourly.wind_gusts_10m ? Math.round(hourly.wind_gusts_10m[offset]) : '-',
        sunrise: "-",
        sunset: "-"
    };
};

// Helper to interpret AQI (European CAQI)
const getAQIDescription = (aqi) => {
    if (aqi === null || aqi === undefined) return { text: '-', color: 'inherit' };
    if (aqi <= 25) return { text: 'Bardzo dobra (Extra) 🟢', color: '#57cc99' };
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
const WeatherMap = ({ lat, lon, code, timestamp }) => {
    let overlay = 'wind';
    if (code >= 51 && code <= 99) overlay = 'rain';
    else if ((code >= 1 && code <= 3) || code === 45 || code === 48) overlay = 'clouds';
    else if (code === 0) overlay = 'temp';

    // Force unique URL to trigger iframe reload when timestamp or overlay changes
    const timeKey = timestamp ? timestamp.getTime() : 'now';
    const embedUrl = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=650&height=450&zoom=10&level=surface&overlay=${overlay}&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1&t=${timeKey}`;

    return html`
        <div className="weather-map-container">
            <iframe key=${timeKey} title="Mapa Pogodowa" src=${embedUrl}></iframe>
        </div>
    `;
};

const NotificationWidget = ({ message, type, onClose }) => {
    if (!message) return null;
    let icon = 'ℹ️';
    if (type === 'error') icon = '⚠️';
    if (type === 'success') icon = '✅';
    return html`
        <div className=${`notification-widget ${type}`}>
            <span>${icon}</span>
            <span>${message}</span>
            <button onClick=${onClose} style=${{ background: 'none', border: 'none', color: 'white', marginLeft: 'auto', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
        </div>
    `;
};


const App = () => {
    const [city, setCity] = React.useState('');
    const [weatherData, setWeatherData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [notification, setNotification] = React.useState(null);
    const [favorites, setFavorites] = React.useState([]);
    const [selectedHour, setSelectedHour] = React.useState(null);
    const [selectedDayIndex, setSelectedDayIndex] = React.useState(0);

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    React.useEffect(() => {
        try {
            const saved = localStorage.getItem('skycast_favorites');
            if (saved) setFavorites(JSON.parse(saved));
        } catch (err) {
            console.error("Błąd ładowania ulubionych:", err);
            localStorage.removeItem('skycast_favorites');
        }
    }, []);

    const saveFavorites = (newFavorites) => {
        setFavorites(newFavorites);
        localStorage.setItem('skycast_favorites', JSON.stringify(newFavorites));
    };

    const fetchDataByCoords = async (latitude, longitude, name, countryCode, admin1) => {
        try {
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,precipitation_probability,weather_code,uv_index,visibility,wind_gusts_10m,cloud_cover,is_day&hourly=temperature_2m,apparent_temperature,weather_code,precipitation_probability,wind_speed_10m,wind_direction_10m,surface_pressure,relative_humidity_2m,uv_index,visibility,wind_gusts_10m,cloud_cover,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max&timezone=auto`);
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
                admin1: admin1,
                countryCode: countryCode ? countryCode.toLowerCase() : null,
                coords: { lat: latitude, lon: longitude },
                current: {
                    temp: Math.round(data.current.temperature_2m),
                    code: data.current.weather_code,
                    isDay: !!data.current.is_day,
                    condition: getWeatherDescription(data.current.weather_code, !!data.current.is_day),
                    humidity: data.current.relative_humidity_2m,
                    wind: Math.round(data.current.wind_speed_10m),
                    windDir: getWindDirection(data.current.wind_direction_10m),
                    pressure: Math.round(data.current.surface_pressure),
                    // Use hourly data for probability as Open-Meteo doesn't provide it in 'current'
                    precipProb: (data.hourly && data.hourly.time && data.current.time) ? data.hourly.precipitation_probability[data.hourly.time.indexOf(data.current.time)] || 0 : 0,
                    apparentTemp: Math.round(data.current.apparent_temperature),
                    sunrise: new Date(data.daily.sunrise[0]).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
                    sunset: new Date(data.daily.sunset[0]).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
                    moonPhase: getMoonPhaseDescription(getMoonPhase(new Date())),
                    uvIndex: data.current.uv_index !== undefined ? Math.round(data.current.uv_index) : '-',
                    visibility: data.current.visibility !== undefined ? Math.min(data.current.visibility / 1000, 24.1).toFixed(1) : '-',
                    cloudCover: data.current.cloud_cover !== undefined ? data.current.cloud_cover : 0,
                    windGusts: data.current.wind_gusts_10m !== undefined ? Math.round(data.current.wind_gusts_10m) : '-',
                    aqi: aqi
                },
                hourly: data.hourly,
                forecast: forecast,
                daily: data.daily // Store full daily data
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
        setSelectedDayIndex(0);
        try {
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchCity}&count=1&language=pl&format=json`);
            const geoData = await geoRes.json();
            if (!geoData.results) throw new Error("Nie znaleziono miasta.");
            const { latitude, longitude, name, country_code, admin1 } = geoData.results[0];
            await fetchDataByCoords(latitude, longitude, name, country_code, admin1);
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
        setSelectedDayIndex(0);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                let name = "Twoja lokalizacja";
                let country_code = null;
                let admin1 = null;
                try {
                    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=pl&format=json`);
                    if (geoRes.ok) {
                        const geoData = await geoRes.json();
                        if (geoData.results && geoData.results[0]) {
                            name = geoData.results[0].name;
                            country_code = geoData.results[0].country_code;
                            admin1 = geoData.results[0].admin1;
                        }
                    }
                } catch (err) { }
                try {
                    setCity('');
                    await fetchDataByCoords(latitude, longitude, name, country_code, admin1);
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
        if (selectedHour !== null || selectedDayIndex > 0) {
            const hour = selectedHour !== null ? selectedHour : 12; // Default to noon if only day is selected
            const hourly = getHourlyData(weatherData.hourly, hour, selectedDayIndex);

            displayData = {
                city: selectedDayIndex === 0 ? weatherData.city : `${weatherData.city} (${weatherData.forecast[selectedDayIndex - 1].date})`,
                countryCode: weatherData.countryCode,
                ...hourly,
                condition: getWeatherDescription(hourly.code, hourly.isDay),
                aqi: weatherData.current.aqi,
                sunrise: selectedDayIndex === 0 ? weatherData.current.sunrise : new Date(weatherData.daily.sunrise[selectedDayIndex]).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
                sunset: selectedDayIndex === 0 ? weatherData.current.sunset : new Date(weatherData.daily.sunset[selectedDayIndex]).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
                moonPhase: getMoonPhaseDescription(getMoonPhase(new Date(weatherData.daily.time[selectedDayIndex])))
            };
            const now = new Date();
            mapTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate() + selectedDayIndex, hour, 0, 0);
        } else {
            displayData = {
                city: weatherData.city,
                countryCode: weatherData.countryCode,
                ...weatherData.current
            };
        }
    }

    return html`
        <div className="container">
            <${Header} />
            <${SearchBar} city=${city} setCity=${setCity} onSearch=${() => fetchWeather(city)} onLocation=${fetchUserLocation} />

            ${loading && html`<p>Ładowanie...</p>`}
            ${notification && html`<${NotificationWidget} message=${notification.message} type=${notification.type} onClose=${() => setNotification(null)} />`}

            ${weatherData && displayData && html`
                <div className="location-header">
                    <h2>
                        ${weatherData.city}
                        ${weatherData.countryCode && html`
                            <img
                                src=${`https://flagcdn.com/h40/${weatherData.countryCode.toLowerCase()}.png`}
                                alt="flag"
                                style=${{ marginLeft: '15px', height: '30px', borderRadius: '4px', verticalAlign: 'middle' }}
                            />
                        `}
                    </h2>
                    ${weatherData.admin1 && html`<p className="province-name">${weatherData.admin1}</p>`}
                    <div className="header-weather-main">
                        <div className="main-temperature">${displayData.temp}°C</div>
                        <div className="main-condition">
                            <span className="condition-text">${displayData.condition}</span>
                            <button
                                className=${`favorite-btn header-fav ${isFavorite ? 'active' : ''}`}
                                onClick=${toggleFavorite}
                            >
                                ${isFavorite ? '❤️' : '🤍'}
                            </button>
                        </div>
                    </div>
                </div>
            `}

            ${weatherData && displayData && html`
                <${React.Fragment}>
                    <div className="top-controls">
                        <button
                            className=${`favorite-btn ${selectedDayIndex === 0 ? 'active' : ''}`}
                            onClick=${() => { setSelectedDayIndex(0); setSelectedHour(null); }}
                            style=${{ padding: '10px 20px', borderRadius: '15px' }}
                        >
                            Dzisiaj
                        </button>
                    </div>

                    <${HourSelector} selectedHour=${selectedHour} onChange=${setSelectedHour} />

                    <${WeatherDetails} data=${displayData} />
                    ${weatherData.coords && html`<${WeatherMap} lat=${weatherData.coords.lat} lon=${weatherData.coords.lon} code=${displayData.code} timestamp=${mapTimestamp} />`}
                    <${ForecastList}
                        forecast=${weatherData.forecast}
                        selectedDayIndex=${selectedDayIndex}
                        onSelectDay=${(idx) => { setSelectedDayIndex(idx); setSelectedHour(null); }}
                    />
                <//>
            `}
            <${FavoritesList} favorites=${favorites} onSelect=${fetchWeather} onRemove=${removeFavorite} />
        </div>
    `;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
