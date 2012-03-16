/**
 * bteixeira 12-03-2012
 */

google.load('search', '1');

// EXTRACAO DE KEYWORDS
//http://search.yahooapis.com/ContentAnalysisService/V1/termExtraction
//http://search.yahooapis.com/ContentAnalysisService/V1/termExtraction?appid=YahooDemo&context=tava%20eu%20muito%20bem%20no%20marques%20de%20pombal

NotesAround = {

	search: function (config) {
		var query = config.query;
		var searchFun = NotesAround.engines[config.engine].search;
		if (config.preprocessor) {
			NotesAround.preprocessors[config.preprocessor].process(query, function (output) {
				searchFun(output, config.callback);
			});
		} else {
			searchFun(query, config.callback);
		}
	},

	engines: {
		stub: {
			search: function (query, callback) {
				callback({url: 'https://lh4.googleusercontent.com/-eUuuVZU6XDg/T15jY_ji5qI/AAAAAAAAF4w/cqOLWneTIGk/20120311_courir_avec_sarah_pont_du_gard%252520%252528216%252529.JPG'});
				callback({url: 'http://img.pai.pt/mysite/rendermedia/43/20/4/1e37f8a0-25fe-4923-ab93-a617d45ad3c5.jpg'});
				callback({url: 'http://divahh.com/wp-content/uploads/2010/06/stuff.jpg'});
			}
		},
		google: {
			search: function (query, callback) {
				var imageSearch = new google.search.ImageSearch();
				imageSearch.setSearchCompleteCallback(this, function (searcher) {
					if (searcher.results && searcher.results.length > 0) {
                        callback(searcher.results);

					}
				}, [imageSearch]);
				imageSearch.execute(query);
			}
		},
		flickr: {
			search: function (query, callback) {

				var key = '02b198ad5b9c0ce29e030759a805938b';
				var secret = 'c7a32d9ac17329c6';
				var endpoint = 'http://api.flickr.com/services/rest/';
				// test url: http://www.flickr.com/services/rest/?method=flickr.photos.getInfo&format=json&api_key=d7995cd75f3084fb766aea717d8d3d25&photo_id=6831157910

				$.ajax(endpoint, {
					data: {
						method: 'flickr.photos.search',
						format: 'json',
						tags: query.replace(/\s+/g, ','), // tags sao separadas por virgulas, assumimos que qualquer espaco separa as tags
						api_key: key,
						nojsoncallback: 1, // you can also use <jsoncallback: 'fnName'>
						per_page: 10
					},
					dataType: 'json',
					success: function (data, textStatus, jqXHR) {
						var i;
						var max = 10;
						var photos = data.photos.photo;
						var photo;
						for (i = 0; i < photos.length; i++) {
							if (i === max) {
								break;
							}
							photo = photos[i];
							$.ajax(endpoint, {
								data: {
									method: 'flickr.photos.getInfo',
									format: 'json',
									api_key: key,
									photo_id: photo.id,
									nojsoncallback: 1,
									per_page: 10
								},
								dataType: 'json',
								success: function (data, textStatus, jqXHR) {
									var url = data.photo.urls.url[0]._content;
									//$('#results').append('<div class="result"><a href="' + url + '" target="_blank">' + url + '</a>');
									callback({
										url: url
									});
								},
								error: function (jqXHR, textStatus, errorThrown) {
									alert(textStatus);
								}
							});
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						alert(textStatus);
					}
				});
			}
		}
	},
	preprocessors: {
		yahoo: {
			process: function (query, callback) {
//				$.ajax('http://search.yahooapis.com/ContentAnalysisService/V1/termExtraction?output=json&appid=YahooDemo&context=tava%20eu%20muito%20bem%20no%20marques%20de%20pombal', {
				        //http://search.yahooapis.com/ContentAnalysisService/V1/termExtraction?output=json&appid=YahooDemo&context=Estava+eu+muito+bem+no+marqu%C3%AAs+quando+decidi+largar+uma+poia.&_=1331858543509
				$.ajax('http://search.yahooapis.com/ContentAnalysisService/V1/termExtraction?appid=YahooDemo', {
//				$.ajax('http://search.yahooapis.com/ContentAnalysisService/V1/termExtraction?output=json&appid=YahooDemo&context=' + query, {
					dataType: "jsonp",
					jsonp: "callback",
					method: 'POST',
					data: {
						context: query,
						output: 'json'
					},
					success: function (data, textStatus, jqXHR) {
						var results = data.ResultSet.Result;
						if (results.length > 0) {
							for (var i = 0 ; i < results.length ; i++) {
								$('#keywords').append('<div>KEYWORD: ' + results[i] + '</div>');
							}
							callback(results[0]);
						} else {
							$('#keywords').html('(no keywords returned)');
							callback(query);
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						alert(textStatus);
					}
				});

			}
		},
		stub: {
			process: function (query, callback) {
				$('#keywords').html('(stub -- processed string is the same as imput)');
				callback(query);
			}
		}
	}

};
