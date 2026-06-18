const readline = require('readline');

const cIO = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Метод-обёртка для общения с пользователем через вопросы в консоли
 * @param {string} question - текст вопроса
 * @returns {Promise<string>} - ответ на вопрос от пользователя
 */

function ask(question) {
  return new Promise(resolve => cIO.question(question, resolve));
}

/**
 * Приостанавливает работу программы на время
 * @param {number} ms - длительность приостановки в мс
 * @returns {Promise<void>}
 */

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Осуществляет корректный выход из приложения с закрытием всех ресурсов
 * @returns {Promise<void>}
 */

async function exit() {
  console.log();
  console.log('ВЫХОД');
  await sleep(2000);
  cIO.close();
}

module.exports = { cIO, ask, sleep, exit };