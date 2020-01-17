# GetForm
Created with CodeSandbox

This is a simple app I've made as a first practice using MongoDB in a Node.Js and Express.Js server.

GetForm has 3 html pages:
-index.html: This is the entry point of the application, in here you'll see at the top a navbar for the navigation trough the different pages, and some text's splaining more or less what this app do and it's purpose.

#All the pages have the same navbar.

-signin.html: In this page you'll see a form asking for some user registration info, like name, email, that kind of things. When you submit them, Node will insert them on my MongoDB to store them for future use.

-login.html: On this one, if the user puts his email and his password and the info given is correct it will "login" to the page, which means almost nothing because that's all what this app do.

This app it's just a practice excercice I did to learn MongoDb and it's use on a Node.Js server. 

Here I:
-hash and salt the user password and save the hashed pass and the salt on MongoDB with the rest of the info provided by the user.
-On login I hash and salt the given password using the same salt as the saved password and then I compare bouth hashed passwords to see if they are the same.
-Select of user info with the mail given.
-Insert the users info when they suscribe to the app.

I'll keep adding things to this proyect to practice more CRUD operations with MongoDB.

