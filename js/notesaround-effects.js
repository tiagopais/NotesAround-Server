NotesAround_FX = {

    last_x : 0,
    last_y : 0,
    last_z : 0,
    last_x2 : 0,
    last_y2 : 0,
    last_z2 : 0,


    bindToAccelerometer : function(callback) {
        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", function () {
                callback([event.beta, event.gamma,eventData.alpha]);
            }, true);
        } else if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', function () {
                callback([event.acceleration.x * 2, event.acceleration.y * 2, event.acceleration.z * 2]);
            }, true);
        } else {
            window.addEventListener("MozOrientation", function () {
                callback([orientation.x * 50, orientation.y * 50,orientation.z * 50]);
            }, true);
        }
    },

    eraseOnTilt : function(accx,accy,accz) {
        var sensitivity = 20;
        this.last_x = accx;
        this.last_y = accy;
        this.last_z = accz;

        // Periodically check the position and fire
        // if the change is greater than the sensitivity
        setInterval(function () {
            var change = Math.abs(this.last_x-this.last_x2+
                this.last_y-this.last_y2+
                this.last_z-this.last_z2);

            if (change > sensitivity) {
                alert('Shake!');
            }

            // Update new position
            this.last_x2 = this.last_x;
            this.last_y2 = this.last_y;
            this.last_z2 = this.last_z;
        }, 150);
    }

}

