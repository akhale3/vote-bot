'use strict';

const puppeteer = require('puppeteer');
const config = {
  headless: !(process.env.HEADLESS === 'false'),
  url: 'https://canyoumakeit.redbull.com/en/applications/9493/',
  buttonAttribute: 'data-entry-id',
  buttonAttributeValue: '9493',
  buttonClass: 'vote-initiate-trigger',
  username: process.env.TWITTER_USERNAME,
  password: process.env.TWITTER_PASSWORD
};

(async () => {
  // Instantiate Puppeteer
  const browser = await puppeteer.launch({
    headless: config.headless
  });

  const timeout = ms => new Promise(res => setTimeout(res, ms));

  // Navigate to specified URL
  const page = await browser.newPage();
  await page.goto(config.url);

  // Click on 'VOTE FOR THIS TEAM' button
  await page.evaluate(
    (config) => [...document.querySelectorAll(`.${config.buttonClass}`)]
      .forEach(element => {
        if (config.buttonAttributeValue === element.getAttribute(
          config.buttonAttribute
        )) {
          return element.click();
        }
      }), config);

  // Click on 'LOG IN' button
  await page.waitForSelector('.auth-login-redbulluim')
    .then(element => element.click({
      delay: 1000 // Add 1 second of delay buffer for button render
    }));

  // Click on 'Login with Twitter' button
  await page.waitForSelector('#uim-twitter-btn')
    .then(element => element.click({
      delay: 1000 
    }));

  // Log in to Twitter
  await browser.on('targetcreated', async () => {
    const pageList = await browser.pages();
    const newPage = await pageList[pageList.length - 1];

    // HACK: Workaround for https://github.com/GoogleChrome/puppeteer/issues/1229
    await timeout(1000);

    await newPage.type('#username_or_email', config.username, {
      delay: 5
    });

    await newPage.type('#password', config.password, {
      delay: 5
    });

    await newPage.click('#allow', {
      delay: 5
    });
  });

  // Close browser when done
  await browser.on('targetdestroyed', async () => {
    await timeout(2000);

    await browser.close();
  });
})();
