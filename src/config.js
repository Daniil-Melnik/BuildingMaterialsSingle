/**
 * @file основные элементы конфигурации всего приложения
 * Содержит константы путей, максимальных длин столбцов таблиц
 */

const path = require('path');

/** Путь к файлу с каталогом товаров в формате json*/
const DATA_PATH = path.join(__dirname, '..', 'data', 'products.json');
/** Путь к директории для сохранения заявок */
const ORDERS_PATH = path.join(__dirname, '..', 'orders');
/** Максимальная длина столбца "id" в таблице*/
const MAXLEN_ID = 10;
/** Максимальная длина столбца с наименованием товара */
const MAXLEN_NAME = 40;
/** Максимальная длина столбца с ценой */
const MAXLEN_PRICE = 14;
/** Максимальная длина столбца с категорией товара */
const MAXLEN_CATEGORY = 20;

module.exports = {
  DATA_PATH,
  ORDERS_PATH,
  MAXLEN_ID,
  MAXLEN_NAME,
  MAXLEN_PRICE,
  MAXLEN_CATEGORY
};