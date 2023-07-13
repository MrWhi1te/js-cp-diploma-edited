selectSeanse = JSON.parse(sessionStorage.selectSeanse);           // Получение информации из локального хранилища о сеансе и конфигурации зала
dataRequest = `event=get_hallConfig&timestamp=${selectSeanse.seanceTimeStamp}&hallId=${selectSeanse.hallId}&seanceId=${selectSeanse.seanceId}`;

document.addEventListener("DOMContentLoaded", () => {                               //Выполнение только после полной загрузки HTML-документа.
  let acceptinButton = document.querySelector('.acceptin-button');
  let buyingInfoTitle = document.querySelector('.buying__info-title');
  let buyingInfoStart = document.querySelector('.buying__info-start');
  let buyingInfoHall = document.querySelector('.buying__info-hall');
  let priceStandart = document.querySelector('.price-standart');
  let confStepWrapper = document.querySelector('.conf-step__wrapper');

  buyingInfoTitle.innerHTML = selectSeanse.filmName;
  buyingInfoStart.innerHTML = `Начало сеанса ${selectSeanse.seanceTime}`;
  buyingInfoHall.innerHTML = selectSeanse.hallName;
  priceStandart.innerHTML = selectSeanse.priceStandart;

  request(dataRequest, (obj) => {                                                       // Запрос для получения конфигурации зала
    if (obj) {
        selectSeanse.hallConfig = obj;
    }
    confStepWrapper.innerHTML = selectSeanse.hallConfig;
    
    let chairs = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair'));
    acceptinButton.setAttribute("disabled", true);
    chairs.forEach((chair) => {                         
      chair.addEventListener('click', (event) => {                                                      //Обработчик событий click на кресла зала.
        if (event.target.classList.contains('conf-step__chair_taken')) {
          return;
        };
        event.target.classList.toggle('conf-step__chair_selected');
        let chairsSelected = Array.from(document.querySelectorAll('.conf-step__row .conf-step__chair_selected'));
        if (chairsSelected.length > 0) {
          acceptinButton.removeAttribute("disabled");                               // Если кресла выбраны удаляем аттрибут "disabled"
        } else {
          acceptinButton.setAttribute("disabled", true);
        };
      });
    });
  });
  
  acceptinButton.addEventListener("click", (event) => {
    event.preventDefault();
    let selectedPlaces = Array();
    let rows = Array.from(document.getElementsByClassName("conf-step__row"));
    for (let i = 0; i < rows.length; i++) {
      let spanPlaces = Array.from(rows[i].getElementsByClassName("conf-step__chair"));
      for (let j = 0; j < spanPlaces.length; j++) {
        if (spanPlaces[j].classList.contains("conf-step__chair_selected")) {
          let typePlace = (spanPlaces[j].classList.contains("conf-step__chair_standart")) ? "standart" : "vip";
          selectedPlaces.push({
            "row": i+1,                         // Номер ряда
            "place": j+1,                       // Номер места
            "type":  typePlace,                 // Тип места
          });
        };
      };
    };
    
    let configurationHall = document.querySelector('.conf-step__wrapper').innerHTML;
    selectSeanse.hallConfig = configurationHall;
    selectSeanse.salesPlaces = selectedPlaces;
    sessionStorage.setItem('selectSeanse', JSON.stringify(selectSeanse));                       // Сохраняем текущий сеанс с выбранными местами в локальное хранилище
    window.location.href = "payment.html";                                                      // Переход на страницу оплаты
  });
});