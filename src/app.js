const {
  loadData,
  REGIONS,
  getProductsForRegion,
  getProductsOfCategory,
  getCheapestInCategory,
  createOrderFile,
  getFinalOrderInCheapest
} = require('./dataManager');

const {
  showMainPage,
  showRegionSelectingPage,
  showProductSelectingPage,
  showSelectedProductPage,
  showCheapestProductsPage
} = require('./ui');

const { ask, sleep, exit, cIO } = require('./utils');

/**
 * Запрашивает у пользователя ID товара и проверяет его корректность
 * @param {Array} productInRegion - список товаров в регионе
 * @param {string} region - регион покупки
 * @returns {Promise<number>} - ID выбранного товара
 */

async function chooseProduct(productInRegion, region) {
  let chosenProductId = Number((await ask('Введите id товара: ')).trim());
  while (!productInRegion.some(p => p.id === chosenProductId) || !Number.isInteger(chosenProductId) || chosenProductId < 0) {
    console.clear();
    showProductSelectingPage(productInRegion, region);
    chosenProductId = Number((await ask('Некорректный id, введите снова: ')).trim());
  }
  return chosenProductId;
}

/**
 * Выполняет последовательность: Загрузка данных -> Выбор региона -> Выбор товара -> Предложение оформить заявку ->
 *                                  -> |-> При отказе – логика удержания (предложение более дешёвого аналога или скидки)
 *                                     |-> При подтверждении – сохранение заявки в JSON-файл и выход.
 * @returns {Promise<void>}
 */

async function main() {
  console.clear();
  showMainPage();

  const allProducts = loadData();

  showRegionSelectingPage(REGIONS); 
  let regionID = Number((await ask(`Выберите регион [0, ${REGIONS.size - 1}]: `)).trim());
  while (!Number.isInteger(regionID) || regionID >= REGIONS.size || regionID < 0) {
    regionID = Number((await ask(`Индекс региона от 0 до ${REGIONS.size - 1}. Введите снова: `)).trim());
  }
  const region = REGIONS.get(Number(regionID));

  const productInRegion = getProductsForRegion(allProducts, region);
  console.clear();
  showProductSelectingPage(productInRegion, region);
  console.log();

  let endOfChoosing = false;
  while (!endOfChoosing) {
    let chosenProductId = await chooseProduct(productInRegion, region);
    let chosenProduct = productInRegion.find(p => p.id === chosenProductId);
    console.clear();
    showProductSelectingPage(productInRegion, region);
    let finalOrder = {
      product_id: chosenProduct.id,
      region: region,
      name: chosenProduct.name,
      category: chosenProduct.category,
      price: chosenProduct.prices[region],
      timeStamp: new Date().toISOString()
    };
    showSelectedProductPage(chosenProduct, region);

    let makeRequest = (await ask('Создать заявку (y/n): ')).trim().toLowerCase();
    while (makeRequest !== 'y' && makeRequest !== 'n') {
      console.clear();
      showProductSelectingPage(productInRegion, region);
      showSelectedProductPage(chosenProduct, region);
      makeRequest = (await ask('Создать заявку (y/n): ')).trim().toLowerCase();
    }

    if (makeRequest.toLowerCase() === 'y') {
      console.clear();
      createOrderFile(finalOrder);
      endOfChoosing = true;
      await exit();
      continue
    } else {
      if (getProductsOfCategory(productInRegion, chosenProduct.category).length < 2) {
        console.log('Это единственный товар в категории, доступный в Вашем городе');
        await exit();
        endOfChoosing = true;
        continue;
      }
      const cheaperProducts = getCheapestInCategory(productInRegion, chosenProduct.category, chosenProduct.prices[region], region);
      finalOrder = getFinalOrderInCheapest(cheaperProducts, chosenProduct, region);

      showCheapestProductsPage(
        [cheaperProducts],
        cheaperProducts === chosenProduct,
        chosenProduct.prices[region],
        finalOrder.price,
        region
      );

      makeRequest = (await ask('Создать заявку (y/n): ')).trim().toLowerCase();
      while (makeRequest !== 'y' && makeRequest !== 'n') {
        console.clear();
        showProductSelectingPage(productInRegion, region);
        showSelectedProductPage(chosenProduct, region);
        showCheapestProductsPage(
          [cheaperProducts],
          cheaperProducts === chosenProduct,
          chosenProduct.prices[region],
          finalOrder.price,
          region
        );
        makeRequest = (await ask('Создать заявку (y/n): ')).trim().toLowerCase();
      }

      if (makeRequest === 'n') {
        await exit();
        endOfChoosing = true;
        continue
      } else {
        console.clear();
        createOrderFile(finalOrder);
        await exit();
        endOfChoosing = true;
        continue
      }
    }
  }
}

main().catch(err => {
  console.error('ОШИБКА: ', err);
  cIO.close();
});
