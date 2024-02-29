/*=========================================================================================
    File Name: app-user-list.js
    Description: User List page
    --------------------------------------------------------------------------------------
    Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
    Author: PIXINVENT
    Author URL: http://www.themeforest.net/user/pixinvent

==========================================================================================*/
$(function () {
    'use strict';
    var theLanguage = $('html').attr('lang');
    var $languageList = JSON.parse($('#language-list').val() ?? '{}');
    var api = $('#api').val() ?? 'cabinet/populars-list';
    var dtUserTable = $('.user-list-table'),
        statusObj = {
            1: {title: 'Respublika', class: 'badge-light-warning'},
            2: {title: 'Viloyat', class: 'badge-light-success'},
            3: {title: 'Tuman yoki Shahar', class: 'badge-light-secondary'}
        };

    var assetPath = '../../../app-assets/';
    if ($('body').attr('data-framework') === 'laravel') {
        assetPath = $('body').attr('data-asset-path');
    }

    // Users List datatable
    if (dtUserTable.length) {
       var in_dtb= dtUserTable.DataTable({
           responsive: true,
           processing: true,
           serverSide: true,
           ajax: api, // JSON ajax to add data
            // serverSide: true,
            //  processing: true,
            columns: [
                // columns according to JSON
                {data: 'id'},
                {data: 'title'},
                {data: 'full_name'},
                {data: 'type'},
                {data: 'ratings_avg'},
                {data: 'popular_status'},
                {data: 'id'}
            ],
            columnDefs: [
                {
                    // For Responsive
                    className: 'control',
                    searchable: false,
                    orderable: false,
                    responsivePriority: 2,
                    targets: 0
                },
                {
                    // Popular title
                    targets: 1,
                    responsivePriority: 4,
                    render: function (data, type, full, meta) {
                        var $name = full['title'],
                            $uname = full['science_group'];
                        var $science = full['science'];
                        var $group = full['group'];
                        // For Avatar badge
                        var stateNum = Math.floor(Math.random() * 6) + 1;
                        var states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'];
                        var $state = states[stateNum],
                            $name = full['title'],
                            $initials = $name.match(/\b\w/g) || [];
                        $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();

                        // Creates full output for row
                        var $row_output =
                            '<div class="d-flex justify-content-left align-items-center">' +
                            '<div class="d-flex flex-column">' +
                            '<a href="/populars/' +
                            full['id'] +
                            '" class="user_name text-truncate"><span class="font-weight-bold">' +
                            $name +
                            '</span></a>' +
                            '<small class="emp_post text-muted">' +
                            $uname +
                            '</small>' +
                            '</div>' +
                            '<div class="group hidden">\n' +
                            $group +
                            '</div>\n' +
                            '<div class="science hidden">\n' +
                            $science +
                            '</div>' +
                            '<div class="subject hidden">\n' +
                            full['title'] +
                            '</div>' +
                            '</div>';
                        return $row_output;
                    }
                },
                {
                    // User full name and username
                    targets: 2,
                    responsivePriority: 4,
                    render: function (data, type, full, meta) {
                        var $name = full['full_name'],
                            $uname = full['address'],
                            $image = full['avatar'];
                        if ($image) {
                            // For Avatar image
                            var $output =
                                '<img src="' + $image + '" alt="Avatar" height="32" width="32">';
                        } else {
                            // For Avatar badge
                            var stateNum = Math.floor(Math.random() * 6) + 1;
                            var states = ['success', 'danger', 'warning', 'info', 'dark', 'primary', 'secondary'];
                            var $state = states[stateNum],
                                $name = full['full_name'],
                                $initials = $name.match(/\b\w/g) || [];
                            $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();
                            $output = '<span class="avatar-content">' + $initials + '</span>';
                        }
                        var colorClass = $image === '' ? ' bg-light-' + $state + ' ' : '';
                        // Creates full output for row
                        var $row_output =
                            '<div class="d-flex justify-content-left align-items-center">' +
                            '<div class="avatar-wrapper">' +
                            '<div class="avatar ' +
                            colorClass +
                            ' mr-1">' +
                            $output +
                            '</div>' +
                            '</div>' +
                            '<div class="d-flex flex-column">' +
                            '<a href= "/user/view/' +
                            full['user_id'] +
                            '" class="user_name text-truncate"><span class="font-weight-bold">' +
                            $name +
                            '</span></a>' +
                            '<small class="emp_post text-muted">' +
                            $uname +
                            '</small>' +
                            '</div>' +
                            '</div>';
                        return $row_output;
                    }
                },
                {
                    // Post type
                    targets: 3,
                    render: function (data, type, full, meta) {
                        var $type = full['type'];
                        var avatar = {
                            guide: feather.icons['book-open'].toSvg({class: 'font-medium-3 text-primary'}),
                            project: feather.icons['bookmark'].toSvg({class: 'font-medium-3 text-primary'}),
                            media: feather.icons['youtube'].toSvg({class: 'font-medium-3 text-primary'}),
                        };
                        var $output;
                        switch ($type) {
                            case 'guide':
                                $output = $languageList['Guide'] ?? 'O\'quv qo\'llanma';
                                break;
                            case 'project':
                                $output = $languageList['Project'] ?? 'Dars ishlanma';
                                break;
                            case 'media':
                                $output = $languageList['Media'] ?? 'Video yoki Audio dars';
                                break;
                        }
                        return ' <div class="d-flex align-items-center">\n' +
                            '                      <div class="avatar bg-light-primary me-1">\n' +
                            '                        <div class="avatar-content">\n' +
                            avatar[$type] +
                            '                        </div>\n' +
                            '                      </div>\n' +
                            '                      <span>' + $output + '</span>\n' +
                            '                    </div>'
                    }
                },
                {
                    // rating
                    targets: 4,
                    render: function (data, type, full, meta) {
                        var rating = full['ratings_avg'];
                        var stars = full['rating']
                        var t = "rtl" === $("html").attr("data-textdirection")
                            , l = $("#posRatingId" + full['id']);
                        l.rateYo({
                            maxValue: 10,
                            numStars: 10,
                            rating: stars,
                            readOnly: true,
                            starWidth: "20px",
                            rtl: t
                        });
                        if (rating > 999)
                            rating = Math.round(rating / 1000) + 'k';
                        if (rating > 999999)
                            rating = Math.round(rating / 1000000) + 'm';
                        return (
                            '<div class="d-flex flex-column">\n' +
                            '<span class="fw-bolder mb-25 text-center">' +
                            rating + '</span>\n' + '<div class="ratings-post" data-starts="' + full['stars'] + '"></div>\n' +
                            '<span class="read-only-ratings m-lg-auto" id="posRatingId' + full['id'] + '"></span><span class="font-small-2 text-muted m-lg-auto">' + full['rating_info'] + '</span>\n' +
                            '</div>'
                        );
                    }
                },
                {
                    // Actions
                    targets: -1,
                    //title: 'Посмотреть',
                    orderable: false,
                    render: function (data, type, full, meta) {
                        if ($languageList['View'] === undefined)
                            $languageList['View'] = 'Посмотреть';
                        return (
                            '<a class="btn btn  btn-success btn-sm waves-effect waves-light  " href="/populars/' +
                            full['id'] +
                            '" >' +
                            feather.icons['eye'].toSvg({class: 'font-small-4 mr-50'}) + $languageList['View'] +
                            '</a>' +
                            '</div>'
                        );
                    }
                }
            ],
            order: [[4, 'desc']],
            dom:
                '<"d-flex justify-content-between align-items-center header-actions mx-1 row mt-75"' +
                '<"col-lg-12 col-xl-6" l>' +
                '<"col-lg-12 col-xl-6 pl-xl-75 pl-0"<"dt-action-buttons text-xl-right text-lg-left text-md-right text-left d-flex align-items-center justify-content-lg-end align-items-center flex-sm-nowrap flex-wrap mr-1"<"mr-1"f>>>' +
                '>t' +
                '<"d-flex justify-content-between mx-2 row mb-1"' +
                '<"col-sm-12 col-md-6"i>' +
                '<"col-sm-12 col-md-6"p>' +
                '>',
            language: {
                sLengthMenu: 'Show _MENU_',
                search: $languageList['Search'] ?? 'Qidirish',
                searchPlaceholder: $languageList['Search'] + '...' ?? 'Qidirish...'
            },

            language: {
                paginate: {
                    // remove previous & next text from pagination
                    previous: '&nbsp;',
                    next: '&nbsp;'
                }
            },
            language: {
                url: "/data/Uzbek.json"
            },
            initComplete: function () {
            }
        });
        in_dtb.on( 'order.dt search.dt', function () {
            in_dtb.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                cell.innerHTML = i+1;
            } );
        } ).draw();
    }


    // To initialize tooltip with body container
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: 'body'
    });
});
