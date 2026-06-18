const { MAXLEN_ID, MAXLEN_NAME, MAXLEN_PRICE, MAXLEN_CATEGORY } = require('./config');

/**
 * Выводит одну строку таблицы с информацией о товаре для указанного региона в требуемом формате
 * @param {Object} p - товар
 * @param {string} region - регион покупки
 */

function printProductInfo(p, region) {
  let idDashesLen = MAXLEN_ID - String(p.id).length;
  let nameDashesLen = MAXLEN_NAME - String(p.name).length;
  let categoryDashesLen = MAXLEN_CATEGORY - String(p.category).length;
  let priceDashesLen = MAXLEN_PRICE - String(p.prices[region]).length;
  console.log('|', p.id, ' '.repeat(idDashesLen), '|', p.name, ' '.repeat(nameDashesLen), '|', p.category, ' '.repeat(categoryDashesLen), '|', p.prices[region], ' '.repeat(priceDashesLen), '|');
}

/**
 * Выводит таблицу со списком товаров и ценами для заданного региона
 * @param {Array<Object>} products - набор товаров
 * @param {string} region - регион покупки
 */

function printProductListRegion(products, region) {
  console.log('|', ' '.repeat(4), 'id', ' '.repeat(3), '|', ' '.repeat(13), 'Наименование', ' '.repeat(14), '|', ' '.repeat(6), 'Категория', ' '.repeat(4), '|', ' '.repeat(5), 'Цена', ' '.repeat(4), '|');
  console.log('='.repeat(MAXLEN_ID + MAXLEN_NAME + MAXLEN_CATEGORY + MAXLEN_PRICE + 17));
  products.forEach(p => {
    printProductInfo(p, region);
  });
  console.log('='.repeat(MAXLEN_ID + MAXLEN_NAME + MAXLEN_CATEGORY + MAXLEN_PRICE + 17));
}

/**
 * Выводит страницу выбора товара в заданном регионе
 * 
 * @param {Array<Object>} products - набор товароы
 * @param {string} region - регион покупки
 */

function showProductSelectingPage(productInRegion, region) {
  console.log('==============');
  console.log('#Выбор товара#');
  console.log('==============');
  console.log();
  console.log('Товары в регионе: ', region);
  printProductListRegion(productInRegion, region);
}

/**
 * Выводит запись с выбрынным товаром
 * @param {Object} chosenProduct - выбранный товар
 * @param {string} region - регион покупки
 */

function showSelectedProductPage(chosenProduct, region) {
  console.log('Выбран товар:');
  console.log();
  printProductListRegion([chosenProduct], region);
  console.log();
}

/**
 * Отображает страницу выбора региона со списком доступных регионов
 * @param {Map<number, string} regionsMap - отображение доступных регионов
 */

function showRegionSelectingPage(regionsMap) {
  console.log('===============');
  console.log('#Выбор региона#');
  console.log('===============');
  console.log();
  console.log('Доступные регионы: ');
  if (!regionsMap || regionsMap.size === 0) {
    console.log('  (нет доступных регионов)');
    return;
  }
  regionsMap.forEach((value, key) => {
    console.log(`  ${key} -> ${value}`);
  });
}

/**
 * Отображает шапку с названием приложения
 */

function showMainPage() {
  console.log('=============================================');
  console.log('#Программа создания заявки на закупку товара#');
  console.log('=============================================');
  console.log();
}

/**
 * Отображает страницу с вариантами по действию пользователя: выбрать самый дешёвый или получить скидку
 * 
 * @param {Array<Object>} cheaperProducts - массив из дешёвого товара (костыль для метода печати)
 * @param {boolean} chosenEqualsCheapest - данный товар самый дешёвый
 * @param {number} chosenPrice - цена выбранного товара
 * @param {number} analogSum - предлагаемая цена (со скидкой или цена аналога)
 * @param {string} region - регион покупки
 */

function showCheapestProductsPage(cheaperProducts, chosenEqualsCheapest, chosenPrice, analogSum, region) {
  console.log();
  console.log('Вы уверены что не хотите создать заявку?');
  if (chosenEqualsCheapest) {
    console.log('Это самый дешёвый товар в своей категории, можем предложить для него скидку в 5%');
    console.log(`Цена составит: ${analogSum} вместо ${chosenPrice}`);
  } else {
    console.log('Мы можем заменить товар на самый дешёвый и создать заявку:');
    console.log(`Цена составит: ${analogSum} вместо ${chosenPrice}`);
    printProductListRegion(cheaperProducts, region);
  }
}

module.exports = {
  printProductInfo,
  printProductListRegion,
  showProductSelectingPage,
  showSelectedProductPage,
  showRegionSelectingPage,
  showMainPage,
  showCheapestProductsPage
};