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
    var api = $('#api').val() ?? 'admin/user-list';
    var $languageList = JSON.parse($('#language-list').val() ?? '{}');
    var dtUserTable = $('.user-list-table'),
        newUserSidebar = $('.new-user-modal'),
        newUserForm = $('.add-new-user'),
        statusObj = {
            0: {'title': 'Aniqlanmagan', 'class': 'badge-danger'},
            1: {title: 'Respublika', class: 'badge-light-success'},
            2: {title: 'Viloyat', class: 'badge-light-warning'},
            3: {title: 'Tuman yoki Shahar', class: 'badge-light-secondary'}
        };

    var assetPath = '../../../app-assets/';
    if ($('body').attr('data-framework') === 'laravel') {
        assetPath = $('body').attr('data-asset-path');
    }

    // Users List datatable
    if (dtUserTable.length) {
        dtUserTable.DataTable({
            processing: true,
            serverSide: true,
            ajax: api, // JSON file to add data
            columns: [
                // columns according to JSON
                {data: 'id'},
                {data: 'full_name'},
                {data: 'phone'},
                {data: 'role_id'},
                {data: 'region'},
                {data: 'science'},
                {data: 'posts_count'},
                {data: 'rating_status'},
                {data: ''}
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
                    // User full name and username
                    targets: 1,
                    responsivePriority: 4,
                    render: function (data, type, full, meta) {
                        var $name = full['full_name'] ?? full['login'] ?? full['phone'],
                            $uname = full['address'] ?? full['pin'],
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
                                $name = full['full_name'] ?? full['login'] ?? full['phone'] ,
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
                            '<a href="' +full['posts-url']+
                            '" class="user_name text-truncate"><span class="font-weight-bold">' +
                            $name +
                            '</span></a>' +
                            '<small class="emp_post text-muted">' +
                            $uname +
                            '</small>' +
                            '</div>' +
                            '<div class="role hidden">\n' +
                            full['role'] +
                            '</div>\n' +
                            '<div class="region hidden">\n' +
                            full['region'] +
                            '</div>' +
                            '<div class="status hidden">\n' +
                            statusObj[full['rating_status']]['title'] +
                            '</div>' +
                            '</div>';
                        return $row_output;
                    }
                },
                {
                    // User Role
                    targets: 3,
                    render: function (data, type, full, meta) {
                        var $role = full['role'];
                        var roleBadgeObj = {
                            3: feather.icons['user'].toSvg({class: 'font-medium-3 text-primary mr-50'}),
                            1: feather.icons['database'].toSvg({class: 'font-medium-3 text-success mr-50'}),
                            2: feather.icons['slack'].toSvg({class: 'font-medium-3 text-danger mr-50'})
                        };
                        return "<span class='text-truncate align-middle'>" + roleBadgeObj[full['role_id']] + $role + '</span>';
                    }
                },
                {
                    // User Status
                    targets: 7,
                    render: function (data, type, full, meta) {
                        var $status = full['rating_status'];
                        //console.log(statusObj[$status]);
                        return (
                            '<span class="badge badge-pill ' +
                            statusObj[$status]['class'] +
                            '" text-capitalized>' +
                            statusObj[$status]['title'] +
                            '</span>'
                        );
                    }
                },
                {
                    // Actions
                    targets: -1,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        if ($languageList['Edit'] === undefined)
                            $languageList['Edit'] = 'Tahrirlash';
                        if ($languageList['Delete'] === undefined)
                            $languageList['Delete'] = 'O\'chirish';
                        return (
                            '<div class="btn-group">' +
                            '<a class="btn btn-sm dropdown-toggle hide-arrow" data-toggle="dropdown">' +
                            feather.icons['more-vertical'].toSvg({class: 'font-small-4'}) +
                            '</a>' +
                            '<div class="dropdown-menu dropdown-menu-right">' +
                            '<a href="' +full['edit-url']+
                            '" class="dropdown-item">' +
                            feather.icons['archive'].toSvg({class: 'font-small-4 mr-50'}) + $languageList['Edit'] +
                            '</a>' +
                            '<a href="#" onclick="deleterow(this)" class="dropdown-item delete-record" data-url="'+
                                full['delete-url']+
                            '">' +
                            feather.icons['trash-2'].toSvg({class: 'font-small-4 mr-50'}) + $languageList['Delete'] +
                            '</a></div>' +
                            '</div>' +
                            '</div>'
                        );
                    }
                }
            ],
            order: [[2, 'desc']],
            dom:
                '<"d-flex justify-content-between align-items-center header-actions mx-1 row mt-75"' +
                '<"col-lg-12 col-xl-6" l>' +
                '<"col-lg-12 col-xl-6 pl-xl-75 pl-0"<"dt-action-buttons text-xl-right text-lg-left text-md-right text-left d-flex align-items-center justify-content-lg-end align-items-center flex-sm-nowrap flex-wrap mr-1"<"mr-1"f>B>>' +
                '>t' +
                '<"d-flex justify-content-between mx-2 row mb-1"' +
                '<"col-sm-12 col-md-6"i>' +
                '<"col-sm-12 col-md-6"p>' +
                '>',
            // language: {
            //     sLengthMenu: 'Show _MENU_',
            //     search: $languageList['Search'] ?? 'Qidirish',
            //     searchPlaceholder: $languageList['Search'] + '...' ?? 'Qidirish...'
            // },
            // Buttons with Dropdown
            buttons: [
                {
                    text: $languageList['Add New User'] ?? 'Yangi foydalanuvchi qo\'shish',
                    className: 'add-new btn btn-primary mt-50',
                    attr: {
                        'data-toggle': 'modal',
                        'data-target': '#modals-slide-in'
                    },
                    init: function (api, node, config) {
                        $(node).removeClass('btn-secondary');
                    }
                }
            ],
            // For responsive popup
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.modal({
                        header: function (row) {
                            var data = row.data();
                            return $languageList['Details of '] + data['full_name'];
                        }
                    }),
                    type: 'column',
                    renderer: $.fn.dataTable.Responsive.renderer.tableAll({
                        tableClass: 'table',
                        columnDefs: [
                            {
                                targets: 2,
                                visible: false
                            },
                            {
                                targets: 3,
                                visible: false
                            }
                        ]
                    })
                }
            },
            // language: {
            //     paginate: {
            //         // remove previous & next text from pagination
            //         previous: '&nbsp;',
            //         next: '&nbsp;'
            //     }
            // },
            language: {
                url: "/data/Uzbek.json"
            },
            initComplete: function () {
                // Adding role filter once table initialized
                this.api()
                    .columns(3)
                    .every(function () {
                        var column = this;
                        if ($languageList['Select role'] === undefined)
                            $languageList['Select role'] = 'Rolni tanlang';
                        var select = $(
                            '<select id="Role" class="form-control text-capitalize mb-md-0 mb-2"><option value="">' + $languageList['Select role'] + '</option></select>'
                        )
                            .appendTo('.role-filter')
                            .on('change', function () {
                                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                                column.search(val ? '(' + val.replace(/\s/g, '') + ')' : '', true, false).draw();
                            });
                        var $roles = {};
                        $('.role')
                            // .data()
                            // .unique()
                            // .sort()
                            .each(function (d, j) {
                                if ($roles[$(j).html()] === undefined) {
                                    $roles[$(j).html()] = $(j).html();
                                    select.append('<option value="' + $(j).html() + '" class="text-capitalize">' + $(j).html() + '</option>');
                                }
                            });
                    });
                // Adding plan filter once table initialized
                this.api()
                    .columns(4)
                    .every(function () {
                        var column = this;
                        if ($languageList['Select region'] === undefined)
                            $languageList['Select region'] = 'Viloyatni tanlang';
                        var select = $(
                            '<select id="Region" class="form-control text-capitalize mb-md-0 mb-2"><option value=""> ' + $languageList['Select region'] + ' </option></select>'
                        )
                            .appendTo('.region-filter')
                            .on('change', function () {
                                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                                //console.log(val.replace(/\n/, ''));
                                column.search(val ? '(' + val.replace(/\n/, '') + ')' : '', true, false).draw();
                            });
                        var $regions = {};
                        $('.region')
                            // .data()
                            //    .unique()
                            //  .sort()
                            .each(function (d, j) {
                                if ($regions[$(j).html()] === undefined) {
                                    $regions[$(j).html()] = $(j).html();
                                    select.append('<option value="' + $(j).html() + '" class="text-capitalize">' + $(j).html() + '</option>');
                                }
                            });
                    });
                // Adding status filter once table initialized
                this.api()
                    .columns(7)
                    .every(function () {
                        var column = this;
                        if ($languageList['Select status'] === undefined)
                            $languageList['Select status'] = 'Holatni tanlang';
                        var select = $(
                            '<select id="status" class="form-control text-capitalize mb-md-0 mb-2xx"><option value=""> ' + $languageList['Select status'] + ' </option></select>'
                        )
                            .appendTo('.status-filter')
                            .on('change', function () {
                                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                                column.search(val ? '(' + val.replace(/\s/g, '') + ')' : '', true, false).draw();
                            });

                        var $statuses = {};
                        $('.status')
                            // .data()
                            //    .unique()
                            //  .sort()
                            .each(function (d, j) {
                                if ($statuses[$(j).html()] === undefined) {
                                    $statuses[$(j).html()] = $(j).html();
                                    select.append('<option value="' + $(j).html() + '" class="text-capitalize">' + $(j).html() + '</option>');
                                }
                            });
                    });
            }
        });
    }

    // Check Validity
    function checkValidity(el) {
        if (el.validate().checkForm()) {
            submitBtn.attr('disabled', false);
        } else {
            submitBtn.attr('disabled', true);
        }
    }

    // Form Validation
    if (newUserForm.length) {
        newUserForm.validate({
            errorClass: 'error',
            rules: {
                'login': {
                    require_from_group: [1, ".phone-group"]
                },
                'phone': {
                    require_from_group: [1, ".phone-group"]
                },
                'role_id': {
                    required: true
                },
                'password':{
                    required: true
                },
            }
        });

        newUserForm.on('submit', function (e) {
            var isValid = newUserForm.valid();
            e.preventDefault();
            if (isValid) {
                var formData = newUserForm.serializeArray();
                $.ajax({
                    url: '/admin/users/store',
                    type: 'POST',
                    data: formData,
                    success: function (response) {
                        location.reload();
                    }
                });
                newUserSidebar.modal('hide');
            }
        });
    }

    // To initialize tooltip with body container
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]',
        container: 'body'
    });
});
function deleterow(e){
    //console.log(e,$(e).attr('data-url'));
    var url = $(e).attr('data-url');
    var tr = $(e).closest('tr');
    $.ajax({
        url: url,
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                tr.remove();
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
    return true;
}