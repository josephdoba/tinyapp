# Tinyapp - URL Shortner Web app

## Purpose:
Allows users to create an account, create lists of URLs to become short, and share with others. This project was created and published by myself, as part of my education at Lighthouse Labs.

!["My URLs"](https://github.com/josephdoba/tinyapp/blob/main/docs/myUrls_page.png)
!["Update URLs"](https://github.com/josephdoba/tinyapp/tree/main/docs/myUrls_update_page.png)


**Caution: This Application is educational, and is prone to vulnerabilities. It is not intended for major or commercial productions.**

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Usage:

- Once you run the app using `node express_server.js`, you can navigate to `localhost:8080/register` in your browser. Once here, sign up with a username and password, and you can start adding URLs to shorten by following the navigation buttons.

## Known bugs, limitations, and quirks:

- The web app itself only works locally, however the redirects themselves do work.
- There is no home page. After running the app, you will need go to `localhost:8080/login` or `localhost:8080/register`.
- The Urls must include `http://` for the redirects to work.
- During Mocha Chai testing, `npm test` currently does not work on an M1 device. Instead, navigate to the test folder and run the command `mocha` to run the `helpersTest.js` file.
- In the My URLs page, you can click on the short url link directly to redirect to that page.