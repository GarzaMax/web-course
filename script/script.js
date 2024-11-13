document.addEventListener("DOMContentLoaded", function() {
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
    liveTimingTab.addEventListener("click", function() {
        showPage(liveTimingPage, liveTimingTab);
    });

    lapLogTab.addEventListener("click", function() {
        showPage(lapLogPage, lapLogTab);
    });

    pitstopTab.addEventListener("click", function() {
        showPage(pitstopPage, pitstopTab);
    });
});

(function() {
    // Подписка на событие полной загрузки страницы
    window.addEventListener('load', function() {
        const time = window.performance.timing
        // Получение времени загрузки с использованием Performance API
        const loadTime = time.loadEventStart - time.navigationStart;

        // Создание элемента с информацией о времени загрузки
        const loadInfo = document.createElement('p');
        loadInfo.textContent = `Время загрузки страницы: ${loadTime} миллисекунд.`;

        // Добавление информации в подвал
        const footer = document.getElementById('load-info');
        if (footer) {
            footer.appendChild(loadInfo);
        }
    });
})();