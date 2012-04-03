var app = {
	init: function () {
		var myOptions = {
			center: new google.maps.LatLng(-34.397, 150.644),
			zoom: 5,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: false,
			zoomControl: true,
			panControl: false,
			rotateControl: false,
			scaleControl: false,
			overviewMapControl: false
		};
		new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	}
};
