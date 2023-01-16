var express = require('express');
const Webuser = require('../models/Webuser')
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
router.get('/', utilisateurConnecte, function(req, res, next) {
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

router.get('/search', (req, res) => {
  const keywords = req.query.keywords;
  console.log("search keywords", keywords)

  // Recherche en base de données
  Fb.find({/*
    // Création d'un objet de filtre qui utilise les mots-clés de recherche
    $or: [
      { phone: { $regex: keywords, $options: 'i' } },
      { fb: { $regex: keywords, $options: 'i' } },
      { firstname: { $regex: keywords, $options: 'i' } }, 
      { lastname: { $regex: keywords, $options: 'i' } }, 
      { sex: { $regex: keywords, $options: 'i' } }, 
      { update_time: { $regex: keywords, $options: 'i' } }, 
      { location: { $regex: keywords, $options: 'i' } }, 
      { date: { $regex: keywords, $options: 'i' } }, 
      { marital_status: { $regex: keywords, $options: 'i' } }
    ]*/
  }, (error, utilisateurs) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
    } else {
      console.log("resp", utilisateurs)
      // Réponse avec les résultats de la recherche
      res.send(utilisateurs);
    }
  });
})

module.exports = router;
