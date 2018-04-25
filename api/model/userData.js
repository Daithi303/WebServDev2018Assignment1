import model from './model.js';

const users = [
    {
  "fName": "Adam",
  "lName": "Andrews",
  "streetAddress1": "1 Adam street",
  "streetAddress2": "Adam Estate",
  "townCity": "Adam Town",
  "countyState": "County Adam",
  "email": "adam@amail.com",
  "userName": "adam101",
  "password": "adamPword",
	"admin": true
},
    {
  "fName": "Barry",
  "lName": "Brown",
  "streetAddress1": "1 Barry street",
  "streetAddress2": "Barry Estate",
  "townCity": "Barry Town",
  "countyState": "County Barry",
  "email": "barry@bmail.com",
  "userName": "barry101",
  "password": "barryPword",
  "admin": false
},
    {
  "fName": "Claire",
  "lName": "Connors",
  "streetAddress1": "1 Claire street",
  "streetAddress2": "Claire Estate",
  "townCity": "Claire Town",
  "countyState": "County Claire",
  "email": "claire@cmail.com",
  "userName": "claire101",
  "password": "clairePword",
	"admin": true
},
    {
  "fName": "Danny",
  "lName": "Devlin",
  "streetAddress1": "1 Danny street",
  "streetAddress2": "Danny Estate",
  "townCity": "Danny Town",
  "countyState": "County Danny",
  "email": "danny@dmail.com",
  "userName": "danny101",
  "password": "dannyPword",
  "admin": false
}
];

export const loadUsers = () => {
  model.User.find({}).remove(() => {
    for(var i = 0;i <users.length;i++){
          const newUser = new model.User(users[i]);
    // save the user
    newUser.save();
    console.info(`Index: ${i} user were successfully stored.`);
    }
    /*
    model.User.collection.insert(users, (err, docs)=>{
    if (err) {
      console.log(`failed to Load user Data: ${err}`);
    } else {
      console.info(`${users.length} users were successfully stored.`);
    }
  });
  */
});
};