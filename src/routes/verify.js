const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request no token')
    }
    let token = req.headers.authorization.split(' ')[1];
    if(token === 'null') {
      return res.status(401).send('Unauthorized request null')    
    }
    let payload = jwt.verify(token,'#key')
    if(!payload) {
      return res.status(401).send('Unauthorized request error')    
    }
    req.userId = payload.subject
    next()
  }

  module.exports = verifyToken;