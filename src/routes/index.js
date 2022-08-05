const { Router } = require('express');
const cors = require('cors');
const router = Router();

const mysqlConnection = require('../database');

router.use(cors());

//rutas

module.exports = router;
