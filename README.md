#firebase - Demo

This is a small (tiny) demo app intended to demonstrate the simplicity of accessing a firebase database from a web app.

The app has a few prerequisites, some of which are currently under development so there may be some effort required before the app will build and run mostly due to *_angular2_*, *_ionic_* and *_typescript_*.

The app has been built using the *_Ionic_* framework, and you will need *_ionic 2_* installed. The version used to develop this demo was _2.0.0-beta.31_

You may also need the latest *_typescript_* compiler to support features of *_angular2_* and *_angularfire2_*.

##To install ionic:

`> npm install -g ionic@beta`

you will also need to install the bolt compiler (this compiles the bolt schema definition to json rules)

`> npm install -g firebase-bolt`

once installed the remainder of the dependencies can be installed as usual from the project root

`> npm install`

and then

`> typings install`

I have used webstorm to develop the app, and any subsequent comments about building and development environment apply to that toolset, however I am assured that the app builds and runs independently of webstorm...

You will also need to create a firebase database instance, this fairly simple, go to https://firebase.google.com/ create a new account (if you dont already have one) and then from the console 'CREATE A NEW PROJECT'

The app as it stands will connect to my database instance, and whilst this will probably work, it is not going to provide any great insight into firebase development, and is also not guaranteed to be around.

In your new 'project', you will need to make a few settings.

##Authentication

Under 'Auth' from the left hand menu - select 'SIGN IN METHOD', and select Email/Password. You can change this if you like but you will need to make changes to the app to be compatible.

Then on the right hand side hit the 'WEB SETUP' button. This will generate a snippet of code you will need to bootstrap into angular to access your firebase instance. Mine looks like this:

```html
<script src="https://www.gstatic.com/firebasejs/3.1.0/firebase.js"></script>
<script>
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDRC967G6VYdiZLjOgLh6l6fabmDk_k9WI",
    authDomain: "mydodgyapp.firebaseapp.com",
    databaseURL: "https://mydodgyapp.firebaseio.com",
    storageBucket: "mydodgyapp.appspot.com",
  };
  firebase.initializeApp(config);
</script>
```

You are only interested in the json config object, the rest is not required.

Now you can take the config object and add it to the app.ts (app/app.ts) in

```javascript
ionicBootstrap(
    MyApp,
    [
        FIREBASE_PROVIDERS,
        defaultFirebase(
        // Initialize Firebase - need to copy this from the firebase console 'WEB SETUP'
        {
            apiKey: "AIzaSyDRC967G6VYdiZLjOgLh6l6fabmDk_k9WI",
            authDomain: "mydodgyapp.firebaseapp.com",
            databaseURL: "https://mydodgyapp.firebaseio.com",
            storageBucket: "mydodgyapp.appspot.com"
        }
        ),
        firebaseAuthConfig(
            {
                provider: AuthProviders.Password,
                method: AuthMethods.Password,
                remember: 'default',
                scope: ['email']
            }
        )
    ]
);
```

where your config json will replace the content of the `defaultFirebase` call.

Now you will need to compile the schema json from the bolt rules, so from the project root

`> firebase-bolt dodgy-rules`

this will build the *dodgy-rules.json*, that you need to apply to your database instance.

So go back to the *_firebase console_* and got to _'Database'_, and select _'RULES'_, then copy and paste the compiled rules json (as text) in to the page and _'PUBLISH'_

Your database now has some substance to it...

Now go to the _'Storage'_ page _'RULES'_. In this case simply ensure the rules look similar to the content of the *dodgy-storage-rules.txt* file... The default is all you will need initially.


With that done you should be good to go...

##To start the app

`> ionic serve`

This will bundle the app and then serve to your browser (check the ionic documentation to serve it to a mobile, etc.)

The first thing you will need to do is create a new user, so instead of logging in - go to _'New User...'_ provide something that looks like a valid email, and a password.

You should land at a tabbed page, which will have a single button _'Add Image...'_ - do that.

This will take you to a new page where you can add some stuff about your image, and then drag and drop an image into the drop zone and hit the _'Save'_ button.

This will then spin its wheels for a while, and eventually you will land back on the home page, and you will have a list of one image, that should (again eventually) show you the image you just saved.

You can then edit or delete the image...

Or add new images. That is the full extent of the functionality. The other tabs still contain the default rubbish ionic put into a new tabbed project.

The interesting parts in the code are in the login/create user code (*app/login/login-page.ts* and *app/login/new-user/new-user-page.ts*) which will show you how to handle user authentication, and */app/services/image/image.ts*, which is where the database access code lives.

##AngularFire2

This is the API used (there are a number to choose from, ...experiment). It is at the bleeding edge of *_angular2_*, so you may need to update some packages to get things working...

Currently this API only works with authentication and database objects, storage is accessed though a different API provided by *_firebase3_* (which will already be installed).

This is an *observable* based API, which plays very nicely with *_angular2_*s `async` piping. This is a major change from *_angularfire(1)_* which was mainly promise based, and took me a little time to get used to, you may want to do a little research on the observable pattern (Ben Lesh has some nice things to say).

In _app/services/image/image.ts_, you will find the code that loads the list of images from firebase, see `loadFromDatabase`.

This starts with a database path (the nosql way) and creates a reference to the list of stuff at that path using the injected *angularFire* object - `angularFire.database.list(...)`

This will return an observable which is returned by the function, and is subsequently observed by the angular `async` pipe in the enclosing template (*app/home-page/home-page.html*).

Once an observer starts observing the result *_angularfire2_* will start reading data from the database. The path pointed to by the observable has a dynamic section _{imageId}_, and firebase will iterate over any underlying nodes recursing each until all data is returned. In this case this is what we want but you do need to be careful what you wish for...

Internally we map the list provided by `angularFire` into a list of image objects, taking along the `$key` (the last part of the objects path) so we can rebuild the path at some stage in the future, to which we append any data we find in the image storage path. This is where we have to start using the non-observable API from the global storage object imported above...

The storage API is old school... and returns a promise, so we wrap this in an observable and set the relevant member of our image object. This can then be `async` piped in the template...

So the list of observable images (no pun intended) is then provided to the client, which in this case is the template, and it will populate the DOM as images arrive from the database.

As the result is an observable, *_angular2_* will continue to observe the results and therefore react to any changes notified by firebase. Under the covers the *_angularfire_* observable is 'watching' the database data for any changes, and will automagically update the list in response.

Firebase provide a subscription notification service on any path in the database, and if that data changes, an event (a callback in the old money), will be fired and your observable will then pass on the change to any subscribed observers. And ultimately the DOM will be updated...

So far so good...

###Now we want to add a new image to our photo album.

The `saveToDatabase` method on the image object is used. Just to be contrary this returns a promise... This is mainly due to the storage API, but also it doesnt really matter as we dont need an observable. Adding a new image will ultimately trigger a change to the already observed list of images and update the DOM.

The key points here are, we generate a new imageId that will form part of the path to the image in the database and the storage, the storage object is stored first, and then the databsase object (otherwise the list obserable will start trying to access the storage before it exists).

Then we just let the edit page wait on completion before navigating back to the home page.

Back in the home page the list observable will get notification of the new image and update the DOM. Note that the image will be sorted into the list based on the `$key` (or imageId) value, which may not be the best...

###So now we might edit an image in the list...

Back to the same form to add an image, but this time prefilled with the image data (not observable). In the background we want to know what fields the user has updated so we can ensure we only update these to the database. There are no doubt better methods to do this, but the one employed works, and it simply traps any changes using a set method, and adds that field to a list of updated fields.

Then when we come to perform the update we can use the update API, generating a new json object with only the updated fields and the updated date. If we were to use the set API firebase will nuke and pave the data at the path. Maybe thats what we want, but mayber thats not what we want. If there is other data on this node, it will all be destroyed by the set, unless we have explicitly added it to the set data. Better to update.

####A short word about time stamping.

You can set time fields in your data (in this case the updated and created fields) to a `serverValue.TIMESTAMP` object, which will then be filled on the database side with the UTC time when the data arrived.This makes time setting between devices easier to sychronise, but has further advantages in database validation.

A field that has been set using the `serverValue.TIMESTAMP` object can then be compared to now in the validation rules in your schema, providing the opportunity to ensure data consistency. It is however not exported by *_angularfire2_*, and has to be accessed somewhat dodgily through the database object from _firebsase3_. I guess this is a work in progress.

###And then delete...

So in this schema images dont get deleted - they get moved from active to deleted. Maybe in future there might be a purge function added? Nonetheless, the act of moving the object from one place to another demonstrates all the salient features of firebase delete.

The `deleteInDatabase` method first builds the path to the image to be deleted, and removes it from the database - note as with set, this will remove everything below that node in the path. Then it simply sets the data into the deleted path, and again anything that might have been there already will be destroyed.

The storage object is left where it is...

##Error handling...

Be my guest. Obviously if we were doing this for real we need to handle the case when things dont go according to plan... observables lend themselves very nicely to this.

You should be prepared to see a lot of permission denied errors when you are developing against a new schema...

##Unit testing...

See error handling. Again would have added this but *_angular_* are dropping *_jasmine_* in favour of ... and life is too short. As far as I know there are no published firebase mocks. In our little start up project one of my colleagues developed a mock for the angularfire1 API, but thats no use here.

There are a range of possibilities, you can simply test against a live database, there are no limits to the number databases you can have in firebase, so just bootstrap your tests to a different instance and go for it.

You can also use a local firebase server - I havent tried this, but it is probably the best way to go, so long as they maintain it... and I dont know if it supports storage, although that would be simpler to mock out.

So there you have it - a firebase photo album - basta.

###Some footnotes...

1.`database.list` - this is not specific to lists in the database, it returns anything at the path its pointed at as a list of data, so it needs to be properly targetted...

2.Arrays - you can describe data at a path as an array, but... its not likely to be the array you are expecting. The array index will in general be generated by firebase, so wont follow the typical array indexing pattern (0, 1, 2, 3...), meaning that indexing the array probably wont work. The exception to this is data that can be provided to firebase as a complete array. In this case the original indexing will be preserved and the returned array will behave as expected. Given that the new angularfire2 API has no direct support for arrays I think firebase find this pattern as useless as I have found it.

3.Any - can be used to describe data in the bolt schema, but I have had no success getting it to work. For 'any' data I have used strings. There is no limit to size of string fields in the database, and it just works. Clearly if you know the type then you should use it in the schema...








