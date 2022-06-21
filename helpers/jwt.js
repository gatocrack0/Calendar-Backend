const jwt = require('jsonwebtoken')

const generarJWT = (uid, name) => {
  return new Promise((resolve, reject) => {
    const payload = { uid, name }
    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h'
    }, (err, token) => {
      if (err) {
        console.log(err)
        reject(new Error('Error al generar el token'))
      }
      resolve(token)
    })
  })
}

module.exports = {
  generarJWT
}
