const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function example() {
  let options = new chrome.Options();

  // Run headless and disable sandbox for GitHub Actions environment
  options.addArguments(
    '--headless=new',         // use new headless mode (or '--headless' if your chrome version is old)
    '--no-sandbox',           // required for GitHub runners
    '--disable-dev-shm-usage' // overcome limited /dev/shm space
  );

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    await driver.get('https://www.example.com');
    let title = await driver.getTitle();
    console.log('Page title is:', title);
    if (title !== 'Example Domain') {
      throw new Error('Title did not match!');
    }
  } finally {
    await driver.quit();
  }
})();
