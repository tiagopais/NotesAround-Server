NotesAround_FX = {

    last_x : 0,
    last_y : 0,
    last_z : 0,
    last_x2 : 0,
    last_y2 : 0,
    last_z2 : 0,


    bindToAccelerometer : function(callback) {
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', function (event) {
               /* callback([event.accelerationIncludingGravity.x * 2,
                    event.accelerationIncludingGravity.y * 2,
                    event.accelerationIncludingGravity.z * 2]);*/
                callback(event);
            }, true);
        } else  if (window.DeviceOrientationEvent) {
                window.addEventListener("deviceorientation", function (event) {
                    //callback([event.beta, event.gamma,event.alpha]);
                    callback(event);
                }, true);
        } else {
            window.addEventListener("MozOrientation", function (event) {
                //callback([event.orientation.x * 50, event.orientation.y * 50,event.orientation.z * 50]);
                callback(event);
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
    },
    logalaisso: function(event) {
        if(event.type==='deviceorientation') {
            console.log('teve evento ' + event.accelerationIncludingGravity.x  + ';' +event.accelerationIncludingGravity.y + ';' + event.accelerationIncludingGravity.z);
        } else if(event.type==='devicemotion') {
            console.log('teve evento ' + event.beta + ';' +event.gamma + ';' + event.alpha);
        } else if(event.type==='MozOrientation') {
            console.log('teve evento ' + event.orientation.x + ';' +event.orientation.y + ';' + event.orientation.z);
        } else {
            console.log('outro ' + event.type);
        }
    }


}

