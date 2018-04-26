$(document).ready(function() {
    // Add Task
    var taskForm = $('#task-form');

    taskForm.submit(function(event) {
        event.preventDefault();
        var formData = $(this).serializeArray();
        // console.log(formData);

        var formDataArr = [];
        for (key in formData){
            formDataArr[formData[key]['name']] = formData[key]['value'];
        }

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
            // drawTask(randomId);
            console.log(this.url);
            $('#modal-add-task').modal('hide');
            taskForm[0].reset(); // reset form data

            setTaskDraw();
        }

        function handleFormError(jqXHR, textStatus, errorThrown){
            console.log(jqXHR)
            console.log(textStatus)
            console.log(errorThrown)
        }

    });

    // Add category
    var categoryForm = $('#category-form');

    categoryForm.submit(function(event) {
        event.preventDefault();
        var formDataCompany = $(this).serializeArray();
        console.log(formDataCompany);

        var formDataArr = [];
        for (key in formDataCompany){
            formDataArr[formDataCompany[key]['name']] = formDataCompany[key]['value'];
        }
        console.log(formDataArr);

        var thisURL = categoryForm.attr("data-url");  // or set your own url
        console.log(thisURL);

        $.ajax({
                method: "POST",
                url: thisURL,    // '/task/add/category/'
                data: formDataCompany,
                success: handleFormSuccess,
                error: handleFormError,
            })

        function handleFormSuccess(data, textStatus, jqXHR){
            console.log(data)
            console.log(textStatus)
            console.log(jqXHR)
            $('#modal-add-category').modal('hide');
            categoryForm[0].reset(); // reset form data

            setCategoryDraw();
        }

        function handleFormError(jqXHR, textStatus, errorThrown){
            console.log(jqXHR)
            console.log(textStatus)
            console.log(errorThrown)
        }

    });

    function drawTask(taskId, tasks){
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

    function setTaskDraw(){
        $.ajax({
            url: '/task/json/',
            type: 'POST',
            async: false,
            data: {'check': true },
        })
        .done(function(data) {
            var obj = JSON.parse(data);
            var objArr = [];
            for (key in obj){
                objArr[obj[key]['pk']] = obj[key]['fields'];
            }
            drawTask((objArr.length-1), objArr);
        })
        .fail(function() {
            console.log("error");
        })
    }

    function setCategoryDraw(){
        $.ajax({
            url: '/task/json/category/',
            type: 'POST',
            async: false,
            // dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
            data: {'check': true },
        })
        .done(function(data) {
            var obj = JSON.parse(data);
            var objArr = [];
            for (key in obj){
                objArr[obj[key]['pk']] = obj[key]['fields'];
            }

            drawCategory((objArr.length-1), objArr);
        })
        .fail(function() {
            console.log("error");
        })
    }

    function drawCategory(catId, categories){
        var div = document.createElement('div');
        div.className = 'form-check';
        div.setAttribute('data', catId);

        var input = document.createElement('input');
        input.className = 'form-check-input';
        input.type = 'checkbox';
        input.id = 'cat-' + catId;

        var label = document.createElement('label');
        label.className = 'form-check-label';
        label.for = 'cat-' + categories[catId]['name'];
        label.innerHTML = categories[catId]['name'];

        var hr = document.createElement('hr');

        div.append(input);
        div.append(label);
        div.append(hr);

        $('#category-panel').prepend(div);
    }


    //FILTER
    var checkboxCat = $( ".form-check input:checkbox" );
    checkboxCat.change(function(event) {
        var catId = event.target.id.replace('cat-', '');
        var catIdArr = []
        
        if (this.checked) {
            var arrChecked = jQuery.grep(checkboxCat, function( e ) {
                return ( e.checked == true );
            });
            for (key in arrChecked){
                catIdArr.push(parseInt(arrChecked[key].id.replace('cat-', '')));
            }
            drawTaskAll(catIdArr, false);
        } else {
            var arrChecked = jQuery.grep(checkboxCat, function( e ) {
                return ( e.checked == true );
            });
            for (key in arrChecked){
                catIdArr.push(parseInt(arrChecked[key].id.replace('cat-', '')));
            }
            drawTaskAll(catIdArr, false);
        }
    });

    function drawTaskAll(catIdArr, all=true){
        $.ajax({
                url: '/task/json/',
                type: 'POST',
                async: false,
                data: {'check': true },
            })
            .done(function(data) {
                var obj = JSON.parse(data);
                var objArr = [];

                for (key in obj){   
                    for (k in catIdArr){
                        if (obj[key]['fields']['category'] == catIdArr[k]){
                            objArr[obj[key]['pk']] = obj[key]['fields'];
                        }
                    }
                }
                $('#task-panel').empty();
                for (key in objArr){
                    drawTask(key, objArr);
                }
            })
            .fail(function() {
                console.log("error");
            });
    }
});