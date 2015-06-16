var models = require('../models/models.js');

// Autoload :id de comentarios

exports.load = function(req, res, next, commentId) {
	models.Comment.find({
		where: {
			id: Number(commentId) 
		}
	}).then(function(comment){
			if (comment) {
				req.comment = comment;
				next();
			} else { next (new Error('No existe commentId=' + commentId))}
		}
	).catch(function(error){next(error)});
};

// GET /quizes/:quizId/comments/new
exports.new = function(req, res){
		res.render('comments/new.ejs', {quizId: req.params.quizId, errors: []});
};	

// POST /quizes/:quizId/comments
exports.create = function(req, res){
	var comment = models.Comment.build(
	{ 	texto: req.body.comment.texto,
		QuizId: req.params.quizId
	});
	
	comment
	.validate()
	.then(
		function(err){
			if (err){
				res.render('comments/new.ejs', {comment: comment, quizId: req.params.quizId, errors: err.errors});
			} else {
				comment // Guarda en la BBDD el campos de comentario
				.save()
				.then(function(){res.redirect('/quizes/' + req.params.quizId)})
			}	// Redireccion HTTP (URL relativo) lista de preguntas 	
		}
	).catch(function(error){next(error)});	
};


//GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res){
	req.comment.publicado = true;

	req.comment.save({fields: ["publicado"]})
		.then( function(){ res.redirect('/quizes/' + req.params.quizId);})
		.catch(function(error){next(error)});
};


// GET /quizes/statistics
exports.show = function(req, res){
    var statistics = { numPreguntas: '--', numComentarios: '--', promComentarios: '--', sinComentarios: '--', conComentarios: '--', noPublicados: '--' };

	// Numero de preguntas	
    models.sequelize.query('SELECT count(*) AS n FROM "Quizzes"')
		.then(function(cuenta) { 
			statistics.numPreguntas = cuenta[0].n;
			//Numero de comentarios
			models.sequelize.query('SELECT count(*) AS n FROM "Comments"')
				.then(function(cuenta) { 
					statistics.numComentarios = cuenta[0].n;
					if( +statistics.numPreguntas > 0) {
						statistics.promComentarios = cuenta[0].n / statistics.numPreguntas; 
						// Numero de preguntas con comentario
						models.sequelize.query('SELECT count(*) AS n FROM "Quizzes" WHERE "id" IN (SELECT DISTINCT "QuizId" FROM "Comments")')
							.then(function(cuenta) {
								statistics.conComentarios = cuenta[0].n;
								statistics.sinComentarios = +statistics.numPreguntas - cuenta[0].n;
								// Numero de comentarios no publicados
								models.sequelize.query('SELECT count(*) AS n FROM "Comments" WHERE NOT "publicado"')
									.then(function(cuenta) {
										statistics.noPublicados = cuenta[0].n;
										res.render('statistics/show.ejs', {statistics: statistics, errors: []});
									});
							});
					};
				});
			});	
};



	