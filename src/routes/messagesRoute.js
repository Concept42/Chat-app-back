const { addMessage, getAllMesseges } = require('../controllers/messegesController')

const router = require('express').Router()

router.post('/addmsg/', addMessage)
router.post('/getmsg/', getAllMesseges)

module.exports = router
