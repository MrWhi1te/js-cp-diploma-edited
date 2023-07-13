document.addEventListener("DOMContentLoaded", () => {                               //Выполнение только после полной загрузки HTML-документа.
    let dayNumber = document.querySelectorAll(".page-nav__day-number");
    let dayWeek = document.querySelectorAll(".page-nav__day-week");
    let dayWeekList = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    let dayNow = new Date();
    dayNow.setHours(0, 0, 0);
    for (let i = 0; i < dayNumber.length; i++) {
      let day = new Date(dayNow.getTime() + (i * 24 * 60 * 60 * 1000));             // дата отображаемого дня
      let timestamp = Math.trunc(day/1000);
      dayNumber[i].innerHTML = `${day.getDate()},`;
      dayWeek[i].innerHTML = `${dayWeekList[day.getDay()]}`;
      let dayLink = dayNumber[i].parentNode
      dayLink.dataset.timeStamp = timestamp;
      if ((dayWeek[i].innerHTML == 'Вс') || (dayWeek[i].innerHTML == 'Сб')) {
        dayLink.classList.add('page-nav__day_weekend');                                // Если день выходной. Добавляем к клаасу элемента. Иначе удаляем из класса.
      } else {
        dayLink.classList.remove('page-nav__day_weekend');
      };
    };

    request("event=update",(obj)=>{                                     // Запрос актуального расписаниия.
        let element = {};
        element.seances = obj.seances.result; 
        element.films = obj.films.result;
        element.halls = obj.halls.result;
        element.halls = element.halls.filter(hall => hall.hall_open == 1);     //Фильтр на доступные залы

        let main = document.querySelector("main");

        element.films.forEach((film) => {
            let seancesHTML = '';
            let filmId = film.film_id;

            element.halls.forEach((hall) => {
                let seances = element.seances.filter(seance => ((seance.seance_hallid == hall.hall_id) && (seance.seance_filmid == filmId)));  // Фильтр сеансов для фильма и зала
                if (seances.length > 0) {                                                               //Если больше 0. html-код, с информацией о залах и времени сеансов
                  seancesHTML += `                                                                  
                    <div class="movie-seances__hall">
                      <h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
                      <ul class="movie-seances__list">`
                  seances.forEach(seance => seancesHTML += `<li class="movie-seances__time-block"><a class="movie-seances__time"   href="hall.html" data-film-name="${film.film_name}" data-film-id="${film.film_id}" data-hall-id="${hall.hall_id}" data-hall-name="${hall.hall_name}" data-price-vip="${hall.hall_price_vip}" data-price-standart="${hall.hall_price_standart}" data-seance-id="${seance.seance_id}" 
                      data-seance-start="${seance.seance_start}" data-seance-time="${seance.seance_time}">${seance.seance_time}</a></li>`);
                  seancesHTML += `
                    </ul>
                    </div>`
                };
            });
            if (seancesHTML) {
                main.innerHTML += `
                <section class="movie">
                        <div class="movie__info">
                            <div class="movie__poster">
                                <img class="movie__poster-image" alt="${film.film_name} постер" src="${film.film_poster}">
                            </div>
                            <div class="movie__description">
                                <h2 class="movie__title">${film.film_name}</h2>
                                <p class="movie__synopsis">${film.film_description}</p>
                                <p class="movie__data">
                                    <span class="movie__data-duration">${film.film_duration} мин.</span>
                                    <span class="movie__data-origin">${film.film_origin}</span>
                                </p>
                            </div>
                        </div>
                    ${seancesHTML}
                </section>`
            };
        });
        let dayLinks = Array.from(document.querySelectorAll(".page-nav__day"));
        let movieSeances = Array.from(document.querySelectorAll(".movie-seances__time"));

        dayLinks.forEach(dayLink => dayLink.addEventListener('click', (event) => {                      //Обработчик событий click на элементы страницы.
            event.preventDefault();
    
            document.querySelector(".page-nav__day_chosen").classList.remove("page-nav__day_chosen");
            dayLink.classList.add("page-nav__day_chosen");
    
            let timeStampDay = Number(event.target.dataset.timeStamp);
            if (isNaN(timeStampDay)) {
                timeStampDay = Number(event.target.closest('.page-nav__day').dataset.timeStamp);
            };
            movieSeances.forEach((element) => {
                let timeStampSeanceDay = Number(element.dataset.seanceStart) * 60;
                let timeStampSeance = timeStampDay + timeStampSeanceDay;
                let timeStampNow = Math.trunc(+new Date() / 1000);
                element.dataset.seanceTimeStamp = timeStampSeance;
                if ((timeStampSeance - timeStampNow) > 0) {
                    element.classList.remove('acceptin-button-disabled');
                } else {
                    element.classList.add('acceptin-button-disabled');
                };
            });
        }));
        dayLinks[0].click();
        movieSeances.forEach((el) => el.addEventListener('click', (event) => {                      // Обработчик событий click на элемент
            let selectSeanse = event.target.dataset;
            selectSeanse.hallConfig = element.halls.find(hall => hall.hall_id == selectSeanse.hallId).hall_config;
            sessionStorage.setItem('selectSeanse', JSON.stringify(selectSeanse));                                       //Добавляем в локальное хранилище
        }));
    })
})