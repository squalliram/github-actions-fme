const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function exampleTest() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('https://example.com');
    let heading = await driver.wait(until.elementLocated(By.css('h1')), 10000);
    console.log('Page heading is:', await heading.getText());
  } finally {
    await driver.quit();
  }
})();
