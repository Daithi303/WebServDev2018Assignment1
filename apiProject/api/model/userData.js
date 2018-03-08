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
  "password": "adamPword"
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
  "password": "barryPword"
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