# GREEN-API Demo

Тестовое задание: HTML-страница с вызовами методов GREEN-API.

## Описание

Одностраничное приложение для вызова методов GREEN-API:

- **getSettings** — получение настроек инстанса
- **getStateInstance** — получение состояния инстанса
- **sendMessage** — отправка текстового сообщения
- **sendFileByUrl** — отправка файла по ссылке

Параметры подключения: **idInstance** и **ApiTokenInstance** (из [личного кабинета GREEN-API](https://console.green-api.com/)).

## Перед началом

1. Зарегистрируйтесь в [GREEN-API](https://console.green-api.com/auth) и создайте инстанс на бесплатном аккаунте разработчика.
2. Отсканируйте QR-код в личном кабинете, чтобы привязать номер WhatsApp к инстансу.
3. Скопируйте **idInstance** и **ApiTokenInstance** из личного кабинета.

Подробнее: [Перед началом работы — GREEN-API](https://green-api.com/docs/before-start/#parameters).

## Запуск локально

- Откройте `index.html` в браузере или
- Поднимите статический сервер в папке проекта, например:
  - `npx serve .`
  - `python3 -m http.server 8080` (затем откройте http://localhost:8080)

## Как пользоваться

1. Введите **idInstance** и **ApiTokenInstance** (и **apiUrl**, если он отличается от значения по умолчанию).
2. Нажмите **getSettings** или **getStateInstance**, чтобы проверить подключение.
3. Для **sendMessage**: заполните **chatId** (например, `79876543210@c.us`) и **message**, затем нажмите **sendMessage**.
4. Для **sendFileByUrl**: заполните **chatId**, **urlFile**, **fileName** (и при необходимости **caption**), затем нажмите **sendFileByUrl**.
5. Ответ каждого метода отображается в поле только для чтения **Response**.
