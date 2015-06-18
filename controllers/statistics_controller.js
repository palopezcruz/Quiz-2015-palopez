var models = require('../models/models.js');

// GET /quizes/statistics
exports.show = function(req, res){
    var statistics = { numPreguntas: 0, numComentarios: 0, promComentarios: 0, sinComentarios: 0, conComentarios: 0, noPublicados: 0 };
	
	// Numero de preguntas	
	models.Quiz.findAndCountAll()
		.then(function(cuenta) { 
			statistics.numPreguntas = cuenta.count;
			console.log("Numero de preguntas: ", statistics.numPreguntas);
			
			//Numero de comentarios
			models.Comment.findAndCountAll()
				.then(function(cuenta2) { 
					statistics.numComentarios = cuenta2.count;
					console.log("Numero de comentarios: ", statistics.numComentarios);
			
				models.Comment.findAndCountAll()
					.then(function(cuenta3) { 
						statistics.promComentarios = statistics.numComentarios / statistics.numPreguntas; 
						console.log("Promedio de comentarios: ", statistics.promComentarios);
				
					// Numero de preguntas con comentario
					models.sequelize.query('SELECT count(*) AS "count" FROM "Quizzes" WHERE "id" IN (SELECT DISTINCT "QuizId" FROM "Comments")')
						.then(function(cuenta4) {
							statistics.conComentarios = cuenta4[0][0].count;
							statistics.sinComentarios = statistics.numPreguntas - statistics.conComentarios;
							console.log("Numero de preguntas: ", statistics.numPreguntas);
							console.log("Con comentarios: ", statistics.conComentarios);
							console.log("Sin comentarios: ", statistics.sinComentarios);
							
							res.render('statistics/show.ejs', {statistics: statistics, errors: []});
					});		
				});								
			});	
	});					
};



	