const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// password string
var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {

//     bcrypt.hash(password, salt, (err, hash)=> {

//         console.log(hash)
//     })
// })

// storing the hashed password
var hashedPassword = '$2a$10$Ci1hlSrbQclGULaKL80fFe2k7QV3j./keRboAcQTv2MEH1a2PDu/i';

// compares the password and hashed password
bcrypt.compare(password, hashedPassword, (err, res)=> {
    console.log(res);
})

// var data = {
//     id: 10
// }


// var token = jwt.sign(data,'123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log('decoded: ', decoded);







// // Hashing Algorithms

// // one way algorithm msg > hash
// var msg = 'I am Shiraj';
// var hash = SHA256(msg).toString();
// console.log('Msg: ',msg);
// console.log('Hash: ',hash);



// var data = {
//     id: 4//'5c2e96b59702bc5ae4e36068'
// }

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'some secret').toString(),
// }
// // salting a hash + secret


// // man in the middle
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data)+ 'some secret').toString();

// if (resultHash === token.hash) {
//     console.log('Data was not changed.');
// } else {
//     console.log('Data was manipulated. Do not trust.');
// }


// // JSON Web Token (JWT) - standard in place
