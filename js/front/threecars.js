var threecars = angular.module('threecars', ['Road167']);
var time = new Date();

threecars.controller('threecarsCtrl', ['$scope', 'APIService', '$http', function ($scope, APIService, $http) {
    $scope.initData = function () {
        $scope.init();
        $scope.table = show;
        $scope.openDetail = -1;
        $scope.tips = '';
        loading();
        $scope.page_p = show;
        var today = time.getTime();
        $('#startDay').val(ToLocalTime(today - 2678400000));
        $('#endDay').val(ToLocalTime(today));

        $scope.caseNo = '';
        $scope.current = 1;
        if (sessionStorage.getItem('filter_three') != undefined) {
            var a = JSON.parse(sessionStorage.getItem('filter_three'))
            $('#endDay').val(a.endDate);
            $('#startDay').val(a.startDate);
            $scope.caseNo = a.keyword;
            if (a.order_current != '') {
                $scope.current = a.order_current;
            }
            // $scope.reset_date();
        }
        $scope.get_order_list();

    }
    $scope.init = function () {
        $scope.url = sessionStorage.getItem('threecars')
        if ($scope.url === 'threecars') {
            $scope.backType = 'inspector'
        } else {
            $scope.backType = 'push'
        }
    }
    $scope.get_order_list = function () {
        APIService.get_three_cars_info(10, $('#startDay').val(), $('#endDay').val(), $scope.caseNo, ($scope.current - 1) * 10).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.orderList = res.data.items;
                //分页部分

                $scope.pageCount = Math.ceil(res.data.count / limit);
                if (res.data.count <= limit) {
                    $scope.page_p = hide;
                } else {
                    $scope.page_p = show;
                    $scope.down = show;
                }
                $scope.up = hide;
                $scope.page_show();
                //分页结束
            } else {
                isError(res);
            }
        })
    }
    $scope.reset_date = function () {
        var s = $scope.start.substr(0, 2) + '-' + $scope.start.substr(2, 2) + '-' + $scope.start.substr(4, 2)
        var e = $scope.endDay.substr(0, 2) + '-' + $scope.endDay.substr(2, 2) + '-' + $scope.endDay.substr(4, 2)
        $('#startDay').val('20' + s)
        $('#endDay').val('20' + e)
    }
    $scope.toexcel = function (status, caseNo) {
        window.open(host + urlV1 + '/order/license/list/export?&$limit=999&startDate=' + $('#startDay').val() + '&endDate=' + $('#endDay').val() + '&keyword=' + $scope.caseNo + '&Authorization=' + APIService.token + '&user-id=' + APIService.userId)
    }
    $scope.search = function () {
        $scope.current = 1;
        $scope.save_filter();

        $scope.openDetail = -1;
        loading();
        APIService.get_three_cars_info(10, $('#startDay').val(), $('#endDay').val(), $scope.caseNo, ($scope.current - 1) * 10).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                if (res.data.count == 0) {
                    $scope.tips = '未找到符合条件的订单';
                    $scope.table = hide;
                    $scope.page_p = hide;
                } else {
                    $scope.table = show;
                    $scope.tips = '';
                    $scope.orderList = res.data.items;

                    //分页部分
                    $scope.current = 1;
                    $scope.pageCount = Math.ceil(res.data.count / limit);
                    if ($scope.pageCount <= 1) {
                        $scope.page_p = hide;
                    } else {
                        $scope.page_p = show;
                        $scope.down = show;
                    }
                    $scope.up = hide;
                    $scope.page_show();
                    //分页结束
                }

            } else {
                isError(res);
            }
        })
    }
    $scope.save_filter = function () {
        $scope.get_date();
        filter.endDate = $scope.endDay;
        filter.keyword = $scope.caseNo;
        filter.startDate = $scope.start;
        filter.order_current = $scope.current;
        sessionStorage.setItem('filter_three', JSON.stringify(filter));
    }
    $scope.get_date = function () {
        var startDate = $('#startDay').val();
        var endDate = $('#endDay').val();
        $scope.start = startDate.split("-");
        $scope.endDay = endDate.split("-");
        $scope.start = $scope.start[0] + '-' + $scope.start[1] + '-' + $scope.start[2];
        $scope.endDay = $scope.endDay[0] + '-' + $scope.endDay[1] + '-' + $scope.endDay[2];
    }
    $scope.detail = function (orderNo) {
        $scope.save_filter();
        sessionStorage.setItem('orderNo', orderNo);
        sessionStorage.setItem('isDisaster', 'not');
        goto_view('main/detail');
    }
    $scope.Page = function (type) {
        if (type == 'home') {
            $scope.current = 1;

        }
        if (type == 'end') {
            $scope.current = $scope.pageCount;

        }
        if (type == 'down') {
            $scope.current = $scope.current + 1;

        }
        if (type == 'up') {
            $scope.current = $scope.current - 1;

        }

        $scope.save_filter();
        $scope.page_show();
        loading();
        APIService.paging(urlV1 + urlOrder + '/license/list?startDate=' + $('#startDay').val() + '&endDate=' + $('#endDay').val() + '&keyword=' + $scope.caseNo, limit, type, $scope.pageCount, $scope.current).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {

                $scope.orderList = res.data.items;
            } else {
                isError(res)
            }
        })


    }
    $scope.page_show = function () {
        if ($scope.current == 1) {
            $scope.down = show;
            $scope.up = hide;
        } else if ($scope.current == $scope.pageCount) {
            $scope.down = hide;
            $scope.up = show;
        } else {
            $scope.down = show;
            $scope.up = show;
        }
    }

}])