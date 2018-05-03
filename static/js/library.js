$(document).ready(function() {

    //add error class into login page
    $(".errorlist").addClass('alert alert-danger');

    // Call datepicker
    $('.datepicker').datepicker({});


    // CREATE TASK
    var taskForm = $('#task-form');
    taskForm.submit(function(event) {
        event.preventDefault();
        var formData = $(this).serializeArray();
        var formDataArr = {};

        for (var key in formData){
            formDataArr[formData[key]['name']] = formData[key]['value'];
        }

        var thisURL = taskForm.attr("data-url") || window.location.href;  // or set your own url
        $.ajax({
                method: "POST",
                url: thisURL,
                data: formData
            })
            .done(function(data) {
                $('#modal-add-task').modal('hide');
                taskForm[0].reset(); // reset form data
                drawT(data);
                forTaskDel();
                $('.nav-category a.active').removeClass('active');
                $('.nav-mark a.active').removeClass('active');

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
                taskForm[0].reset(); // reset form data
            })
    });

    var buttonAddTask = $('#add-task');
    buttonAddTask.click(function(event) {
        var selectCat = taskForm.find('#id_category');
        selectCat.empty();

        var arrGetCat = getCategoryOrMark('/task/json/category/');
        selectCat.append($("<option>").attr('value', '').text('----------'));
        for (var key in arrGetCat) {
            selectCat.append($("<option>").attr('value', key).text(arrGetCat[key]['name']))
        }

        var selectMark = taskForm.find('#id_mark');
        selectMark.empty();

        var arrGetMark = getCategoryOrMark('/task/json/mark/');
        selectMark.append($("<option>").attr('value', '').text('----------'));

        for (var k in arrGetMark) {
            selectMark.append($("<option>").attr('value', k).text(arrGetMark[k]['name']))
        }

        var performer = taskForm.find('#id_performer');
        performer.empty();

        var arrGetPerformer = getCategoryOrMark('/task/json/user/');
        for (var k in arrGetPerformer) {
            performer.append($("<option>").attr('value', k).text(arrGetPerformer[k]['username']))
        }

    });


    function drawT(data){
        $('#task-panel').empty();
        for (var key in data){
            var performersArr = data[key]['performer'];
            var performers = performersArr.map(obj=>{
                return obj.username
            }).join(', ');

            var d = {
                name: data[key]['name'],
                description: data[key]['description'],
                author: data[key]['author']['username'],
                get_performer: performers,
                deadline: data[key]['deadline'],
                id: data[key]['id'],
            }

            var template = [
                '<div class="card bg-light text-dark mb-3">',
                    '<div id="task-name" class="card-header bg-transparent">{{ name }}</div>',
                    '<ul class="list-group list-group-flush">',
                        '<li id="task-description" class="list-group-item">{{ description }}</li>',
                        '<li id="task-author" class="list-group-item">Author: {{ author }}</li>',
                        '<li id="task-performer" class="list-group-item">Performers: {{ get_performer }}</li>',
                    '</ul>',
                    '<div class="card-footer">',
                        '<span id="task-deadline">Deadline: {{ deadline }}</span>',
                        '<a href="#" id="{{ id }}"  class="card-link float-right">Delete</a>',
                    '</div>',
                '</div>'
            ].join("\n");

            var html = Mustache.render(template, d);
            $( "#task-panel" ).append(html);
        }
    }

    //TASK DELETE
    function forTaskDel(){
        var taskDelLink = $('#task-panel a');
        taskDelLink.click(function(event) {
            event.preventDefault();
            var id = event.target.id;

            $.ajax({
                url: '/task/del/ajax/',
                type: 'POST',
                data: {'id': id }
            })
            .done(function(data) {
                drawT(data);
                forTaskDel();
                $('.nav-category a.active').removeClass('active');
                $('.nav-mark a.active').removeClass('active');
            })
            .fail(function() {
                console.log("error");
            })
        });
    }
    forTaskDel();


    function getCategoryOrMark(url){
        var objArr = {};

        $.ajax({
            url: url,
            type: 'POST',
            async: false
        })
        .done(function(data) {
            var obj = JSON.parse(data);
            for (var key in obj){
                objArr[obj[key]['pk']] = obj[key]['fields'];
            }
        })
        .fail(function() {
            console.log("error");
        });
        return objArr
    }


    // CATEGORY CLICK
    function getCat(){
        var navCat = $( ".nav-category a" );
        navCat.click(function(event) {
            event.preventDefault();
            navCat.removeClass('active');
            $(event.target).addClass('active');

            var url;
            if ($('.nav-mark a.active')[0] != undefined ){
                var mark = $('.nav-mark a.active')[0].id;
                url = '/api/tasks/?category=' + String(event.target.id.replace('cat-', '')) +
                '&mark=' + String(mark.replace('mark-', ''));
            }else{
                url = '/api/tasks/?category=' + String(event.target.id.replace('cat-', ''));
            }

            $.ajax({
                url: url,
                type: 'GET',
                async: false
            })
            .done(function(data) {
                // $('.nav-category a.active').removeClass('alert')
                // $(".task-header").empty();
                // if (typeof  data[0] != 'undefined'){
                //     if ($(".task-header").hasClass('alert-danger')){
                //         $(".task-header").removeClass('alert-danger');
                //         $(".task-header").addClass('alert-success');
                //     }
                //     $(".task-header")
                //     .append('Task List: ' + data[0]['category']['name'] + ' (' + data.length +')')
                //     .show();
                // }else {
                //     if ($(".task-header").hasClass('alert-success')){
                //         $(".task-header").removeClass('alert-success');
                //         $(".task-header").addClass('alert-danger');
                //     }
                //     $(".task-header").append('Task List EMPTY').show();
                // }
                drawT(data);
                forTaskDel();
            })
            .fail(function() {
                console.log("error");
            });
        });
    }
    getCat();


    // CREATE CATEGORY
    var categoryForm = $('#category-form');
    categoryForm.submit(function(event) {
        event.preventDefault();

        var formDataCompany = $(this).serializeArray();
        var formDataArr = {};

        for (var key in formDataCompany){
            formDataArr[formDataCompany[key]['name']] = formDataCompany[key]['value'];
        }

        var thisURL = categoryForm.attr("data-url");  // or set your own url

        $.ajax({
                method: "POST",
                url: thisURL,                 // '/task/add/category/'
                data: formDataCompany
            })
            .done(function(data) {
                categoryForm[0].reset(); // reset form data

                var id    = data['id'], 
                    // name capitalize
                    name  = formDataArr['name'].toLowerCase().replace(/^(.)/g, function(letter) {
                        return letter.toUpperCase();
                    });

                //Draw mark data
                var div = $('.nav-category')
                var link = document.createElement('a');
                link.className = 'btn btn-sm btn-outline-secondary mt-1 mb-1';
                link.id = 'cat-' + id;
                // link.href = '#';
                link.innerHTML = name;
                div.prepend(link);
                getCat();
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
                categoryForm[0].reset(); // reset form data
            })
    });


    // MARK CREATE
    var markForm = $('#mark-form');
    markForm.submit(function(event) {
        event.preventDefault();

        var formDataMark = $(this).serializeArray();
        var formDataArr = {};

        for (var key in formDataMark){
            formDataArr[formDataMark[key]['name']] = formDataMark[key]['value'];
        }

        var thisURL = markForm.attr("data-url");  // or set your own url

        $.ajax({
                method: "POST",
                url: thisURL,                 // '/task/add/mark/'
                data: formDataMark
            })
            .done(function(data) {
                markForm[0].reset(); // reset form data

                var id    = data['id'],
                    // name capitalize
                    name  = formDataArr['name'].toLowerCase().replace(/^(.)/g, function(letter) {
                        return letter.toUpperCase();
                    });

                //Draw mark data
                var div = $('.nav-mark')
                var link = document.createElement('a');
                link.className = 'btn btn-sm btn-outline-secondary mt-1 mb-1';
                link.id = 'mark-' + id;
                // link.href = '#';
                link.innerHTML = name;
                div.prepend(link);
                getMark();
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


    // MARK CLICK
    function getMark(){
        var navMark = $( ".nav-mark a" );
        navMark.click(function(event) {
            event.preventDefault();
            navMark.removeClass('active');
            $(event.target).addClass('active');

            var url;
            if ($('.nav-category a.active')[0] != undefined ){
                var cat = $('.nav-category a.active')[0].id;
                url = '/api/tasks/?category=' + String(cat.replace('cat-', '')) +
                '&mark=' + String(event.target.id.replace('mark-', ''));
            }else{
                url = '/api/tasks/?mark=' + String(event.target.id.replace('mark-', ''));
            }

            $.ajax({
                url: url,
                type: 'GET',
                async: false
            })
            .done(function(data) {
                // $(".task-header").empty();
                // if (typeof  data[0] != 'undefined'){
                //     if ($(".task-header").hasClass('alert-danger')){
                //         $(".task-header").removeClass('alert-danger');
                //         $(".task-header").addClass('alert-success');
                //     }
                //     $(".task-header")
                //     .append('Task List: ' + data[0]['mark']['name'] + ' (' + data.length +')')
                //     .show();
                // }else {
                //     if ($(".task-header").hasClass('alert-success')){
                //         $(".task-header").removeClass('alert-success');
                //         $(".task-header").addClass('alert-danger');
                //     }
                //     $(".task-header").append('Task List EMPTY').show();
                // }
                drawT(data);
                forTaskDel();
            })
            .fail(function() {
                console.log("error");
            });
        });
    }
    getMark();
});