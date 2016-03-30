$(function() {

	setInterval(function(){
		$.ajax({
			url: '/tweets/langstats',
			contentType: 'applications/json',
			success: function(response){
				//window.cdata = response;
				// InitChart();
				//console('chart date: ', response);
				for (var i = 0; i < response.length; i++) {
					chart.load({
				        columns: [
				            response[i]
				        ]
				    });
				}

			}
		});
	}, 5000);

	$('#qa').on('click', function(event){
		event.preventDefault();
		$('#search-form').submit();
	});

	$('#search-form').on('submit', function(event){
		event.preventDefault();
		$.ajax({
			url: '/tweets',
			data: {text: $('#q')[0].value},
			contentType: 'applications/json',
			success: function(response){
				var panel = $("#tweets-div");
				panel.html('');
				var stats = response.statuses;
				for(var i=0; i< stats.length;i++){
					panel.append('\
					<div class="card-panel grey lighten-5 hoverable">\
					<div class="row valign-wrapper">\
					<div class="col s2"">\
					<img class="circle responsive-img" src=' + stats[i].user.profile_image_url + ' style="width:100px;height:100px" class="img-circle">\
					</div>\
					<div class="col s10">\
					<span class="black-text"><h5>' + stats[i].user.name  + ' </h5></span>\
					<span class="black-text tooltipped tt" data-position="top" data-delay="50" data-tooltip="Click to view sentiment analysis">' + stats[i].text  + ' </span>\
					<br>\
					<span class="grey-text">' + stats[i].created_at  + ' </span>\
					<br>\
					<div class="chip">Re-tweet: ' + stats[i].retweet_count  + ' </div>\
					<div class="chip">Favorite: ' + stats[i].favorite_count  + ' </div>\
					</div>\
					</div>\
					</div>\
					');
				}
				$('.tt').on('click', function(){
					//alert($(this).text());
					sentimentAnalysis($(this).text());
				});
				$(document).ready(function(){
    				$('.tooltipped').tooltip({delay: 50});
  				});

			}
		});
	});

	function sentimentAnalysis(msg){
		$.ajax({
			async: false,
			method: 'POST',
			url: 'https://community-sentiment.p.mashape.com/text/',
			headers: {
				'X-Mashape-Key':'iSyUP7T42pmsh8KxFcpEd6CpTfxip1sZbE8jsnzuUdcnvUuNjT',
				'Content-Type':'application/x-www-form-urlencoded',
				'Accept':'application/json'
			},
			data: {'txt':  msg },
			success: function(response){
				//alert('Sentiment: ' + response.result.sentiment + ', Confidence level: ' + response.result.confidence);
				var sentiment = response.result.sentiment;
				var icon = 'thumbs_up_down';
				switch (sentiment)
		        {
		            case "Positive":
		                icon = 'thumb_up';
		                break;
		            case "Negative":
		                icon = 'thumb_down';
		                break;
		            default:
		                break;
		        }
				var $toastContent = $('<span> <h5>Sentiment</h5><br><i class="tiny material-icons">' + icon + '</i>  ' + response.result.sentiment +  '<br> Confidence level: ' + Math.round(response.result.confidence) + '%</span>');
  				Materialize.toast($toastContent, 5000);
			}
		});
	}
});
