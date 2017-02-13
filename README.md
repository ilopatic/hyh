I wrote this code for a project for a client that never got off the ground.

My reasoning behind my architecture was to build a two file site with the least dependencies possible. I used JavaScript and 
JQuery for the front end and PHP and MySql for the back. HTML and CCS responsive where used for the interfaces and JSON and AJAX
where used for the data and page builds. For managing form submits I used JQueryForm.js and JQueryValidate.js. The idea was to have as
much of the processing done on the front end as possible. There by speeding up the user experience and minimizing server load.

There are two components to the site, the user interface and admin. Both consist of one file each default.html and admin.html.
From there JavaScript, JQuery and AJAX are used to build pages, fetch data and navigate between pages. All activity is contained within
those files using the above mentioned technologies.

Both components include one key JavaScipt file adminJsHyh.js and JsHyh.js. These files serve as the controller for each component making
page builds, fetching data and navigating between pages. They both have the same structure which I will now explain.

The key object is the framework object. After the initial framework is built the header, footer and navs, the controlling function within
this object is showHideContent().  When this function is called it will either build a new page or navigate to an existing page. Each
page built will have its own object that will manage all aspects of that particular page. The initial page build, the data required and any
functionality needed. When navigating to an existing page it will maintain its previous state.

Each page is actually a div that is either shown or hidden depending on whether you are navigating to or from it. All the data comes 
via AJAX and JSON. The JSON is either built manually as in the case of the navs or it is built dynamically in admin using php to 
generate these files and store them on the server.

Each page/div will have its own html snippets that will be loaded on initial build. From there all functionality is supported by 
JavaScript, JQuery, AJAX and JSON.

This code is incomplete. I am using it as an example of the kind of work I can do when left to my own devices.
