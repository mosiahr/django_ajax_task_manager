$(document).ready(function() {

    var catUrl = '/task/json/category/';

    //add error class into login page
    $(".errorlist").addClass('alert alert-danger')


    // Call datepicker
    $('.datepicker').datepicker({});


    // Add Task
    var taskForm = $('#task-form');

    taskForm.submit(function(event) {
        event.preventDefault();
        var formData = $(this).serializeArray();
        var formDataArr = [];

        for (key in formData){
            formDataArr[formData[key]['name']] = formData[key]['value'];
        }

        var thisURL = taskForm.attr("data-url") || window.location.href;  // or set your own url

        $.ajax({
                method: "POST",
                url: thisURL,
                data: formData,
            })
            .done(function(data) {
                $('#modal-add-task').modal('hide');
                taskForm[0].reset(); // reset form data
                console.log(data.gueryset);
                setTaskDraw();
            })
            .fail(function(data) {
                console.log("error");
                console.log(data);

                if (data.status === 400) {
                    errMsg = data.responseJSON['__all__'];
                    var modal = $('#modal-error-all');
                    modal.modal('show');
                    $('#modal-error').text(errMsg);
                }
                categoryForm[0].reset(); // reset form data
            })
    });

    var buttonAddTask = $('#add-task');
    buttonAddTask.click(function(event) {
        

        selectCat = taskForm.find('#id_category');
        selectCat.empty();

        var arrGetCat = getCategoryOrMark('/task/json/category/');
        selectCat.append($("<option>").attr('value', '').text('----------'));
        for (key in arrGetCat) {
            selectCat.append($("<option>").attr('value', key).text(arrGetCat[key]['name']))
        }

        selectMark = taskForm.find('#id_mark');
        selectMark.empty();

        var arrGetMark = getCategoryOrMark('/task/json/mark/');
        selectMark.append($("<option>").attr('value', '').text('----------'));

        for (key in arrGetMark) {
            selectMark.append($("<option>").attr('value', key).text(arrGetMark[key]['name']))
        }
    });


    


   

    function setTaskDraw(){
        $.ajax({
            url: '/task/json/',
            type: 'POST',
            async: false,
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

    function setCategoryOrMarkDraw(){
        $.ajax({
            url: '/task/json/category/',
            type: 'POST',
            async: false,
        })
        .done(function(data) {
            var obj = JSON.parse(data);
            var objArr = [];
            for (key in obj){
                objArr[obj[key]['pk']] = obj[key]['fields'];
            }
            drawCategoryOrMark((objArr.length-1), objArr);
        })
        .fail(function() {
            console.log("error");
        })
    }

    
    //TASK DELETE
    taskDelLink = $('#task-panel a')
    taskDelLink.click(function(event) {
        event.preventDefault();
        console.log(event)
        var id = event.target.id
        console.log(id)

        $.ajax({
            url: '/task/del/ajax/',
            type: 'POST',
            // async: false,
            data: {'id': id }
        })
        .done(function(data) {
            console.log('done')
            console.log(data)
            drawTasks();
        })
        .fail(function() {
            console.log("error");
        })
    });



    // function drawCategoryOrMark(catId, categories){
    //     var div = document.createElement('div');
    //     div.className = 'form-check';
    //     div.setAttribute('data', catId);

    //     var input = document.createElement('input');
    //     input.className = 'form-check-input';
    //     input.type = 'checkbox';
    //     input.id = 'cat-' + catId;

    //     var label = document.createElement('label');
    //     label.className = 'form-check-label';
    //     label.for = 'cat-' + categories[catId]['name'];
    //     label.innerHTML = categories[catId]['name'];

    //     var hr = document.createElement('hr');

    //     div.append(input);
    //     div.append(label);
    //     div.append(hr);

    //     $('#category-panel').prepend(div);
    // }

    function drawCategoryOrMark(catId, categories){
        var div = $('.nav');
        var link = document.createElement('a');
        link.className = 'btn btn-sm btn-outline-secondary mt-1 mb-1';
        link.id = 'cat-' + catId;
        link.href = '#';
        link.innerHTML = categories[catId]['name'];

        div.append(link);

        $('#category-panel').append(div);
    }


    //FILTER (change checkbox category and mark)
    var checkboxFormCheck = $( ".form-check input:checkbox" );
    checkboxFormCheck.change(function(event) {
        var catIdArr = []
        var isCat = false;
        var isMark = false; 
        var arrChecked = jQuery.grep(checkboxFormCheck, function( e ) {
                return ( e.checked == true );
            });
        console.log('arrChecked', arrChecked)

        if (this.checked) {
            for (k in arrChecked){
                if (arrChecked[k].id.search('cat') == 0){
                    isCat = true;
                }
                if (arrChecked[k].id.search('mark') == 0){
                    isMark = true;
                }
            }
            console.log(isCat, isMark)
            console.log(arrChecked)
            for (key in arrChecked){
                // catIdArr.push(parseInt(arrChecked[key].id.replace('cat-', '').replace('mark-', '')));
                catIdArr.push(arrChecked[key].id);
            }
            drawTaskAll(catIdArr, isCat, isMark);
        } else {
            for (k in arrChecked){
                if (arrChecked[k].id.search('cat') == 0){
                    isCat = true;
                }
                if (arrChecked[k].id.search('mark') == 0){
                    isMark = true;
                }
            }
            console.log(isCat, isMark)
            console.log(arrChecked)
            for (key in arrChecked){
                // catIdArr.push(parseInt(arrChecked[key].id.replace('cat-', '').replace('mark-', '')));
                catIdArr.push(arrChecked[key].id);
            }
            drawTaskAll(catIdArr, isCat, isMark);
        }
    });

    function drawTaskAll(elemIdArr, isCat, isMark){
        $.ajax({
                url: '/task/json/',
                type: 'POST',
                async: false,
            })
            .done(function(data) {
                var obj = JSON.parse(data);
                var objArr = [];

                console.log('elemIdArr: ', elemIdArr)
                console.log('obj: ', obj)
                for (key in obj){
                    if (elemIdArr.length > 0) {
                        for (k in elemIdArr){
                            if (obj[key]['fields']['category'] == parseInt(elemIdArr[k].replace('cat-', ''))){
                                objArr[obj[key]['pk']] = obj[key]['fields'];
                            }
                            if (obj[key]['fields']['mark'] == parseInt(elemIdArr[k].replace('mark-', ''))){
                                objArr[obj[key]['pk']] = obj[key]['fields'];
                            }
                        }
                    } else {
                        // All checkbox empty
                        objArr[obj[key]['pk']] = obj[key]['fields'];
                    }
                }
                $('#task-panel').empty();

                console.log(objArr)
                var arrChecked = jQuery.grep(checkboxFormCheck, function( e ) {
                    return ( e.checked == true );
                });

                // for (key in objArr){
                //     if (isCat === true && isMark === true) { 
                //         console.log(objArr[key])
                //     }
                // }

                for (key in objArr){
                    drawTask(key, objArr);
                }
            })
            .fail(function() {
                console.log("error");
            });
    }


    function getCategoryOrMark(url){
        var objArr = {};

        $.ajax({
            url: url,
            type: 'POST',
            async: false,
        })
        .done(function(data) {
            var obj = JSON.parse(data);
            for (key in obj){
                objArr[obj[key]['pk']] = obj[key]['fields'];
            }
        })
        .fail(function() {
            console.log("error");
        });
        return objArr
    }



    function drawTasks(elemId){
        $.ajax({
                url: '/task/json/',
                type: 'POST',
                async: false,
            })
            .done(function(data) {
                var obj = JSON.parse(data);
                var objArr = [];

                console.log('elemId: ', elemId)
                console.log('obj: ', obj)
                for (key in obj){
                    if (elemId) {
                        if (obj[key]['fields']['category'] == parseInt(elemId.replace('cat-', ''))){
                            objArr[obj[key]['pk']] = obj[key]['fields'];
                        }
                        if (obj[key]['fields']['mark'] == parseInt(elemId.replace('mark-', ''))){
                            objArr[obj[key]['pk']] = obj[key]['fields'];
                        }
                    } else {
                        // All checkbox empty
                        objArr[obj[key]['pk']] = obj[key]['fields'];
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


    // CATEGORY
    function getCat(){
        var navCat = $( ".nav a" );
        console.log(navCat)
        navCat.click(function(event) {
            event.preventDefault();

            console.log(event)
            navCat.removeClass('active');
            $(event.target).addClass('active');

            drawHeader(event.target.id)
            drawTasks(event.target.id)
        });
    }
    getCat();

    function drawHeader(idCat){
        $(".task-header").empty();
        cats = getCategoryOrMark(catUrl);
        for (key in cats) {
            if (parseInt(key) == parseInt(idCat.replace('cat-', ''))){
                $(".task-header").append('Task List: ' + cats[key]['name']).show();
            }
        }
    }

    // CREATE CATEGORY
    var modalCat = $('#modal-add-category');
    modalCat.on('shown.bs.modal', function() {
        $(this).find('[autofocus]').focus();
    });

    var categoryForm = $('#category-form');
    categoryForm.submit(function(event) {
        event.preventDefault();

        var formDataCompany = $(this).serializeArray();
        var formDataArr = {};

        for (key in formDataCompany){
            formDataArr[formDataCompany[key]['name']] = formDataCompany[key]['value'];
        }

        var thisURL = categoryForm.attr("data-url");  // or set your own url

        $.ajax({
                method: "POST",
                url: thisURL,                 // '/task/add/category/'
                data: formDataCompany,
            })
            .done(function(data) {
                $('#modal-add-category').modal('hide');
                categoryForm[0].reset(); // reset form data
                // drawCatList();

                var id    = data['id'], 
                    // name capitalize
                    name  = formDataArr['name'].toLowerCase().replace(/^(.)/g, function(letter) {
                        return letter.toUpperCase();
                    });

                //Draw mark data
                var div = $('.nav')
                var link = document.createElement('a');
                link.className = 'btn btn-sm btn-outline-secondary mt-1 mb-1';
                link.id = 'cat-' + id;
                link.href = '#';
                link.innerHTML = name;
                div.prepend(link);
                getCat();
            })
            .fail(function(data) {
                var errorMsg;
                console.log("error");
                console.log(data);

                if (data.status === 400) {
                    errMsg = data.responseJSON['name'];
                }

                var modal = $('#modal-error-all');
                modal.modal('show');
                console.log($('#modal-error'));
                $('#modal-error').text(errMsg);
                categoryForm[0].reset(); // reset form data
            })
    });



    // function drawCatList(){
    //     $.ajax({
    //         url: '/task/json/category/',
    //         type: 'POST',
    //         async: false,
    //         data: {'check': true }
    //     })
    //     .done(function(data) {
    //         var obj = JSON.parse(data);
    //         var objArr = [];
    //         for (key in obj){
    //             objArr[obj[key]['pk']] = obj[key]['fields'];
    //         }
    //         console.log('objArr', objArr);
    //         $('#category-panel').empty();

    //         for (key in objArr){
    //             var div = document.createElement('div');
    //             div.className = 'nav flex-column nav-pills';

    //             var link = document.createElement('a');
    //             link.className = 'btn btn-sm btn-outline-secondary mt-1 mb-1';
    //             link.id = 'cat-' + key;
    //             link.href = '#';
    //             link.innerHTML = objArr[key]['name'];

    //             div.append(link);
    //             $('#category-panel').prepend(div);
    //         }
    //     })
    //     .fail(function() {
    //         console.log("error");
    //     })
    // }




    // MARK CREATE
    var markForm = $('#mark-form');
    markForm.submit(function(event) {
        event.preventDefault();

        var formDataMark = $(this).serializeArray(),
            thisURL = markForm.attr("data-url"),
            formDataArr = {};

        for (key in formDataMark){
            formDataArr[formDataMark[key]['name']] = formDataMark[key]['value'];
        }

        $.ajax({
                method: "POST",
                url: thisURL,                 // '/task/add/mark/'
                data: formDataMark
            })
            .done(function(data) {
                var id    = data['id'], 
                    // name capitalize
                    name  = formDataArr['name'].toLowerCase().replace(/^(.)/g, function(letter) {
                        return letter.toUpperCase();
                    });

                markForm[0].reset(); // reset form data

                //Draw mark data
                var div = document.createElement('div');
                div.className = 'form-check';

                var input = document.createElement('input');
                input.className = 'form-check-input';
                input.type = 'checkbox';
                input.id = 'mark-' + id;

                var label = document.createElement('label');
                label.className = 'form-check-label';
                label.setAttribute('for', 'mark-' + id);
                label.innerHTML = name;

                var hr = document.createElement('hr');

                div.append(input);
                div.append(label);
                div.append(hr);

                $('#mark-panel').prepend(div);
            })
            .fail(function(data) {
                var errorMsg;
                console.log("error");

                if (data.status === 400) {
                    errMsg = data.responseJSON['name'];
                }

                var modal = $('#modal-error-all');
                modal.modal('show');
                $('#modal-error').text(errMsg);
                markForm[0].reset(); // reset form data

            })
    });





});