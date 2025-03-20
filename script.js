// Dark Mode Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggleBtn.textContent = document.body.classList.contains('dark-mode') ? '🌞' : '🌙';
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Load Dark Mode Preference from localStorage
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = '🌞';
}

// Weather API (OpenWeatherMap)
const weatherDisplay = document.getElementById('weather-display');
const apiKey = 'YOUR_API_KEY';  // Replace with your OpenWeatherMap API key
const city = 'New York';

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
        weatherDisplay.innerHTML = `Current Temperature in ${data.name}: ${data.main.temp}°C`;
    })
    .catch(err => {
        weatherDisplay.innerHTML = 'Failed to load weather data.';
    });

// Image Gallery Lightbox
const galleryItems = document.querySelectorAll('.gallery-item img');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.innerHTML = `<img src="${item.src}" alt="Lightbox Image"><button class="close">×</button>`;
        document.body.appendChild(lightbox);
        const closeBtn = lightbox.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            lightbox.remove();
        });
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Back to Top Button
const backToTopBtn = document.getElementById('backToTopBtn');
window.addEventListener('scroll', () => {
    if (document.documentElement.scrollTop > 100) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Contact Form Validation
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        alert('Message sent!');
        contactForm.reset();
    } else {
        alert('Please fill in all fields!');
    }
});
