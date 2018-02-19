# vote-bot
A Puppeter-based bot to automate the Red Bull 2018 voting process

![vote-bot-parallel](vote-bot-parallel.gif)

## Prerequisites
- node (v8.9.4 LTS)
- npm (v5.6.0)

## Installation
### Step 1: Clone the repository
```
git clone https://github.com/akhale3/vote-bot.git
```

### Step 2: Navigate to the directory
```
cd /path/to/vote-bot
```

### Step 3: Install dependencies
```
npm install
```

## Setup
### Step 1: Setup Twitter users
Each Twitter user is modeled as a `{username:<username>,password:<password>}`
object. Navigate to `users.js` and follow the instructions to replace the test
user objects with your valid ones.

__Note:__ Limit the number of users to less than 10 to avoid CPU throttling

### Step 2: Disable headless mode (Optional)
Headless mode is enabled by default which allows Chromium to run in the background.
To see the actual execution in action, disable headless mode as follows:
```
export HEADLESS=false
```

### Step 3: Register all users manually
Currently, first time login on the Redbull site is not supported by vote-bot.
It is, therefore, required that each user and their email be registered manually
prior to running the bot.

__Note:__ This is a one-time operation.

## Execution
```
npm start
```
