import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GenerationSelector = () => {
  const [birthYear, setBirthYear] = useState('');
  const navigate = useNavigate();

  const getGeneration = (year) => {
    if (year >= 1946 && year <= 1964) return 'boomers';
    if (year >= 1965 && year <= 1980) return 'gen-x';
    if (year >= 1981 && year <= 1996) return 'millennials';
    if (year >= 1997 && year <= 2012) return 'gen-z';
    if (year >= 2013) return 'alpha';
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const year = parseInt(birthYear);
    const generation = getGeneration(year);

    if (generation) {
      localStorage.setItem('user_generation', generation);
      navigate(`/charts/${generation}`);
    } else {
      alert('Please enter a valid year.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🎉 Welcome to Your Chart Experience</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Enter your birth year:</label>
        <input
          type="number"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          className="p-2 rounded-full border bg-white text-black mb-4"
          placeholder="e.g., 1999"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
        >
          Show My Generation Chart
        </button>
      </form>
    </div>
  );
};

export default GenerationSelector;