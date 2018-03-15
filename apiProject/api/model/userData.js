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
  "hashedPassword": "85b412c53bb2059acef04832158b84f2736e00f8",
  "salt": "aHNkNzM1MzkzZ2RoZDkzNzNnZWk4ZGhlOTkyODNnZGs=",
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
  "hashedPassword": "c5c882513e18029989bf333f21a326acb98e54f2",
  "salt": "aHNkNzM1MzkzZ2RoZDkzNzNnZWk4ZGhlOTkyODNnZGs=",
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
  "hashedPassword": "e00e291c2c91f4989423f2aa67cbe086715054b5",
  "salt": "aHNkNzM1MzkzZ2RoZDkzNzNnZWk4ZGhlOTkyODNnZGs=",
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
  "hashedPassword": "b39d9803499c88e27aa1ba862148e0b2d93e2c00",
  "salt": "aHNkNzM1MzkzZ2RoZDkzNzNnZWk4ZGhlOTkyODNnZGs=",
  "admin": false
}
];

export const loadUsers = () => {
  model.User.find({}).remove(() => {
    model.User.collection.insert(users, (err, docs)=>{
    if (err) {
      console.log(`failed to Load user Data: ${err}`);
    } else {
      console.info(`${users.length} users were successfully stored.`);
    }
  });
});
};