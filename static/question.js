// to update score
function send_correct(is_correct) {
    $.ajax({
        type: "POST",
        url: "update_score",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(is_correct),
        success: function (response) {
            console.log("success");
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

function send_answer(item){
    $.ajax({
        type: "POST",
        url: "store_answer",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(item),
        success: function (response) {
            console.log("success");
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

// show next button ar the bottom
function showbutton(item, next_item, total, is_correct){
    if (next_item > total){
        $("#nextq").append("<button type='button' class='block enabled_yellow'><a href='/end' style='color:#fff'>Submit Quiz</a></button>");
    }
    else{
        $("#nextq").append("<button type='button' class='block enabled_yellow'><a href='/question/"+next_item+"' style='color:#fff'>Next Question</a></button>");
    }
    send_correct(is_correct)
}

// show recipe button
function showrecipe(item){
    $("#recipebutton").click(function(){
        let url = "/recipe/"+item["recipe_id"]
        window.open(url,'_blank')
    });
}

// display correct answer
function showcorrect(item){
    if (item["type"] == "2_ingredients"){
        let w = 250;
        let h = 200;
        $("#imageres").html("")
        $("#imageres").append("<img src='" + item["image_res"] + "' alt='Pasta Image' width='"+w+"' height='"+h+"'>" + "<br/><figcaption class='caption_0'>"+item["text_res"])
        $("#imageres").addClass("correcthighlight")
    }
    if (item["type"] == "3_ingredients"){
        let w = 200;
        let h = 150;
        $("#image"+item["missing"]).html("")
        $("#image"+item["missing"]).append("<img src='" + item["image_"+item["missing"]] + "' alt='Pasta Image' width='"+w+"' height='"+h+"'>" + "<br/><figcaption class='caption_0'>"+item["text_"+item["missing"]])
        $("#image"+item["missing"]).addClass("correcthighlight")
    }
}


// Main
$(document).ready(function(){
    $("#title").append(item["title"]);
    $( "#progressbar" ).progressbar({
        value: Math.round(100*parseInt(item["question_number"]-1)/n_questions)
    });
    $( ".progress-label" ).text($( "#progressbar" ).progressbar( "value") + "%");


    // two ingredients
    if (item["type"] == "2_ingredients"){
        $("#image1").append("<img src='" + item["image_1"] + "' alt='Pasta Image' width='250' height='200'>" + "<br/><figcaption class='caption_0'>"+item["text_1"])
        $("#imageop").append(item["operator"])
        $("#image2").append("<img src='" + item["image_2"] + "' alt='Pasta Image' width='250' height='200'>" + "<br/><figcaption class='caption_0'>"+item["text_2"])
        $("#imageeq").append("=")
        $("#imageres").append("<img src='https://upload.wikimedia.org/wikipedia/commons/4/46/Question_mark_%28black%29.svg' alt='Question Mark' width='250' height='220'>")
    }

    // three ingredients
    if (item["type"] == "3_ingredients"){
        let mval = item["missing"];
        $.each([1,2,3,4],function(index,value){
            if (value != mval){
                $("#image"+value).append("<img src='" + item["image_"+value] + "' alt='Pasta Image' width='200' height='150'>" + "<br/><figcaption class='caption_0'>"+item["text_"+value])
            }
            else{
                $("#image"+mval).append("<img src='https://upload.wikimedia.org/wikipedia/commons/4/46/Question_mark_%28black%29.svg' alt='Question Mark' width='200' height='176'>") 
            }
        });
        $("#imageop1").append(item["operators"][0])
        $("#imageop2").append(item["operators"][1])
        $("#imageeq").append("=")
    }

    // option buttons
    $("#op1").append("<button type='button' id='option1' class='block mybutton'><a>" + "<img src='" + item["option_images"][0] + "' alt='Pasta Image' width='200' height='150'>" + "<\a><br/><figcaption class='caption_1'>"+item["options"][0]+"</button>")
    $("#op2").append("<button type='button' id='option2' class='block mybutton'><a>" + "<img src='" + item["option_images"][1] + "' alt='Pasta Image' width='200' height='150'>" + "<\a><br/><figcaption class='caption_1'>"+item["options"][1]+"</button>")
    $("#op3").append("<button type='button' id='option3' class='block mybutton'><a>" + "<img src='" + item["option_images"][2] + "' alt='Pasta Image' width='200' height='150'>" + "<\a><br/><figcaption class='caption_1'>"+item["options"][2]+"</button>")
    $("#op4").append("<button type='button' id='option4' class='block mybutton'><a>" + "<img src='" + item["option_images"][3] + "' alt='Pasta Image' width='200' height='150'>" + "<\a><br/><figcaption class='caption_1'>"+item["options"][3]+"</button>")

    $(".mybutton").hover(
        function(){$(this).addClass("highlight")},
        function(){$(this).removeClass("highlight")}
    )
    
    let correctoption = item["correct"] + 1
    let next_item = item["id"] + 1
    let is_correct = {"correct": 0, "id": item["question_number"]}

    // answering the question for the first time
    if (item["selected"] == -1){
        $.each([1,2,3,4],function(index,value){
            $("#option"+value).click(function(){
                item["selected"] = index
                send_answer(item)
                console.log(item["selected"])
                if (item["correct"] == index){
                    $("#op"+value+"txt").addClass("correct").html("Correct Answer<br>")
                    is_correct["correct"] = 1
                    $("#op"+value+"txt").append("<button type='button' id='recipebutton' class='block enabled_yellow'><a>View Recipe</a></button>")
                    $("#option"+value).addClass("correcthighlight")
                    showrecipe(item)
                    showcorrect(item)
                }
                else{
                    $("#op"+value+"txt").addClass("wrong").html("Wrong Answer<br>")
                    $("#op"+value+"txt").append("<button type='button' id='viewbtn' class='block enabled_yellow'><a>View Answer</a></button>")
                    $("#viewbtn").click(function(){
                        $("#op"+correctoption+"txt").addClass("correct").append("Correct Answer<br>")
                        $("#op"+correctoption+"txt").append("<button type='button' id='recipebutton' class='block enabled_yellow'><a> View Recipe</a></button>")
                        $("#option"+correctoption).addClass("correcthighlight")
                        showrecipe(item)
                        showcorrect(item)
                        $("#viewbtn").prop("disabled",true)
                    });
                }
        
                $("#option1").prop("disabled",true)
                $("#option2").prop("disabled",true)
                $("#option3").prop("disabled",true)
                $("#option4").prop("disabled",true)
        
                showbutton(item, next_item, total, is_correct)
            });
        });
    }
    else{
        let index = item["selected"]
        let value = index + 1
        console.log(item["selected"])
        if (item["correct"] == index){
            $("#op"+value+"txt").addClass("correct").html("Correct Answer<br>")
            is_correct["correct"] = 0
            $("#op"+value+"txt").append("<button type='button' id='recipebutton' class='block enabled_yellow'><a>View Recipe</a></button>")
            $("#option"+value).addClass("correcthighlight")
            showrecipe(item)
            showcorrect(item)
        }
        else{
            $("#op"+value+"txt").addClass("wrong").html("Wrong Answer<br>")
            $("#op"+value+"txt").append("<button type='button' id='viewbtn' class='block enabled_yellow'><a>View Answer</a></button>")
            $("#option"+value).addClass("highlight")
            $("#viewbtn").click(function(){
                $("#op"+correctoption+"txt").addClass("correct").append("Correct Answer<br>")
                $("#op"+correctoption+"txt").append("<button type='button' id='recipebutton' class='block enabled_yellow'><a> View Recipe</a></button>")
                $("#option"+correctoption).addClass("correcthighlight")
                showrecipe(item)
                showcorrect(item)
                $("#viewbtn").prop("disabled",true)
            });
        }

        $("#option1").prop("disabled",true)
        $("#option2").prop("disabled",true)
        $("#option3").prop("disabled",true)
        $("#option4").prop("disabled",true)

        showbutton(item, next_item, total, is_correct)
    }
});