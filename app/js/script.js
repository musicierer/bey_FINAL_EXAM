$(function () {

        $('.bxslider').bxSlider({
            auto: true,
            autoControls: true
        });

        function grid() {
            var $grid = $('.grid');
            $grid.imagesLoaded(function () {
                $grid.masonry({
                    itemSelector: '.grid-item',
                    columnWidth: function( containerWidth ) {
                        return ( containerWidth / 3 - 10)
                    },
                    gutterWidth: 10
                });
            });
        }

        function search() {

            var $myKey = '2744718-383a7278676ceeda415525dcf';
                           
            $('.ideas').find('div').remove();
            var $searchKey = $('.search__field').val();

            $.ajax({

                url: 'https://pixabay.com/api/?key='+ $myKey +'&q='+ $searchKey +'&image_type=photo&pretty=true',
                dataType: 'jsonp',
                success: function (data) {

                    var $html = $('#container').html();
                    var $content = tmpl($html, data);
                    $('.ideas').append($content);
                    grid();
                },
                error: function () {
                    alert('Error!');
                }
            });
        }

        search();

        $('.search__button').on('click', function (e) {
            e.preventDefault();
            search();
            $('.search__field').val('');

        })

        $('.search__field').keypress(function () {
            if (event.keyCode === 13) {
            search();
            }
        });
    }
);
