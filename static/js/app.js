/**
 * Created with PyCharm.
 * User: adekola
 * Date: 11/4/13
 * Time: 3:21 PM
 * To change this template use File | Settings | File Templates.
 */

(function($){

    $('#submit').click(
        function(event){
            event.preventDefault();

//            var contestants = [
//                {
//                name: $('#name1').val(),
//                img: $('#img1').val()
//                 },
//                {
//                   name: $('#name2').val(),
//                    img: $('#img2').val()
//                },
//                {
//                   name: $('#name3').val(),
//                    img: $('#img3').val()
//                }
//            ];

            //contestants: contestants
            var data={
                title: $('#title').val(),
                desc: $('#desc').val(),
                user: $('#user').val()
            };

           var json_data = JSON.stringify(data);
         $.ajax({
                cache: false,
                url: "http://" + window.location.host+"/api/polls/",
                data: json_data,
                dataType: 'json',
                type: 'POST',
                success: function (json) {
                    return_data = JSON.stringify(json);
                    $('#form').fadeOut();
                    $('#success').append("<p>" + return_data + "</p>");
                },
                fail: function (json) {
                    $('#fail').show();
                }
            });

        }
    );
})(jQuery);