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

const App = () => {
    const [city, setCity] = React.useState('');

    const handleSearch = () => {
        alert(`Szukam pogody dla: ${city}`); // Tymczasowe powiadomienie
    };

    return (
        <div className="container">
            <Header />
            <SearchBar city={city} setCity={setCity} onSearch={handleSearch} />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
