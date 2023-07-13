function request(data, callback)  //
{   
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://jscp-diplom.netoserver.ru/", true);  //URL-адрес для запроса. Значение true для выполнения асинхронного запроса.
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
    xhr.onload = () => {
        callback(xhr.response);     // Вызов колбека с полученным ответом
      };
    xhr.send(data);
}