const fs = require('fs');
const path = require('path');
const { DATA_PATH, ORDERS_PATH } = require('./config');

/** Отображение регионов: номер -> регион */
let REGIONS = new Map();

/**
 * Загрузка данных о товарах из хранилища в программу
 * @throws {Error} - ошибка парсинга файла
 * @returns {Array<Object>} массив товаров годных к работе
 */
function loadData() {
  try {
    const productsJson = fs.readFileSync(DATA_PATH, 'utf8');
    const products = JSON.parse(productsJson);

    const regionsSet = new Set();
    products.forEach(p => {
      if (p.prices && typeof p.prices === 'object') {
        Object.keys(p.prices).forEach(k => regionsSet.add(k));
      }
    });

    REGIONS.clear();
    Array.from(regionsSet).forEach((value, index) => {
      REGIONS.set(index, value);
    });

    return products;
  } catch (err) {
    console.error('ОШИБКА загрузки данных:', err.message);
    process.exit(1);
  }
}

/**
 * Возвращает товары, доступные в данном регионе
 * @param {Array<Object>} products - все товары
 * @param {string} region - регион
 * @returns {Array<Object>} отфильтрованный массив регионов по региону
 */

function getProductsForRegion(products, region) {
  return products.filter(p => Object.keys(p.prices).includes(region));
}

/**
 * Возвращает товары указанной категории
 * @param {Array<Object>} products - все товары
 * @param {string} category - категория
 * @returns {Array<Object>} отфильтрованная коллекция товаров по категории
 */

function getProductsOfCategory(products, category) {
  return products.filter(p => p.category === category);
}

/**
 * Находит самый дешёвый товар в заданной категории для указанного региона
 * @param {Array<Object>} products - коллекция товаров для фильтрации
 * @param {string} category - категория
 * @param {string} region - регион покупки
 * @returns {Object|null} самый дешёвый товар или null, если товаров в категории нет
 */

function getCheapestInCategory(products, category, price, region) {
  const productsInCategory = products.filter(p => p.category === category);
  if (productsInCategory.length === 0) return null;
  return productsInCategory.reduce((min, p) => {
    const price = p.prices[region];
    return price < min.prices[region] ? p : min;
  });
}

/**
 * сохраняет объект заказа в JSON-файл в папку ORDERS_PATH
 * @param {Object} order - объект заказа (содержит product_id, region, name, category, price, timeStamp)
 */

function createOrderFile(order) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const orderFile = path.join(ORDERS_PATH, `order_${timestamp}.json`);

  try {
    fs.writeFileSync(orderFile, JSON.stringify(order, null, 2), 'utf8');
    console.log(`\nЗаявка успешно сохранена в файл: ${orderFile}`);
    console.log('Содержание заявки:');
    console.log(JSON.stringify(order, null, 2));
  } catch (err) {
    console.error('Ошибка сохранения заявки:', err.message);
  }
}

/**
 * формирует финальный объект заказа на основе вариативности выбора пользователя
 * @param {Object} cheapestProduct - самый дешёвый товар в категории в данном регионе
 * @param {Object} chosenProduct - товар
 * @param {string} region - регион
 * @returns {Object} объект заказа с полями product_id, region, name, category, price, timeStamp
 */

function getFinalOrderInCheapest(cheapestProduct, chosenProduct, region) {
  let finalProduct;
  let finalSum;
  if (chosenProduct === cheapestProduct) {
    finalSum = Number(chosenProduct.prices[region]) * 0.95;
    finalProduct = chosenProduct;
  } else {
    finalSum = cheapestProduct.prices[region];
    finalProduct = cheapestProduct;
  }
  return {
    product_id: finalProduct.id,
    region: region,
    name: finalProduct.name,
    category: finalProduct.category,
    price: finalSum,
    timeStamp: new Date().toISOString()
  };
}

module.exports = {
  REGIONS,   // ← это важно
  loadData,
  getProductsForRegion,
  getProductsOfCategory,
  getCheapestInCategory,
  createOrderFile,
  getFinalOrderInCheapest
};