const { register, login, selectAvatar, getAllUsers } = require('../controllers/userController')

const router = require('express').Router()

router.post('/register', register)
router.post('/login', login)
router.post('/setAvatar/:id', selectAvatar)
router.get('/allUsers/:id', getAllUsers)

module.exports = router
