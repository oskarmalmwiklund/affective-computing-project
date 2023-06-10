var recorder = {
    
    moveListener:function() {
      var that = this;

      $(window).mousemove(function(e) {
        if(that.state == 1) {
          that.frames.push([e.clientX, e.clientY]);
        }
      });
    },

    record:function() {
      var that = this;
      that.frames = [];
      that.state = 1;
      that.startTime = new Date().getTime()/1000;
        
      $('button.r').text('recording..');
      $('button.p').text('stop & play');
      
    },

    playback:function() {
      var that = this;
      that.state = 2;
      
      $('button.r').text('record');
      $('button.p').text('playing..');

      that.endTime = new Date().getTime()/1000;
      that.time = (that.endTime - that.startTime) * 3;

      $(that.frames).each(function(i, move) {

        setTimeout(function() {
          $('div.cursor').css({
            left: move[0],
            top: move[1]
          });
          
          if(i == that.frames.length-1) {
            $('.p').text('stop & play');
          }

        }, (that.time * i));

      });
    }

};

recorder.state = 2; //1 = Recording | 2 = Stopped
recorder.frames = [];

/*
 * Listen for the mouse movements
 */
recorder.moveListener();