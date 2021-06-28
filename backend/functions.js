const jwt = require('jsonwebtoken');
const secret = require('./secret');
const createError = require('http-errors');

function getJWTToken(payload){
    return jwt.sign(
        {payload: payload},
        secret.secretkey,
        {expiresIn: '15min'}
    )
}

const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'].split(' ')[1];
  
    if(!token){
      return res.status(401).send('no token provided')
    }
    jwt.verify(token, secret.secretkey, (err, userData) => {
      if(err) {
          if(err.message == "JsonWebTokenError")
            return res.status(403).send('Failed to authenticate token.')
          return res.status(403).send(err.message)  
      }
      if(userData){
        return next()
      }
      return res.sendStatus(500)
    })
  }

function getRefreshToken(payload){
    return jwt.sign(
        {payload: payload},
        secret.refreshKey
    )
}

const verifyRefreshToken = (req, res, next) => {
    let token = req.body.refreshToken
    
    if(!token){
      return res.status(401).send('no token provided')
    }
    jwt.verify(token, secret.refreshKey, (err, userData) => {
      if(err) {
          if(err.message == "JsonWebTokenError")
            return res.status(403).send('Failed to authenticate token.')
          else  
            return res.status(403).send(err.message)  
      }
      if(userData){
        req.payload = userData
        return next()
      }
      return res.sendStatus(500)
    })
  }  

module.exports = { getJWTToken, verifyToken, getRefreshToken, verifyRefreshToken }