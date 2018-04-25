// $.ajax({
//     type: "GET",
//     url: "/task/add/",
//     data: {
//         'task-name': $('#task-name').val()
//     },
//     dataType: "text",
//     cache: false,
//     success: function (data) {
//         alert("OK");
//         return true;
//     }
// });

var tasks = {};

$(document).ready(function() {
    var taskForm = $('#task-form');

    taskForm.submit(function(event) {
        event.preventDefault();
        var formData = $(this).serializeArray();
        // console.log(formData);

        var formDataArr = [];
        for (key in formData){
            formDataArr[formData[key]['name']] = formData[key]['value'];
        }

        console.log(formDataArr);
        var randomId = Math.round(Math.random()*100000);
        tasks[randomId] = formDataArr;
        console.log(tasks);
        



        var thisURL = taskForm.attr("data-url") || window.location.href;  // or set your own url
        console.log(thisURL);

        $.ajax({
                method: "POST",
                url: thisURL,
                // url: "/task/add/",
                data: formData,
                success: handleFormSuccess,
                error: handleFormError,
            })
            function handleFormSuccess(data, textStatus, jqXHR){
                console.log(data)
                console.log(textStatus)
                console.log(jqXHR)
                drawTask(randomId);
                console.log(this.url);
                $('#modal-add-task').modal('hide');
                // $('.task-panel').load(this.url, '#task-panel');
                taskForm[0].reset(); // reset form data
            }

            function handleFormError(jqXHR, textStatus, errorThrown){
                console.log(jqXHR)
                console.log(textStatus)
                console.log(errorThrown)
            }




    });

    function drawTask(taskId){
        var div = document.createElement('div');
        div.className = 'card bg-light text-dark';
        div.setAttribute('data', taskId);

        var divCard = document.createElement('div');
        divCard.className = 'card-body';
        divCard.setAttribute('data', taskId);
        divCard.innerHTML = tasks[taskId]['name'];
        
        div.append(divCard);
        $('#task-panel').prepend(div);
    }

    // setInterval(function () {
    //     $.ajax({
    //         url: "http://127.0.0.1:8000/task/json/",
    //         type: 'POST',
    //         data: {'check': true},
            
    //         success: function (data) {
               
    //             var obj = JSON.parse(data)
    //             console.log(obj[0]['fields'])
    //             // var arr =[];
    //             // for( var i in obj) {
    //             //     arr.push(obj[i]);
    //             // }
    //             // console.log(arr)

    //             // // var arr = Object.keys(obj).map(function (key) { return obj[key]; });
    //             // console.log(arr)
    //             // console.log(JSON.parse(data))
    //             // if (json.tasks) {
    //             //     // $('#notify_icon').addClass("notification");
    //             //     // var doc = $.parseHTML(json.notifications_list);
    //             // $('#task-panel').html(obj);


    //             $( "div#task-panel" ).html(function() {
    //                 for( var i in obj) {
    //                     var task = obj[0]['fields']['name']

    //                     $("#task-name").append("<p>" + task + "</p>");
    //                 }


    //                 // return "<div class='row task-panel'>"+
    //                 //         "<div class='card' style='width: 20rem;'>"+
    //                 //         "<div class='card-body'><h4 class='card-title'>" + task + 
    //                 //         "</h4></div></div></div>";
    //             });


    //             var collection = $("div#task-panel");
    //             for( var i in obj) {
    //                 var task = obj[0]['fields']['name']
    //                 collection = collection.add($(".card"));
    //                 $("#task-panel.task-name").append("<p>" + task + "</p>");
    //             }


    //             // }
    //         }
    //     });
    //     // console.log($('#task-panel'));
    // }, 1000);

});