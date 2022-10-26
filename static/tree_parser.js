

function callBackend(url, data_file){

    $.ajax({
            url : url,
            type: "POST",
            async: false,
            cache: false,
            timeout: 30000,
            dataType : "json",
            contentType : "application/json; charset=utf-8",
            data : JSON.stringify(data_file),
            success: function(response) {
                console.log(response)
                if (response.redirect) {
                    window.location.href = response.redirect;
                  }
            },
            error: function (response, status, error) {
                console.log("Error");
                console.log(response);
                console.log(status);
                console.log(error);
            }
        });
    }


function renderParent(e, id){
   e.preventDefault();

   callBackend('/traverse_tree', {'id' : id})

}

function renderChild(e, id){
   e.preventDefault();

   callBackend('/traverse_tree', {'id' : id})

}

function goToQuiz(e){
   e.preventDefault();

   callBackend('/goto_quiz_home', {})

}



function initTree(e){
   e.preventDefault();


   callBackend('/traverse_tree', {'id' : '0'})
}




let color = 'color'

function turnOn(value){



    color = document.getElementById(parseInt(value)).className

    document.getElementById(parseInt(value)).classList.remove(color);
    document.getElementById(parseInt(value)).classList.add('yellow');

}

function turnOff(value){

    document.getElementById(parseInt(value)).classList.add(color);
    document.getElementById(parseInt(value)).classList.remove('yellow');

}




$(document).ready(function(){
      /* DURING HOVER */
      $('#child-button-1').hover(function() {
        $('#arrow-1').append("<style>#arrow-1::before{ right: 34px; width: 250px;}</style>");

        let node = document.getElementById('child-button-1').getAttribute('name')
        turnOn(node)
      /* BEFORE HOVER */
      }, function() {
        // on mouseout, reset the background colour
        $('#arrow-1').append("<style>#arrow-1::before{width : 100px; right: 20px; }</style>");

        let node = document.getElementById('child-button-1').getAttribute('name')
        turnOff(node)
      });

      /* DURING HOVER */
      $('#child-button-2').hover(function() {
        $('#arrow-2').append("<style>#arrow-2::before{ right: 34px; width: 185px;}</style>");

        let node = document.getElementById('child-button-2').getAttribute('name')
        turnOn(node)

      /* BEFORE HOVER */
      }, function() {
        // on mouseout, reset the background colour
        $('#arrow-2').append("<style>#arrow-2::before{width : 100px; right: 20px; }</style>");
        let node = document.getElementById('child-button-2').getAttribute('name')
        turnOff(node)
      });

      /* DURING HOVER */
      $('#child-button-3').hover(function() {
        $('#arrow-3').append("<style>#arrow-3::before{ right: 34px; width: 250px;}</style>");
        let node = document.getElementById('child-button-3').getAttribute('name')
        turnOn(node)
      /* BEFORE HOVER */
      }, function() {
        // on mouseout, reset the background colour
        $('#arrow-3').append("<style>#arrow-3::before{width : 100px; right: 20px; }</style>");
        let node = document.getElementById('child-button-3').getAttribute('name')
        turnOff(node)
      });


      $('#parent-button-1').hover(function() {
        $('#arrow-parent').append("<style>#arrow-parent::before{ right: 34px; width: 40px;}</style>");

        let node = document.getElementById('parent-button-1').getAttribute('name')
        turnOn(node)
      /* BEFORE HOVER */
      }, function() {
        // on mouseout, reset the background colour
        $('#arrow-parent').append("<style>#arrow-parent::before{width : 150px; right: 20px; }</style>");
        let node = document.getElementById('parent-button-1').getAttribute('name')
        turnOff(node[0])
      });




        /* two node tree */

      $('#child-button-1').hover(function() {
        $('#arrow-1-2col').append("<style>#arrow-1-2col::before{ right: 34px; width: 200px;}</style>");
      /* BEFORE HOVER */
      }, function() {
        // on mouseout, reset the background colour
        $('#arrow-1-2col').append("<style>#arrow-1-2col::before{width : 100px; right: 20px; }</style>");
      });

      $('#child-button-3').hover(function() {
        $('#arrow-3-2col').append("<style>#arrow-3-2col::before{ right: 34px; width: 200px;}</style>");
      /* BEFORE HOVER */
      }, function() {
        // on mouseout, reset the background colour
        $('#arrow-3-2col').append("<style>#arrow-3-2col::before{width : 100px; right: 20px; }</style>");
      });

});


