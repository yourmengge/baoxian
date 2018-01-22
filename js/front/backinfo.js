var backinfo = angular.module('backinfo', ['Road167']);
backinfo.controller('backinfoCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    var time = new Date();
    $scope.initData = function () {
        $scope.init();
        //   console.log($scope.inspectorBackFilter);
        $scope.get_order_list();
    }
    $scope.init = function () {
        $scope.ordertype = '';
        $scope.jieguo = '';
        $scope.keyword = '';
        $scope.current = 1;
        $scope.start = '';
        $scope.endDay = '';
        $scope.limit = limit;
        if (sessionStorage.getItem('inspectorBackFilter2') != undefined) {
            $scope.inspectorBackFilter = JSON.parse(sessionStorage.getItem('inspectorBackFilter2'));
            $scope.start = $scope.inspectorBackFilter.start;
            $scope.endDay = $scope.inspectorBackFilter.end;
            $scope.userId = $scope.inspectorBackFilter.inspector;
            $scope.keyword = $scope.inspectorBackFilter.keyword;
            $scope.ordertype = $scope.inspectorBackFilter.type;
            $scope.jieguo = $scope.inspectorBackFilter.success;
            $scope.current = $scope.inspectorBackFilter.current;
        }
        $scope.reset_date();
    }
    $scope.switchImg = function (type) {
        switch (type) {
            case -1:
                return '../img/shibai.png';
            case 0:
                return '../img/daiqueren.png';
            default:
                return '../img/chenggong.png';
        }
    }
    $scope.saveFilter = function () {
        $scope.get_date();
        inspectorBackFilter = {
            start: $scope.start,
            end: $scope.endDay,
            type: $scope.ordertype,
            success: $scope.jieguo,
            inspector: $scope.userId,
            current: $scope.current,
            keyword: $scope.keyword
        }
        sessionStorage.setItem('inspectorBackFilter2', JSON.stringify(inspectorBackFilter));
    }
    $scope.orderTypeTexts = [{
        id: '',
        name: '全部'
    }, {
        id: 'ACCIDENT',
        name: '施救'
    }, {
        id: 'NOT_RESCURE',
        name: '非施救'
    }];
    $scope.jieguoTexts = [{
        id: '',
        name: '全部'
    }, {
        id: 'SUCCESS',
        name: '成功'
    }, {
        id: 'FAIL',
        name: '失败'
    }, {
        id: 'BE_CONFIRMED',
        name: '待确认'
    }]
    $scope.reset_date = function () {
        if ($scope.start != '') {
            var s = $scope.start.substr(0, 2) + '-' + $scope.start.substr(2, 2) + '-' + $scope.start.substr(4, 2)
            $('#startDay').val('20' + s)
        } else {
            $('#startDay').val('')
        }
        if ($scope.endDay != '') {
            var e = $scope.endDay.substr(0, 2) + '-' + $scope.endDay.substr(2, 2) + '-' + $scope.endDay.substr(4, 2)
            $('#endDay').val('20' + e)
        } else {
            $('#endDay').val('')
        }

    }
    $scope.detail = function (orderNo) {
        $scope.save_filter();
        sessionStorage.setItem('orderNo', orderNo);
        sessionStorage.setItem('isDisaster', 'not');
        goto_view('main/detail');
    }
    $scope.get_order_list = function () {
        loading();
        APIService.get_back_factory_list(10, ($scope.current - 1) * $scope.limit, $scope.start, $scope.endDay, $scope.ordertype, $scope.keyword, $scope.jieguo,$scope.userId).then(function (res) {
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
    $scope.toexcel = function (status, caseNo) {
        window.open(host + urlV1 + '/excel/third/back-factory/information/list/export?startDay=' + $scope.start + '&endDay=' + $scope.endDay + '&keyword=' + $scope.keyword + '&orderType=' + $scope.ordertype + '&pushResult=' + $scope.jieguo + '&createUserId=' + $scope.userId + '&Authorization=' + APIService.token + '&user-id=' + APIService.userId)
    }
    $scope.search = function () {
        if($scope.keyword != ''){
            $scope.userId = '';
        }
        $scope.current = 1;
        $scope.saveFilter();
        $scope.get_order_list();
    }

    $scope.searchAll = function () {
        $scope.userId = '';
        sessionStorage.removeItem('inspectorBackFilter2');
        $scope.init();
        $scope.get_order_list();
    }

    $scope.get_date = function () {
        var startDate = $('#startDay').val();
        var endDate = $('#endDay').val();
        if (startDate != '') {
            $scope.start = startDate.split("-");
            $scope.start = $scope.start[0].substr(2, 3) + '' + $scope.start[1] + '' + $scope.start[2];
        } else {
            $scope.start = '';
        }
        if (endDate != '') {
            $scope.endDay = endDate.split("-");
            $scope.endDay = $scope.endDay[0].substr(2, 3) + '' + $scope.endDay[1] + '' + $scope.endDay[2];
        } else {
            $scope.endDay = '';
        }
    }
    $scope.detail = function (orderNo) {
        $scope.saveFilter();
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

        $scope.saveFilter();
        $scope.page_show();
        loading();
        APIService.paging(urlV1 + '/third/back-factory/information/list?startDay=' + $scope.start + '&endDay=' + $scope.endDay + '&keyword=' + $scope.keyword + '&orderType=' + $scope.ordertype + '&pushResult=' + $scope.jieguo + '&createUserId=' + $scope.userId, limit, type, $scope.pageCount, $scope.current).then(function (res) {
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