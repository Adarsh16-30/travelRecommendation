
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(link.dataset.section + 'Section').classList.add('active');
  });
});

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const searchResults = document.getElementById('searchResults');


async function fetchTravelData() {
  try {
    const response = await fetch('travel_recommendation_api.json');
    const data = await response.json();
    console.log('Travel data loaded:', data);
    return data;
  } catch (error) {
    console.error('Error fetching travel data:', error);
    return null;
  }
}

searchBtn.addEventListener('click', async () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  
  if (!searchTerm) {
    alert('Please enter a valid search query.');
    return;
  }
  
  const data = await fetchTravelData();
  if (!data) {
    alert('Unable to load travel recommendations. Please try again later.');
    return;
  }
  

  searchResults.innerHTML = '';
  
  if (searchTerm === 'beach' || searchTerm === 'beaches' || searchTerm.includes('beach')) {
    displayResults(data.beaches, 'beaches');
  } else if (searchTerm === 'temple' || searchTerm === 'temples' || searchTerm.includes('temple')) {
    displayResults(data.temples, 'temples');
  } else if (searchTerm === 'country' || searchTerm === 'countries' || searchTerm.includes('country')) {
    displayCountryResults(data.countries);
  } else {
    searchResults.innerHTML = '<p>No results found for your search. Try searching for "beach", "temple", or "country".</p>';
  }
  
  searchResults.scrollIntoView({ behavior: 'smooth' });
});

function displayResults(items, category) {
  if (!items || items.length === 0) {
    searchResults.innerHTML = `<p>No ${category} found.</p>`;
    return;
  }
  
  const resultsHTML = items.map(item => {
    const localTime = getLocalTime(item.name);
    
    return `
      <div class="search-result-card">
        <img src="${item.imageUrl}" alt="${item.name}">
        <div class="search-result-info">
          <h2>${item.name}</h2>
          ${localTime ? `<div class="time">Local time: ${localTime}</div>` : ''}
          <p>${item.description}</p>
          <button id="result">Visit</button>
        </div>
      </div>
    `;
  }).join('');
  
  searchResults.innerHTML = `<h2>Recommended ${category.charAt(0).toUpperCase() + category.slice(1)}</h2>` + resultsHTML;
}

function displayCountryResults(countries) {
  if (!countries || countries.length === 0) {
    searchResults.innerHTML = '<p>No countries found.</p>';
    return;
  }
  
  let resultsHTML = '';
  
  countries.forEach(country => {
    country.cities.forEach(city => {
      const localTime = getLocalTime(city.name);
      
      resultsHTML += `
        <div class="search-result-card">
          <img src="${city.imageUrl}" alt="${city.name}">
          <div class="search-result-info">
            <h2>${city.name}</h2>
            ${localTime ? `<div class="time">Local time: ${localTime}</div>` : ''}
            <p>${city.description}</p>
            <button id="result">Visit</button>
          </div>
        </div>
      `;
    });
  });
  
  searchResults.innerHTML = '<h2>Recommended Countries</h2>' + resultsHTML;
}

function getLocalTime(location) {
  try {
    const timeZones = {
      'Sydney, Australia': 'Australia/Sydney',
      'Melbourne, Australia': 'Australia/Melbourne',
      'Tokyo, Japan': 'Asia/Tokyo',
      'Kyoto, Japan': 'Asia/Tokyo',
      'Rio de Janeiro, Brazil': 'America/Sao_Paulo',
      'São Paulo, Brazil': 'America/Sao_Paulo',
      'Bora Bora, French Polynesia': 'Pacific/Tahiti',
      'Copacabana Beach, Brazil': 'America/Sao_Paulo',
      'Angkor Wat, Cambodia': 'Asia/Phnom_Penh',
      'Taj Mahal, India': 'Asia/Kolkata'
    };
    
    const timeZone = timeZones[location];
    if (!timeZone) return null;
    
    const options = { 
      timeZone: timeZone, 
      hour12: true, 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    return new Date().toLocaleString('en-US', options);
  } catch (error) {
    console.error('Error getting local time:', error);
    return null;
  }
}

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchResults.innerHTML = '';
});

document.querySelector('.contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Thank you for contacting us!');
  this.reset();
});


