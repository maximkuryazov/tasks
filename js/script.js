$(function () {

    var URL = document.location + '/json/';
    var TaskJSON = {};
    var RatioJSON = {};
    $.ajax({

        url: URL + 'rating.json',
        async: false

    }).done(function (json) {
        RatioJSON = json;
    });

    var TaskView = Backbone.View.extend({
        render: function (json) {

            var $task = $('div.task').eq(0).remove();
            $('aside.leftPanel').empty();
            json.forEach(function (item, index) {

                $task = $task.clone();
                $task.attr('data-id', index).find('.title').html(item.title);
                $('aside.leftPanel').append($task);

            });
            $('aside.leftPanel').delegate('.task', 'click', function () {

                $('.content').html(json[Number($(this).data('id'))].description);
                $('.task').removeClass('active');
                $(this).addClass('active');
                $('.nav').removeClass('active');
                $('#task').addClass('active');
                appRouter.task();

            });

        }
    });
    var taskView = new TaskView();
    var TaskModel = Backbone.Model.extend({

        render: function (json) {
            taskView.render(json);
        },
        load: function(render, courseId) {

            var instanse = this;
            $.ajax({

                url: URL + 'task-' + courseId + '.json',
                async: false

            }).done(function (json) {

                TaskJSON = json;
                if (render) instanse.render(json);

            });

        }

    });
    var taskModel = new TaskModel();
    taskModel.load(true, 1);
    var TasksRouter = Backbone.Router.extend({

        routes: {
            '' : 'home',
            'task': 'task',
            'about': 'about',
            'rating': 'rating'
        },
        home: function () {
            appRouter.navigate('');
        },
        task: function () {

            appRouter.navigate('task');
            $('.nav').removeClass('active');
            $('#task').addClass('active');

        },
        about: function () {

            $.ajax({
                url: URL + 'about.json'
            }).done(function (json) {

                console.log(json);
                $('.content').empty();
                json.forEach(function (item, index) {

                    $('.content').append('<h3>' + item.title + '</h3>' + '<p />' + item.description + '<p />');
                    if (TaskJSON[0].video_available) {
                        $('.content').append('<button data-id="' + (index + 1) + '" class="watch-video">Смотреть видео</button>');
                    }

                });
                $('.watch-video').click(function() {

                    taskModel.load(true, $(this).attr('data-id'));
                    appRouter.task();
                    $('.task').eq(0).click();

                });
                $('.nav').removeClass('active');
                $('#about').addClass('active');

            });
            appRouter.navigate('about');

        },
        rating: function() {

            $('.content').empty();
            RatioJSON.forEach(function(item) {
                $('.content').append('Имя: ' + item.name + '<br />' + 'Позиция: <b>' + item.position + '</b><p />');
            });
            $('.nav').removeClass('active');
            $('#ratio').addClass('active');
            appRouter.navigate('rating');

        }

    });
    var appRouter = new TasksRouter();
    Backbone.history.start({ pushState: true });

    $nav = $('.nav');
    $nav.click(function () {

        $nav.removeClass('active');
        $(this).addClass('active');

    });
    $('#about').click(appRouter.about);
    $('#ratio').click(appRouter.rating);
    $('.task').eq(0).click();
    $('#task').click(appRouter.task);

});