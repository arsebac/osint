var express = require('express');
const Webuser = require('../models/Webuser')
const Database = require('../models/Database')
const Fb = require('../models/Fb')
const { route } = require('express/lib/application');
var router = express.Router();

function utilisateurConnecte(req, res, next) {
  if (req.session.utilisateur) {
    // Si l'utilisateur est connecté, on passe à la suite
    next();
  } else {
    // Si l'utilisateur n'est pas connecté, on le redirige vers la page de login
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/', utilisateurConnecte, async function(req, res, next) {
  res.render('index', { title: 'Express', key: process.env.INTELX_API });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  // Récupération des données du formulaire
  const email = req.body.email;
  const password = req.body.password;

  Webuser.findOne({email}, (error, webuser) => {
    if (error) {
      // Si une erreur est survenue, on affiche un message d'erreur
      req.flash('error', 'Une erreur est survenue lors de la connexion');
      res.redirect('/login');
    } else if (!webuser) {
      // Si aucun utilisateur n'a été trouvé, on affiche un message d'erreur
      req.flash('error', 'Email ou mot de passe incorrect');
      res.redirect('/login');
    } else {
      // Si l'utilisateur a été trouvé, on vérifie que le mot de passe est correct
      webuser.verifyPassword(password, (error, isMatch) => {
        if (error) {
          // Si une erreur est survenue, on affiche un message d'erreur
          req.flash('error', 'Une erreur est survenue lors de la connexion');
          res.redirect('/login');
        } else if (!isMatch) {
          // Si le mot de passe est incorrect, on affiche un message d'erreur
          req.flash('error', 'Email ou mot de passe incorrect');
          res.redirect('/login');
        } else {
          req.session.utilisateur = webuser;
          res.redirect('/');
        }
      })
    }
  });
});


router.get('/database', (req, res) => {
  const keywords = req.query.searchDatabase;
  Database.find({website:  { $regex: keywords, $options: 'i' }}, (error, dbEntry) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      console.log("Database", dbEntry)
      // Réponse avec les résultats de la recherche
      res.send(dbEntry);
    }
  });
});

router.get('/search', (req, res) => {
  const phone = req.query.keywords;
  // Recherche en base de données
  Fb.find({phone:{ $regex: phone, $options: 'i' }}, (error, utilisateurs) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      // Réponse avec les résultats de la recherche

      const results = []
      for (const user of utilisateurs) {
        results.push({
          id: user.fb, 
          phone: user.phone, 
          email: "", // On n'a pas l'association avec l'email 
          username: user.firstname + " " + user.lastname
        })
      }
      res.send(results);
    }
  });
})

module.exports = router;
