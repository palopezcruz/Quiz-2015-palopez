var models = require('../models/models.js');

// GET /quizes/question
/**

exports.question = function(req, res){
		models.Quiz.findAll().then(function(quiz){
			res.render('quizes/question', {pregunta: quiz[0].pregunta});
		})
};	

**/

// Autoload - Factoriza el código si ruta incluye .quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
		function(quiz){
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next (new Error('No existe quizId=' + quizId));}
		}
	).catch(function(error)	{next (error);});
};

// GET /quizes?busqueda=texto_a_buscar
exports.index = function(req, res){
	if(req.query.search) {
		models.Quiz.findAll({where:["pregunta like ?", '%' + req.query.search + '%'], order:'pregunta ASC'}).then(function(quizes) {
			res.render('quizes/results', {quizes: quizes});
			// res.render('quizes/index', {quizes: quizes});
		}).catch(function(error) {next(error);});
	} else {
		models.Quiz.findAll().then(function(quizes){
			res.render('quizes', {quizes: quizes});
		}).catch(function(error) { next(error);});
	}	
};	


// GET /quizes/:id
exports.show = function(req, res){
		res.render('quizes/show', {quiz: req.quiz});
};	

// GET /quizes/:id/answer
exports.answer = function(req, res){
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	} 
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado}); 	
};

// GET /quizes?busqueda=texto_a_buscar
/**
exports.search = function(req, res){
	models.Quiz.findAll().then(
		function(quizes){
			res.render('quizes?busqueda=texto_a_buscar', {quizes: quizes});
		}
	).catch(function(error) {next(error);})
};	
**/

// GET /author
//exports.question = function(req, res){
//		res.render('/author', {pregunta: 'Capital de Italia'});
//};