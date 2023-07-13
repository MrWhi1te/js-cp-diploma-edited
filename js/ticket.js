let selectSeanse = JSON.parse(sessionStorage.selectSeanse);             // Получение информации из локального хранилища

document.addEventListener("DOMContentLoaded", function() {            //Выполнение только после полной загрузки HTML-документа.
  let places = "";
  let price = 0;
  
  selectSeanse.salesPlaces.forEach((element) => {
    if (places) {
      places += ", ";
    }
    places += `${element.row}/${element.place}`;
    price += element.type === "standart" 
      ? Number(selectSeanse.priceStandart) 
      : Number(selectSeanse.priceVip);
  });
  
  document.querySelector(".ticket__title").innerHTML = selectSeanse.filmName;  
  document.querySelector(".ticket__chairs").innerHTML = places; 
  document.querySelector(".ticket__hall").innerHTML = selectSeanse.hallName;  
  document.querySelector(".ticket__start").innerHTML = selectSeanse.seanceTime;  
  
  let date = new Date(Number(selectSeanse.seanceTimeStamp * 1000));
  let dateForm = date.toLocaleDateString("ru-RU", {                                   //Формат даты Day:Month:Year
    day: "2-digit", 
    month: "2-digit", 
    year: "numeric" 
  });         
  let textQR =`Фильм: ${selectSeanse.filmName} Зал: ${selectSeanse.hallName} Ряд/Место ${places} Дата: ${dateForm} Начало сеанса: ${selectSeanse.seanceTime} Билет действителен строго на свой сеанс`;  //Данные для QR-кода

  let qrcode = QRCreator(textQR, { image: "SVG"	});             // Создаем QR-код 
  document.querySelector(".ticket__info-qr").append(qrcode.result);
  qrcode.download();                   //Скачиваем QR-код
});  