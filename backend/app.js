//import * as func from './functions';

const express = require('express');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

const func =  require('./functions');

const url='mongodb://127.0.0.1:27017/Authentication';
mongoose.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});

//app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());

const user = mongoose.model('users',{
    name:{type:String},
    email:{type:String},
    password:{type:String}
});

app.post("/login", (req, res) => {
    let fetchedUser;  
    user.findOne({email:req.body.email}).then(user=>{
      if(!user){
        return res.send({
          msg: "Auth failed!! no such user"
        })
      }
      fetchedUser=user;
      return bcrypt.compare(req.body.password, user.password);
    }).then(result=>{
        console.log(result)
      console.log(fetchedUser)
      if(!result){
        return res.send({
          msg: "Auth failed incorrect password"
        })
      }
      const payload = { email: fetchedUser.email, userId: fetchedUser._id};      
      const token = func.getJWTToken(payload)
      const refreshToken = func.getRefreshToken(payload)
      console.log(fetchedUser.name);
      res.send({
        msg: 'success',
        token: token,
        expiresIn: 900,
        userId: fetchedUser.name,
        refreshToken: refreshToken
      });
    })
    .catch(e=>{
      console.log(e)
      res.status(500).send('Error')
    
    })
  })


app.post('/registration',(req,res)=>{
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;
    //console.log(name+email);

    user.findOne({email: email},(notFound,found)=>{
        if(found){
            console.log(found);
            res.send({msg:'User exits!!'});
        }
        else{
            bcrypt.hash(password,10).then(hash => {            
            var newUser=new user({
                name:name,
                email:email,
                password:hash
            });
            newUser.save((error,result)=>{
                if(error){
                    console.log(error);
                    res.status(500).json({ msg:'Error'});
                }
                else{
                    console.log(result);
                    res.status(200).json({ msg:'successful'});
                    
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error : err})
        });
        }
    });
    
})

app.delete('/clearData', func.verifyToken,(req,res) => {
    //var email = req.body.email;
    user.deleteMany({ name : { $ne:"admin"}},(error,result) => {
        if(result){
            console.log('all data removed');
            res.send({msg:'removed'});
        }else{
            console.log(error);
            res.send({msg:'unsuccessful'});
        }
    })
})

app.post('/profile',func.verifyToken, (req,res) => {
  res.send('Hi! Your in profile page')

})

app.post('/auth/accesstoken',func.verifyRefreshToken,(req,res) => {
  const token = func.getJWTToken(req.payload);
  res.send({accessToken: token})
})

app.post('/auth/refreshtoken',func.verifyRefreshToken,(req,res) => {
  const accessToken =  func.getJWTToken(req.payload)
  const refreshToken = func.getRefreshToken(req.payload)
  res.send({ accessToken: accessToken, refreshToken: refreshToken});
  
})

app.listen(3003,() => {
    console.log('Listening at port 3003');
})