#Web Services Development Assignment - API for a sensor-based occupancy detection system for a child seat in a vehicle

--- Purpose of API ---
This project provides an API for the back-end required for my 4th year project. The 4th year project is a child detection system which can monitor the presence of a child while in a car seat. The system will consist of a mobile application, a web application, a back-end database and a sensor component  (device) which will relay data to the mobile device. The mobile application will be used by the parents/care-givers and will connect to the sensor component. On entering the vehicle the mobile app will connect to the sensor module. The user can monitor the sensor data via the app, i.e., how hot or cold it is in the vicinity of the car seat or if the child is still secure on their car seat. The user will receive a notification if they move out of range of the sensor component while the sensor module detects the presence of a child. The web application will be used by authorised users to remotely monitor the state of a sensor device during a journey. The purpose of the system is to provide parents and guardians with information regarding the comfort and safety of the child in their care. 

--- Brief Description of API ---
This API will provide the middleware which will allow users of the mobile application and the web application to access the mongodb back-end.
For this assignment the mongo database will have the following collection structure:

//////////////////////////////////////////////////////////////////|          //////////////////////////////////////////////////////////////////////////////////////////|
|                       USER DOC                         |          |                                 DEVICE DOC                                    |
|    |/////////////////////////////////////////////////////|       |          |    |/////////////////////////////////////////////////////////////////////////////|       | 
|    |                     USER                       |       |          |    |                               DEVICE                                  |       |   
|    |   fName                                        |       |          |    |      deviceName                                                   |       | 
|    |   Name                                         |       |          |    |      minTempWarning                                            |       | 
|    |   streetAddress1                         |       |          |    |      maxTempWarning                                          |       | 
|    |   streetAddress2                         |       |          |    |      minutesToWaitBeforeSecondaryAlert           |       | 
|    |   townCity                                    |       |          |    |      minutesAllowedForJourneyPause                 |       | 
|    |   countryState                              |       |          |    |       registeredOwner    (USER _id)                     |       | 
|    |   email                                           |       |          |    |                                                                             |       | 
|    |   userName                                  |       |          |    |        /////////////////////////////////////////////////////////////         |       | 
|    |   dateOfBirth                                |       |          |    |        |                     JOURNEY                       |         |       | 
|    |   hashedPassword                      |       |          |    |        |     initiator (USER _id)                         |         |       | 
|    |   salt                                             |       |          |    |        |     startDateTime                                |          |      | 
|    |   salt                                             |       |          |    |        |     finishDateTime                               |          |      | 
|    |                                                     |       |          |    |         |      journeyState                                 |         |       | 
|    |/////////////////////////////////////////////////////        |          |    |         |///////////////////////////////////////////////////////////|         |       |   
|                                                                 |           |    |                                                                              |       | 
|/////////////////////////////////////////////////////////////////|           |    |//////////////////////////////////////////////////////////////////////////////|       |
                                                                             |                                                                                           |
																	 		 |///////////////////////////////////////////////////////////////////////////////////////////|
																		
As can be seenfrom the above collection structure there are 2 main collections: USER & DEVICE. Within DEVICE there is a sub-document of type JOURNEY. A device will have one and only one registered owner, which relates to an existing user. Each device can contain many journeys. Each Journey will have an initiator property relating to an existing user.

--- Routing Structure ---
The routing structure of the api is as follows:

USER - root URL = '/api/user'
--------------------------------------
Get all users: (GET) '/'
Get a user: (GET) '/:userId'
Add a user: (POST) '/'
Update a user: (PUT) '/:userId'
Delete a user: (DELETE) '/:userId'

DEVICE - root URL = '/api/device'
--------------------------------------
Get all devices: (GET) '/'
Get a device: (GET) '/:deviceId'
Add a device: (POST) '/'
Update a device: (PUT) '/:deviceId'    NOTE: this route/function wil not allow the updating of the registeredOwner property or journey sub-documents as other routes/functions are used for this
Delete a device: (DELETE) '/:deviceId'
Register a user as the owner of a device: (PUT) '/:deviceId/registeredOwner'    NOTE: An update of this value will not be executed if the value does not correspond to an existing user id in the USER collection.
Get a registered owner (user) of a device: (GET) '/:deviceId/registeredOwner' 
Create a journey: (POST) '/:deviceId/journey'    NOTE: The creation of this object will not be executed if the value of the initiator property does not correspond to an existing user id in the USER collection.
Get all journeys in a device: (GET) '/:deviceId/journey'
Get a journey in a device: (GET) '/:deviceId/journey/:journeyId'
Update a journey in a device: (PUT) '/:deviceId/journey/:journeyId'

AUTHENTICATION - root URL = '/api/authenticate'
--------------------------------------
Json web tokens have been used to provide basic authentication for users. Before a resource can be retieved or updated a POST request needs to be sent to the  '/api/authenticate' URL. There are 2 form-urlencoded variables (userName & password) entered into the body. The following is an example of how a user can retrieve an access token. NOTE: when started (or re-started) the API service will remove all data from the database and created 4 default USER objects and 2 default DEVICE objects. One default user has the userName 'adam101' and password 'adamPword'. These credentials can be used to obtain an access token.

userName: adam101
password: adamPword

After retrieving the token the value must be used in an 'x-access-token' header variable for all preceeding transactions.

NOTE: in order for the authentication service to function a variable named 'jwtSecret' is required in the .env file. It can be given any value.

--- Some Notes On Security and Validation ---

Some basic validation is performed on the email property within a user object when writes are performed. If a value does not conform to an email format (determined by the use of a regular expression) a validation error is thrown.
Also, passwords are encrypted first then stored in the hashedPassword value of the USER object. This value is not returned in GET functions. When updating a password a virtual property called 'password' is used. NOTE: if a 'hashedPassword' property is present in the posted object an error will be thrown saying that the 'hashedPassword' property is required. This is because  any property with the name 'hashedPassword' posted in a request body will be deleted. The proper name for the property when updating or creating a user is just 'password'. This property value is then encrypted and stored in the ' hashedPassword' property within the database.


--- The Use of a Remote Database ---
For this API project mlab was used to host the mongo database. The mongoose node module was used as the mongodb driver.

ADDITIONAL INFORMATION REGARDING THE FUNCTIONALITY OF THE API CAN BE FOUND IN THE GITHUB COMMIT MESSAGES.