#Web Services Development Assignment - API for a sensor-based occupancy detection system for a child seat in a vehicle

--- Purpose of API ---
This project provides an API for the back-end required for my 4th year project. 
The 4th year project is a child detection system which can monitor the presence of a child while in a car seat. 
The system will consist of a mobile application, a web application, a back-end database and a sensor component  (device) which will relay data to the mobile device. 
The mobile application will be used by the parents/care-givers and will connect to the sensor component. 
On entering the vehicle the mobile app will connect to the sensor module. 
The user can monitor the sensor data via the app, i.e., how hot or cold it is in the vicinity of the car seat or if the child is still secure on their car seat. 
The user will receive a notification if they move out of range of the sensor component while the sensor module detects the presence of a child. 
The web application will be used by authorised users to remotely monitor the state of a sensor device during a journey. 
The purpose of the system is to provide parents and guardians with information regarding the comfort and safety of the child in their care. 

--- Brief Description of API ---
This API will provide the middleware which will allow users of the mobile application and the web application to access the mongodb back-end.
For this assignment the mongo database will have the following collection structure:

USER COLLECTION
fName
lName
streetAddress1
streetAddress2
townCity
countryState
email
dateOfBirth
userName
password
admin

DEVICE COLLECTION
deviceName
minTempWarning
maxTempWarning
minutesToWaitBeforeSecondaryAlert
minutesAllowedForJourneyPause
registeredOwner    (USER userName)   

JOURNEY (sub-document of DEVICE COLLECTION)
initiator (USER userName)  
startDateTime
finishDateTime
journeyState
																		
As can be seen from the above collection structure there are 2 main collections: USER & DEVICE. Within DEVICE there is a sub-document of type JOURNEY. 
A device will have one and only one registered owner, which relates to an existing user. 
Each device can contain many journeys. Each Journey will have an initiator property relating to an existing user.

--- Routing Structure ---
The routing structure of the api is as follows:
--------------------------------------
USER - root URL = '/api/user'
--------------------------------------
Get all users: (GET) '/'

Get a user: (GET) '/:userId'

Add a user: (POST) '/'                 
NOTE: This route is used to authenticate an existing user (by providing userName and passowrd values) by returning a JWT token and is also used to register a new user. 
The user of a query parameter (action) is used to determine whether its a registration task or an authentication task.

Update a user: (PUT) '/ :userId'

Delete a user: (DELETE) '/:userId'

--------------------------------------
DEVICE - root URL = '/api/device'
--------------------------------------
Get all devices: (GET) '/'

Get a device: (GET) '/:deviceId'

Add a device: (POST) '/'

Update a device: (PUT) '/:deviceId'   
NOTE: this route/function wil not allow the updating of the registeredOwner property or journey sub-documents as other routes/functions are used for this.

Delete a device: (DELETE) '/:deviceId'

Register a user as the owner of a device: (PUT) '/:deviceId/registeredOwner'    
NOTE: An update of this value will not be executed if the value does not correspond to an existing user's userName in the USER collection.

Get a registered owner (user) of a device: (GET) '/:deviceId/registeredOwner' 

Create a journey: (POST) '/:deviceId/journey'    
NOTE: The creation of this object will not be executed if the value of the initiator property does not correspond to an existing user's userName in the USER collection.

Get all journeys in a device: (GET) '/:deviceId/journey'

Get a journey in a device: (GET) '/:deviceId/journey/:journeyId'

Update a journey in a device: (PUT) '/:deviceId/journey/:journeyId'


--- Conditional Authentication ---
Json web tokens have been used to provide authentication for users. Authentication is performed through the "Add a User: (POST) '/'" route.
The 'passport' node package is used to perform authentication on routes based on a number of criteria. The criteria are: the http request method, the URL parameters and the owner of the token.
Through this, I was able to perform some conditional authentication. These conditions are highlighted in the '--- Testing ---' section below.



--- Some Notes On Security and Validation ---

Some basic validation is performed on the email property within a user object when writes are performed. 
If a value does not conform to an email format (determined by the use of a regular expression) a validation error is thrown.
Also, passwords are encrypted first then stored in the password value of the USER object. This is done through the use of the 'bcrypt' node package and the mongoose 'pre-save' middleware function.


--- The Use of a Remote Database ---
For this API project mlab was used to host the mongo database. The mongoose node module was used as the mongodb driver.


--- Testing ---
The 'supertest','Mocha','Mochawesome' and 'Should' node packages were implemented in order to provide the API with unit testing functionality.
A total of 33 unit tests were developed mainly to test the conditional authentication functionality.
Because of time constraints, I was not able to develop tests for the business logic 
(for example,a test to ensure the appropriate response is given when an attempt to register (on a device) an owner that does not exist is made)
or tests for ensuring that the data returned is the appropraite data, structured appropriately and in the right format.

A list of the tests that are run are as follows:
--------------------------------------
USER TESTS
--------------------------------------
should NOT register a user 
should register a user 
should NOT authenticate a user (a non-existing user)
should authenticate a user 
should NOT get all users without valid token
should get all users with valid token
should NOT get a specific user (barry101) with admin (adam101) token
should get a specific user (barry101) with admin (adam101) token
should NOT modify a specific user (barry101) without a token
should modify a specific user (barry101) with admin (adam101) token
should NOT modify a specific user (barry101) with another users (danny101: non-admin) token
should modify a specific user (barry101) with the users (barry101: non-admin) token
should NOT delete a specific user (adam101) without admin token
should delete a specific user (adam101) with admin (adam101) token
should NOT delete a specific user (barry101) with another users danny101) token
should delete a specific user with the users token
--------------------------------------
Device tests
--------------------------------------
should NOT get all devices without valid token
should get all devices with admin (Claire101) token
should NOT get a specific device (device0001) without valid token
should get a specific device (device0001) with admin (Claire101) token
should NOT create a device (device0003) without valid token
should create a device (device0003) with admin (Claire101) token
should NOT modify a device (device0003) without valid token
should modify a device (device0003) with admin (Claire101) token
should NOT modify a device (device0001) with non-registered owners (eddie101) token
should modify a device (device0001) with registered owners (danny101) token
should NOT modify a journey (journey0001) with non-registered owners (eddie101) token
should modify a journey (journey0001) with registered owners (danny101) token
should NOT register an owner (eddie101) with a device (device0002) without valid token
should register an owner (eddie101) with a device (device0002) with valid token
should NOT delete a device (device0002) without valid token
should NOT delete a device (device0001) with non-admin (danny101) token
should delete a device (device0002) with admin (claire101) token


--- messaging ---
When a new user is registered (created) an email can be sent to the email provided. This is performed through the use of Pubnub and Mailgun. 
Pubnub is a cloud-based publish/subscribe qeueing and messaging system. When a new user is registered, a 'user-created-event' is published (This is performed by calling a function in the events.js file).
There is also a single-file application (mail_app.js) running concurrently on the API which subscribes to the above Pubnub events. 
When such an event is acknowledged an email is generated an sent to the new user (via the Mailgun emailing service).
NOTE: For testing purposes I have hardcoded my student email address in as the reciever's email. In production the user's email address can be used.
Also, While it is not a loosely coupled approach. The mailgun app is executed concurrently with the API. This should be a sperate service run independantly.
But for the sake of demonstation, I have coupled both services here.


--- hosting on Heroku (and developing on Cloud 9) ---
The API was initially developed on a virtual machine running on my laptop. For the second part of the assignment I moved development to the Cloud 9 cloud-based IDE.
I was then able to set up a Heroku-based deployment environment by creating a Heroku account, then creating a new Git remote in the Heroku environment via the Heroku cli and the Git cli.
When modifications were made to the code-base on Cloud 9 a push was made to both the origin remote as well as the new Heroku remote. 
When this happens the code on Heroku is re-built and deployed automatically.

ADDITIONAL INFORMATION REGARDING THE FUNCTIONALITY OF THE API CAN BE FOUND IN THE GITHUB COMMIT MESSAGES.