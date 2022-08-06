const { Router } = require('express');
const cors = require('cors');
const router = Router();

const mysqlConnection = require('../database');

router.use(cors());

//rutas

//API para registrarse/loguearse dentro del sistema
router.post('/login', (req, res) => {
  const { user } = req.body.data;

  mysqlConnection.query(
    'SELECT * FROM users WHERE user_use = ?',
    [user],
    (err, rows, fields) => {
      if (!err) {
        //Para validar si es un usuario ya existente en el sistema o hay que registrarlo
        if (rows.length < 1) {
          insertUser(user);
        } else {
          res.json({
            result: true,
            message: 'Sesión iniciada',
            user: rows,
          });
        }
      } else {
        console.log(err);
      }
    }
  );

  //Función para registrar usuario
  const insertUser = (user) => {
    mysqlConnection.query(
      'INSERT INTO users (user_use) VALUES(?)',
      [user],
      (err, rows, fields) => {
        if (!err) {
          res.json({
            result: true,
            message: 'Usuario registrado correctamente',
            user: [{ id_use: rows.insertId, user_use: user }],
          });
        } else {
          console.log(err);
        }
      }
    );
  };
});

//API para obtener todas las canciones favoritas
router.get('/getFavoritesSongs', (req, res) => {
  mysqlConnection.query('SELECT * FROM favorite_songs', (err, rows, fields) => {
    if (!err) {
      //Para tomarlos en la app y saber que elementos estan agregados en base al icono de favorito
      let arrayIdsSpotify = [];
      for (let i = 0; i < rows.length; i++) {
        arrayIdsSpotify.push(rows[i].id_spotify_fav);
      }

      res.json({
        result: true,
        message: 'Consulta realizada',
        favorite_songs: rows,
        ids_spotify_fav: arrayIdsSpotify,
      });
    } else {
      console.log(err);
    }
  });
});

//API para gestionar la lista de favoritos
router.post('/manageFavorites', (req, res) => {
  const { name_fav, img_fav, note_fav, id_spotify_fav, id_use } = req.body.data;

  mysqlConnection.query(
    'SELECT * FROM favorite_songs WHERE id_spotify_fav = ?',
    [id_spotify_fav],
    (err, rows, fields) => {
      if (!err) {
        //Para validar si debe ser eliminado o agregado dependiendo si ya existe en la BD
        if (rows.length > 0) {
          deleteFavorite();
        } else {
          addFavorite();
        }
      } else {
        console.log(err);
      }
    }
  );

  //Función para borrar un elemento de la lista de favoritos
  const deleteFavorite = () => {
    mysqlConnection.query(
      'DELETE FROM favorite_songs WHERE id_spotify_fav = ?',
      [id_spotify_fav],
      (err, rows, fields) => {
        if (!err) {
          res.json({
            result: true,
            message: 'Elemento borrado de favoritos',
            favorite: rows,
          });
        } else {
          console.log(err);
        }
      }
    );
  };

  //Función para agregar un elemento de la lista de favoritos
  const addFavorite = () => {
    mysqlConnection.query(
      'INSERT INTO favorite_songs (name_fav, img_fav, note_fav, id_spotify_fav, id_use) VALUES (?, ?, ?, ?, ?)',
      [name_fav, img_fav, note_fav, id_spotify_fav, id_use],
      (err, rows, fields) => {
        if (!err) {
          res.json({
            result: true,
            message: 'Elemento guardado en favoritos',
            favorite: rows,
          });
        } else {
          console.log(err);
        }
      }
    );
  };
});

module.exports = router;
