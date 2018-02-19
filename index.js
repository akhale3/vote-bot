'use strict';

const puppeteer = require('puppeteer');
const assert = require('assert');
const users = require('./users');
const HEADLESS = !(process.env.HEADLESS === 'false');

async function init(config) {
  // Validate config
  assert.ok(config.username, 'config.username is required');
  assert.ok(config.password, 'config.password is required');

  // Instantiate Puppeteer
  const browser = await puppeteer.launch({
    headless: HEADLESS 
  });

  const timeout = ms => new Promise(res => setTimeout(res, ms));

  // Navigate to specified URL
  const page = await browser.newPage();
  await page.goto('https://canyoumakeit.redbull.com/en/applications/9493/');

  // Click on 'VOTE FOR THIS TEAM' button
  await page.evaluate(
    (config) => [...document.querySelectorAll('.vote-initiate-trigger')]
      .forEach(element => {
        if ('9493' === element.getAttribute('data-entry-id')) {
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
};

// Let it rip!
(async () => {
  users.forEach(user => init(user));
})();
