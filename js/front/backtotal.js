var backtotal = angular.module('backtotal', ['Road167']);
backtotal.controller('backtotalCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.init();
        $scope.get_inspector_back_factory();
        $scope.back_factory_total();
    }
    $scope.init = function () {
        $scope.start = '';
        $scope.endDay = '';
        $scope.limit = limit;
        $scope.type = 'ACCIDENT';
        $scope.current = 1;
        if (sessionStorage.getItem('inspectorBackFilter') != undefined) {
            $scope.inspectorBackFilter = JSON.parse(sessionStorage.getItem('inspectorBackFilter'));
            $scope.start = $scope.inspectorBackFilter.start;
            $scope.endDay = $scope.inspectorBackFilter.end;
            $scope.type = $scope.inspectorBackFilter.type;
            $scope.current = $scope.inspectorBackFilter.current;
        }
        $scope.offset = ($scope.current - 1) * $scope.limit;
        $scope.reset_date();
    }
    var inspectorBackFilter = {
        start: $scope.start,
        end: $scope.endDay,
        type: $scope.type,
        success: '',
        inspector: '',
        current: $scope.current
    }
    $scope.saveFilter = function () {
        $scope.get_date();
        inspectorBackFilter = {
            start: $scope.start,
            end: $scope.endDay,
            type: $scope.type,
            success: $scope.success,
            inspector: $scope.inspector,
            current: $scope.current
        }
        sessionStorage.setItem('inspectorBackFilter', JSON.stringify(inspectorBackFilter));
    }
    $scope.get_date = function () {
        var startDate = $('#startDay').val();
        var endDate = $('#endDay').val();
        if (startDate != '') {
            $scope.start = startDate.split("-");
            $scope.start = $scope.start[0].substr(2, 3) + '' + $scope.start[1] + '' + $scope.start[2];
        }
        if (endDate != '') {
            $scope.endDay = endDate.split("-");
            $scope.endDay = $scope.endDay[0].substr(2, 3) + '' + $scope.endDay[1] + '' + $scope.endDay[2];
        }
    }
    $scope.reset_date = function () {
        var s = $scope.start.substr(0, 2) + '-' + $scope.start.substr(2, 2) + '-' + $scope.start.substr(4, 2)
        var e = $scope.endDay.substr(0, 2) + '-' + $scope.endDay.substr(2, 2) + '-' + $scope.endDay.substr(4, 2)
        $('#startDay').val('20' + s)
        $('#endDay').val('20' + e)
    }
    $scope.searchAll = function () {
        sessionStorage.removeItem('inspectorBackFilter');
        $scope.init();
        $scope.get_inspector_back_factory();
        $scope.back_factory_total();

    }
    $scope.back_factory_total = function () {
        APIService.back_factory_total($scope.start, $scope.endDay, $scope.type).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.total = res.data;
            } else {
                isError(res)
            }
        })
    }
    $scope.toexcel = function (status, caseNo) {
        window.open(host + urlV1 + '/excel/third/back-factory/inspector/count/export?startDay=' + $scope.start + '&endDay=' + $scope.endDay + '&orderType=' + $scope.type + '&Authorization=' + APIService.token + '&user-id=' + APIService.userId)
    }
    $scope.search = function () {
        $scope.current = 1;
        $scope.saveFilter();
        $scope.get_inspector_back_factory();
        $scope.back_factory_total();
        
    }
    $scope.changeType = function (type) {
        $scope.type = type;
        inspectorBackFilter.type = $scope.type;
        $scope.saveFilter();
        $scope.get_inspector_back_factory();
        $scope.back_factory_total();
    }
    $scope.goto = function (type, name) {
        if (name == null) {
            name = '';
        }
        $scope.inspector = name;
        $scope.success = type;
        $scope.saveFilter();
        sessionStorage.setItem('inspectorBackFilter2', JSON.stringify(inspectorBackFilter));
        goto_view('main/backinfo')
    }
    $scope.get_inspector_back_factory = function () {
        loading();
        APIService.get_inspector_back_factory($scope.limit, $scope.offset, $scope.start, $scope.endDay, $scope.type).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                // console.log(res)
                $scope.orderlist = res.data.items;
                //分页部分
                // $scope.current = 1;
                $scope.pageCount = Math.ceil(res.data.count / $scope.limit);
                if (res.data.count <= $scope.limit) {
                    $scope.page_p = hide;
                } else {
                    $scope.page_p = show;
                }
                if ($scope.current == 1) {
                    $scope.up = hide;
                } else if ($scope.current == $scope.pageCount) {
                    $scope.down = hide;
                }
                $scope.home = show;
                $scope.end = show;
            } else {
                isError(res);
            }
        })
    }
    $scope.Page = function (type) {
        if (type == 'home') {
            $scope.current = 1;
            $scope.up = hide;
            $scope.down = show;
        }
        if (type == 'end') {
            $scope.current = $scope.pageCount;
            $scope.up = show;
            $scope.down = hide;
        }
        if (type == 'down') {
            $scope.up = show;
            $scope.current = $scope.current + 1;
            if ($scope.current == $scope.pageCount) {
                $scope.down = hide;
            }
        }
        if (type == 'up') {
            $scope.down = show;
            $scope.current = $scope.current - 1;
            if ($scope.current == 1) {
                $scope.up = hide;
            }
        }
        inspectorBackFilter.current = $scope.current;
        $scope.saveFilter();
        loading();
        APIService.paging(urlV1 + '/third/back-factory/inspector/count?startDay=' + $scope.start + '&endDay=' + $scope.endDay + '&orderType=' + $scope.type, $scope.limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.orderlist = res.data.items;
            } else {
                isError(res)
            }

        })
    }
}])