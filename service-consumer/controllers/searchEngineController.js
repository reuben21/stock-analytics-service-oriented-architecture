const { getAllServices } = require('../utils');

async function renderSearchEngine(req, res) {
	response = await getAllServices();
	console.log(response);
	res.render('search_engine', {
	    results: response
	});
}

module.exports = {
	renderSearchEngine
};
