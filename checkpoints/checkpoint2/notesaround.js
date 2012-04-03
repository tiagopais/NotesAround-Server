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
		this.appMap = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		this.updateCurrentPosition();
	},

	updateCurrentPosition: function () {
		var me = this;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (position) {
						console.log("Position Found");
						var calculatedPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
						if (!me.currentPosition) {
							me.appMap.setCenter(calculatedPosition);
							me.appMap.setZoom(14);
						}
						me.currentPosition = calculatedPosition;
					},
					function (error) {
						console.log("Something went wrong: ", error);
						me.currentPosition = new google.maps.LatLng(-34.397, 150.644);
					},
					{
						maximumAge: Infinity,
						enableHighAccuracy: true
					});
		} else {
			alert('I guess this browser does not support geolocation!')
		}
	}
};
