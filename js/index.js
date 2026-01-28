var size = 86;
var columns = Array.from(document.getElementsByClassName('column'));
var d = void 0,
    c = void 0;
var classList = ['visible', 'close', 'far', 'far', 'distant', 'distant'];
var use24HourClock = true;

// Countdown configuration
var countdownIntervals = [];

// Lively Wallpaper API - Listen for property changes
function livelyPropertyListener(name, val) {
	console.log('🔄 Property changed:', name, '=', val);
	// Reload countdown when any property changes
	setTimeout(function() {
		loadCountdownsFromLively();
	}, 100);
}

// Load countdowns from Lively Properties
function loadCountdownsFromLively() {
	
		loadConfigFromFile();
	
}

// Load config.json as fallback
function loadConfigFromFile() {
	fetch('./config.json?t=' + new Date().getTime())
		.then(response => {
			if (!response.ok) {
				throw new Error('Cannot load config file');
			}
			return response.json();
		})
		.then(config => {
			console.log('✅ Config loaded from file:', config);
			loadCountdowns(config.countdowns);
		})
		.catch(error => {
			console.error('❌ Error loading config:', error);
			// Use default if config fails to load
			loadCountdowns([
				{
					targetDate: '2026-12-31T23:59:59',
					title: 'Default Countdown'
				}
			]);
		});
}

// Initial load - Try Lively first, fallback to config.json
if (typeof livelyPropertyValue !== 'undefined') {
	console.log('🎨 Lively Wallpaper detected - using LivelyProperties');
	loadCountdownsFromLively();
} else {
	console.log('🌐 Browser mode - using config.json');
	loadConfigFromFile();
	
	// Auto reload config every 3 seconds when not in Lively
	setInterval(function() {
		loadConfigFromFile();
	}, 3000);
}

function loadCountdowns(countdowns) {
	const wrapper = document.getElementById('countdowns-wrapper');
	
	// Clear existing countdowns
	wrapper.innerHTML = '';
	countdownIntervals.forEach(interval => clearInterval(interval));
	countdownIntervals = [];
	
	// Create countdown for each item in array
	countdowns.forEach((countdown, index) => {
		const container = createCountdownElement(countdown, index);
		wrapper.appendChild(container);
		
		// Start countdown
		const interval = setInterval(() => updateCountdown(countdown.targetDate, index), 1000);
		countdownIntervals.push(interval);
		
		// Initial update
		updateCountdown(countdown.targetDate, index);
	});
}

function createCountdownElement(countdown, index) {
	const container = document.createElement('div');
	container.className = 'countdown-container';
	container.id = 'countdown-' + index;
	
	container.innerHTML = 
		'<h2 class="countdown-title">' + countdown.title + '</h2>' +
		'<div class="countdown-grid">' +
			'<div class="countdown-column">' +
				'<div class="countdown-item">' +
					'<span class="countdown-value" id="years-' + index + '">0</span>' +
					'<span class="countdown-label">Years</span>' +
				'</div>' +
				'<div class="countdown-item">' +
					'<span class="countdown-value" id="months-' + index + '">0</span>' +
					'<span class="countdown-label">Months</span>' +
				'</div>' +
				'<div class="countdown-item">' +
					'<span class="countdown-value" id="days-' + index + '">0</span>' +
					'<span class="countdown-label">Days</span>' +
				'</div>' +
			'</div>' +
			'<div class="countdown-column">' +
				'<div class="countdown-item">' +
					'<span class="countdown-value" id="hours-' + index + '">0</span>' +
					'<span class="countdown-label">Hours</span>' +
				'</div>' +
				'<div class="countdown-item">' +
					'<span class="countdown-value" id="minutes-' + index + '">0</span>' +
					'<span class="countdown-label">Minutes</span>' +
				'</div>' +
				'<div class="countdown-item">' +
					'<span class="countdown-value" id="seconds-' + index + '">0</span>' +
					'<span class="countdown-label">Seconds</span>' +
				'</div>' +
			'</div>' +
		'</div>';
	
	return container;
}

function updateCountdown(targetDate, index) {
	const now = new Date().getTime();
	const target = new Date(targetDate).getTime();
	const difference = target - now;
	
	if (difference <= 0) {
		document.getElementById('years-' + index).textContent = '0';
		document.getElementById('months-' + index).textContent = '0';
		document.getElementById('days-' + index).textContent = '0';
		document.getElementById('hours-' + index).textContent = '0';
		document.getElementById('minutes-' + index).textContent = '0';
		document.getElementById('seconds-' + index).textContent = '0';
		return;
	}
	
	// Calculate time units
	const seconds = Math.floor((difference / 1000) % 60);
	const minutes = Math.floor((difference / 1000 / 60) % 60);
	const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
	
	// Calculate years, months, and remaining days
	const nowDate = new Date();
	const targetDateObj = new Date(targetDate);
	
	let years = targetDateObj.getFullYear() - nowDate.getFullYear();
	let months = targetDateObj.getMonth() - nowDate.getMonth();
	let days = targetDateObj.getDate() - nowDate.getDate();
	
	// Adjust for negative days
	if (days < 0) {
		months--;
		const prevMonth = new Date(targetDateObj.getFullYear(), targetDateObj.getMonth(), 0);
		days += prevMonth.getDate();
	}
	
	// Adjust for negative months
	if (months < 0) {
		years--;
		months += 12;
	}
	
	// Update display
	document.getElementById('years-' + index).textContent = years;
	document.getElementById('months-' + index).textContent = months;
	document.getElementById('days-' + index).textContent = days;
	document.getElementById('hours-' + index).textContent = hours;
	document.getElementById('minutes-' + index).textContent = minutes;
	document.getElementById('seconds-' + index).textContent = seconds;
}

function padClock(p, n) {
	return p + ('0' + n).slice(-2);
}

function getClock() {
	d = new Date();
	return [use24HourClock ? d.getHours() : d.getHours() % 12 || 12, d.getMinutes(), d.getSeconds()].reduce(padClock, '');
}

function getClass(n, i2) {
	return classList.find(function (class_, classIndex) {
		return Math.abs(n - i2) === classIndex;
	}) || '';
}

var loop = setInterval(function () {
	c = getClock();

	columns.forEach(function (ele, i) {
		var n = +c[i];
		var offset = -n * size;
		ele.style.transform = 'translateY(calc(50vh + ' + offset + 'px - ' + size / 2 + 'px))';
		Array.from(ele.children).forEach(function (ele2, i2) {
			ele2.className = 'num ' + getClass(n, i2);
		});
	});
}, 200 + Math.E * 10);

// Ensure video plays
var video = document.getElementById('bgVideo');
if (video) {
	video.play().catch(function(error) {
		console.log("Video autoplay failed:", error);
	});
}

// Removed background image code to show video instead
/*
function changeBg() {
	var currentTime = new Date().getHours();
	if (7 <= currentTime&&currentTime < 21) {
		document.body.style.backgroundImage ="url('img/background_day.jpg')"
	}
	else {
		document.body.style.backgroundImage ="url('img/background_night.jpg')"
	}
}

changeBg();
 setInterval(function(){ changeBg(); }, 300000); //300000 means 5 min
*/