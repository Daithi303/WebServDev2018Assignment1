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