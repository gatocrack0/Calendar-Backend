const { response } = require('express')
const Evento = require('../models/Evento')

// const { generarJWT } = require('../helpers/jwt')

const getEventos = async (req, res = response) => {
  const eventos = await Evento.find().populate('user', 'name email')

  res.json({
    ok: true,
    eventos
  })
}

const crearEvento = async (req, res = response) => {
  const evento = new Evento(req.body)

  try {
    evento.user = req.uid
    const eventoGuardado = await evento.save()
    res.status(201).json({
      ok: true,
      evento: eventoGuardado
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    })
  }
}

const actualizarEvento = async (req, res = response) => {
  const eventoId = req.params.id
  const uid = req.uid
  try {
    const evento = await Evento.findById(eventoId)
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'Sin privilegios'
      })
    }
    const nuevoEvento = {
      ...req.body,
      user: uid
    }
    const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true })

    return res.status(201).json({
      ok: true,
      msg: 'Evento actualizado',
      evento: eventoActualizado
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Evento no encontrado'
    })
  }
}

const eliminarEvento = async (req, res = response) => {
  const eventoId = req.params.id
  const uid = req.uid
  try {
    const evento = await Evento.findById(eventoId)
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'Sin privilegios'
      })
    }

    const eventoEliminado = await Evento.findByIdAndDelete(eventoId)

    return res.status(201).json({
      ok: true,
      msg: 'Evento eliminado',
      evento: eventoEliminado
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Evento no encontrado'
    })
  }
}

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento
}
