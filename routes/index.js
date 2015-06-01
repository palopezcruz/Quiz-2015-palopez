var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

/* GET /author */
router.get('/author', function(req, res, next) {
  res.render('author', { title: 'Página de créditos de QUIZ 2015' });
});

module.exports = router;
