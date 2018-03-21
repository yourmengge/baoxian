var damagelist = angular.module('damagelist', ['Road167']);
var time = new Date();
var dingsunfilter = {};
damagelist.controller('damagelistCtrl', ['$scope', 'APIService', function($scope, APIService) {
    $scope.selectText = [{
        id: '',
        name: '新上传'
    }, {
        id: '1',
        name: '所有'
    }]
    $scope.init = function() {
        $scope.select = '';
        $scope.start = '';
        $scope.endDay = '';
        $scope.limit = limit;
        $scope.current = 1;
        var today = time.getTime();
        $scope.keyword = '';
        $('#startDay').val(ToLocalTime(new Date().setDate(1)));
        $('#endDay').val(ToLocalTime(today));
    }
    $scope.download = function(url) {
        window.open(url)
    }
    $scope.goto = function(carNo, caseNo) {
        sessionStorage.setItem('carNo', carNo)
        sessionStorage.setItem('caseNo', caseNo)
        goto_view('main/damagedetail')
    }
    $scope.initData = function() {
        $scope.init();
        if (sessionStorage.getItem('dingsunfilter') != undefined) {
            var a = JSON.parse(sessionStorage.getItem('dingsunfilter'))
            $scope.start = a.startDate;
            $scope.endDay = a.endDate;
            $scope.keyword = a.keyword;
            if (a.order_current != '') {
                $scope.current = a.order_current;
            }
            $scope.reset_date();
        }
        $scope.get_damage_list();
    }
    $scope.save_filter = function() {
        $scope.get_date();
        dingsunfilter.endDate = $scope.endDay;
        dingsunfilter.keyword = $scope.keyword;
        dingsunfilter.startDate = $scope.start;
        dingsunfilter.order_current = $scope.current;
        console.log(JSON.stringify(dingsunfilter))
        sessionStorage.setItem('dingsunfilter', JSON.stringify(dingsunfilter));
    }
    $scope.Page = function(type) {
        if ($scope.start - $scope.endDay <= 0) {
            $scope.openDetail = -1;
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
            APIService.paging(urlV1 + '/loss-decision/page?startDay=' + $scope.start + '&endDay=' + $scope.endDay + '&keywords=' + $scope.keyword, $scope.limit, type, $scope.pageCount, $scope.current).then(function(res) {
                if (res.data.http_status == 200) {
                    closeloading();
                    $scope.list = res.data.items;
                } else {
                    isError(res)
                }
            })
        } else {
            layer.msg('开始时间应在结束时间之前');
        }

    }
    $scope.search = function() {
        $scope.current = 1;
        $scope.save_filter();
        $scope.get_damage_list();
    }
    $scope.searchAll = function() {
        sessionStorage.removeItem('dingsunfilter');
        $scope.initData();
    }
    $scope.get_damage_list = function() {
        $scope.get_date();
        loading();
        APIService.get_damage_list($scope.start, $scope.endDay, $scope.keyword, ($scope.current - 1) * $scope.limit, $scope.limit).then(function(res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.items;
                //分页部分
                $scope.pageCount = Math.ceil(res.data.count / $scope.limit);
                if (res.data.count <= $scope.limit) {
                    $scope.page_p = hide;
                } else {
                    $scope.page_p = show;
                    $scope.down = show;
                }
                $scope.up = hide;
                $scope.page_show();
                //分页结束
            } else {
                isError(res)
            }
        })
    }
    $scope.page_show = function() {
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
    $scope.get_date = function() {
        var startDate = $('#startDay').val();
        var endDate = $('#endDay').val();
        if (startDate != '') {
            $scope.start = startDate.split("-");
            $scope.start = $scope.start[0].substr(2, 3) + '' + $scope.start[1] + '' + $scope.start[2];
        } else {
            $scope.start = ''
        }
        if (endDate != '') {
            $scope.endDay = endDate.split("-");
            $scope.endDay = $scope.endDay[0].substr(2, 3) + '' + $scope.endDay[1] + '' + $scope.endDay[2];
        } else {
            $scope.endDay = ''
        }
    }
    $scope.reset_date = function() {
        var s = $scope.start.substr(0, 2) + '-' + $scope.start.substr(2, 2) + '-' + $scope.start.substr(4, 2)
        var e = $scope.endDay.substr(0, 2) + '-' + $scope.endDay.substr(2, 2) + '-' + $scope.endDay.substr(4, 2)
        $('#startDay').val('20' + s)
        $('#endDay').val('20' + e)
    }
}])