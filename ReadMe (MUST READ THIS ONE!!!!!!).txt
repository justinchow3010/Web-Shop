Please enusure Node.js is installed.
Please do not use Edge or IE to open the web.

Run "npm start" in the terminal in this directory in order to start the website.

Basic Structure:
I used React.js, Bootstrap in this project.
All pages realted files are located in src folder.
Under src folder:
---src
------assets (used to store images or any kinds of media)
------components (all components stored)
------------layout (the main layout of this web)
------------partials (the component which doesn't show up in every page)
------css (style sheets)
------sass (style sheets)
------backend
------------admin.js(admin panel)

For Assignment 1,
I used SCSS (a CSS preproccessor, an extension of CSS3) instead of CSS as it is more user-friendly. But you can still find the related style sheets for CSS under the CSS folder.

I used shoes category as the main page. (updated)

This row number of list of product will change wil it shrink to mobile size.

The hierarchical navigation menu is built dynamically which is under the BreadCrumb component. The active page will be shown as de-active in the nav menu.

Please contact me if any problems arise.

For Assignment 2,

I create the admin panel in admin.js. And I create html request with axios.

Axios will send request to category.php and prodct.php located in var/www/html/admin/.

Product_page.js and product.js will fetch data from the databse.

The database is called "backend" with categories and products table.

The images are stored in the database as BLOB format.

The breadcrumb is currently under development for dynamic naming, as it is not listed in the pharse two requirement, I will finsih it in the future. (DONE!!! UPDATED!!!)

In the Admin Panel. we have ADD, UPDATE and DELETE functions. It is a must to fill in ALL REQUIRED information into the input field in this stage.

For 2A,

I configure all the corresponding filed and should be working as needed. Regarding "Disable directory index in Apache", I have already configure " Options -Indexes +FollowSymLinks" and the users cannot access the folders.
However, the router has taken it as a link and I lead it to a not found page. For example like, /admin ,a folder in var/www/html, it will show not found in the page which will show "......".


For Assignment 3,

Instead of AJAX, I used axios which is a promise based HTTP client request. It also serves asynchronous effect. All the shopping cart relavent code is placed in the shopping_cart.js. The pid and quantity is stored in the localstorage as "pid" and "quan" for convenience.


For Assignment 4,
To maintain the login session, I used cookies here but not PHP session. To protect against CSRF, I used to default XSRF feature in axios as I use axios for all of my request.
To protect against XSS, I used htmlspecialchars() in PHP.
TO protect against PHP injection, I used prepared statements in PHP.

Please contact me if any problems or questions arise.

**************************************************************************************************
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
