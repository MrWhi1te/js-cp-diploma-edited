let selectSeanse = JSON.parse(sessionStorage.selectSeanse);										// Получение информации из локального хранилища
let places = "";
let price = 0;

selectSeanse.salesPlaces.forEach((element) => {												
	if (places) {
		places += ", ";
	};
	places += `${element.row}/${element.place}`;															// Добавляем номер ряда и номер места в информацию
	price += element.type === "standart" 													// Получаем стоимость выбранных мест.
		? Number(selectSeanse.priceStandart) 
		: Number(selectSeanse.priceVip); 		
});

document.querySelector(".ticket__title").innerHTML = selectSeanse.filmName;
document.querySelector(".ticket__chairs").innerHTML = places;
document.querySelector(".ticket__hall").innerHTML = selectSeanse.hallName;
document.querySelector(".ticket__start").innerHTML = selectSeanse.seanceTime;
document.querySelector(".ticket__cost").innerHTML = price;

let Config = selectSeanse.hallConfig.replace(/selected/g, "taken");
document.getElementById("acceptin-button").addEventListener("click", function(event){
	event.preventDefault();
	let dataRequest = `event=sale_add&timestamp=${selectSeanse.seanceTimeStamp}&hallId=${selectSeanse.hallId}&seanceId=${selectSeanse.seanceId}&hallConfiguration=${Config}`;
	request(dataRequest, ()=> {
		window.location.href='ticket.html'; 								// Переход на страницу билета
	});
});