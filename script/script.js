document.addEventListener("DOMContentLoaded", function () {
    const liveTimingTab = document.getElementById("live-timing-tab");
    const lapLogTab = document.getElementById("lap-log-tab");
    const pitstopTab = document.getElementById("pitstop-tab");
    const liveTimingPage = document.getElementById("live-timing-page");
    const lapLogPage = document.getElementById("lap-log-page");
    const pitstopPage = document.getElementById("pitstop-page");

    // Функция для переключения страниц
    function showPage(pageToShow, tabToActivate) {
        liveTimingPage.classList.remove("active");
        pitstopPage.classList.remove("active");
        lapLogPage.classList.remove("active");
        liveTimingTab.classList.remove("active");
        pitstopTab.classList.remove("active");
        lapLogTab.classList.remove("active");

        pageToShow.classList.add("active");
        tabToActivate.classList.add("active");
    }

    // Обработчики для переключения страниц
    liveTimingTab.addEventListener("click", function () {
        showPage(liveTimingPage, liveTimingTab);
    });

    lapLogTab.addEventListener("click", function () {
        showPage(lapLogPage, lapLogTab);
    });

    pitstopTab.addEventListener("click", function () {
        showPage(pitstopPage, pitstopTab);
    });

    let drivers = [];

    const storedData = localStorage.getItem('standingsData');
    if (storedData) {
        drivers = JSON.parse(storedData);
        updateDriverPositioning();
        renderTable();
    }

    document.getElementById('lap-time-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('driver-name').value;
        const number = parseInt(document.getElementById('driver-number').value);
        const lapTimeInput = document.getElementById('lap-time').value;

        if (!isValidTimeFormat(lapTimeInput)) {
            alert('Invalid time format! Please use MM:SS.sss');
            return;
        }

        const lapTime = parseTime(lapTimeInput);

        let driver = findDriver(number);
        if (!driver) {
            driver = createNewDriver(name, number);
            drivers.push(driver);
        }

        driver.lapTimes.push(lapTime);
        updateDriverStats(driver);
        updateDriverPositioning();
        renderTable();
        saveToLocalStorage();
    });

    document.getElementById('clear-table').addEventListener('click', function () {
        if (confirm('Are you sure you want to clear the table? This action cannot be undone.')) {
            drivers = [];
            localStorage.removeItem('standingsData');
            renderTable();
        }
    });

    function isValidTimeFormat(timeStr) {
        const timePattern = /^\d{1,2}:\d{2}\.\d{3}$/;
        return timePattern.test(timeStr);
    }

    function parseTime(timeStr) {
        const parts = timeStr.split(':');
        return parseInt(parts[0]) * 60 + parseFloat(parts[1]);
    }

    function findDriver(number) {
        return drivers.find(driver => driver.number === number);
    }

    function createNewDriver(name, number) {
        return {
            name,
            number,
            lapTimes: [],
            bestLap: null,
            lastLap: null,
            laps: 0,
            avgLap: null,
            totalTime: 0,
            position: 0,
            interval: "0.000"
        };
    }

    function updateDriverStats(driver) {
        driver.bestLap = Math.min(...driver.lapTimes);
        driver.lastLap = driver.lapTimes[driver.lapTimes.length - 1];
        driver.laps = driver.lapTimes.length;
        driver.avgLap = (driver.lapTimes.reduce((a, b) => a + b, 0) / driver.laps).toFixed(3);
        driver.totalTime = driver.lapTimes.reduce((a, b) => a + b, 0);
    }

    function updateDriverPositioning() {
        drivers.sort((a, b) => {
            if (a.laps === b.laps) {
                return a.totalTime - b.totalTime;
            }
            return b.laps - a.laps;
        });

        drivers.forEach((driver, index) => {
            driver.position = index + 1;
            if (index === 0) {
                driver.interval = "-";
            } else {
                const leaderTime = drivers[0].totalTime;
                driver.interval = (driver.totalTime - leaderTime).toFixed(3);
            }
        });
    }

    function renderTable() {
        const standingsGrid = document.querySelector('.standings-grid');

        const headersCount = 10; // количество заголовков
        while (standingsGrid.children.length > headersCount) {
            standingsGrid.removeChild(standingsGrid.lastChild);
        }

        drivers.forEach(driver => {
            standingsGrid.innerHTML += `
                        <div class="grid-item">${driver.number}</div>
                        <div class="grid-item">${driver.position}</div>
                        <div class="grid-item">${driver.name}</div>
                        <div class="grid-item">${formatTime(driver.avgLap)}</div>
                        <div class="grid-item">${formatTime(driver.bestLap)}</div>
                        <div class="grid-item">${formatTime(driver.lastLap)}</div>
                        <div class="grid-item">${driver.laps}</div>
                        <div class="grid-item">0</div>
                        <div class="grid-item">${driver.interval}</div>
                        <div class="grid-item">0</div>
                    `;
        });
    }

    function formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return 'N/A';
        const minutes = Math.floor(seconds / 60);
        const secs = (seconds % 60).toFixed(3);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function saveToLocalStorage() {
        localStorage.setItem('standingsData', JSON.stringify(drivers));
    }
});
