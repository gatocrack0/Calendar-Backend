const { response } = require('express')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario')
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body
  try {
    let usuario = await Usuario.findOne({ email })
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe un usuario con ese email'
      })
    }
    usuario = new Usuario(req.body)
    // Encriptar contraseña
    const salt = await bcrypt.genSalt() // default:10
    usuario.password = await bcrypt.hash(password, salt)
    await usuario.save()
    // Generar token
    const token = await generarJWT(usuario._id, usuario.name)

    res.status(201).json({
      ok: true,
      uid: usuario._id,
      name: usuario.name,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Contacte con el administrador'
    })
  }
}

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body
  try {
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'No existe un usuario con ese email'
      })
    }
    // Validar contraseña
    const validPassword = await bcrypt.compare(password, usuario.password)
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Contraseña incorrecta'
      })
    }
    // Generar token
    const token = await generarJWT(usuario._id, usuario.name)

    res.json({
      ok: true,
      uid: usuario._id,
      name: usuario.name,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Contacte con el administrador'
    })
  }
}

const revalidarToken = async (req, res = response) => {
  const { uid, name } = req
  // Generar nuevo token
  const token = await generarJWT(uid, name)

  res.json({
    ok: true,
    token
  })
}

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken
}
