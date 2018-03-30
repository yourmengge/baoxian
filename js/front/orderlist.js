var orderlist = angular.module('orderlist', ['Road167']);
var time = new Date();

orderlist.controller('orderlistCtrl', ['$scope', 'APIService', '$http', function($scope, APIService, $http) {
    $scope.init = function() {
        $scope.table = show;
        $scope.openDetail = -1;
        $scope.tips = '';
        $scope.page_p = show;
        var today = time.getTime();
        $('#startDay').val(ToLocalTime(today - 2678400000));
        $('#endDay').val(ToLocalTime(today));
        $scope.get_date();
        $scope.status = $scope.statusTexts[0].id;
        $scope.ordertype = '';
        $scope.WuCha = '';
        $scope.caseNo = '';
        $scope.current = 1;
        $scope.peifu = ''
        $scope.timetype = 'ORDER';
        $scope.resultType = '';
        $scope.insuranceType = '';
        $scope.pushResult = '';
        var funcList = []
        funcList = sessionStorage.getItem('funcList').split(',')
        if (contains(funcList, 1017)) {
            $scope.zhipei = show;
        } else {
            $scope.zhipei = hide;
        }
    }

    $scope.initData = function() {
        $scope.init();
        // $scope.get_order_total();
        loading();
        $scope.createUserId = '';
        $scope.pushShop4sId = '';
        $scope.whichRole = sessionStorage.getItem('whichRole')
        if (sessionStorage.getItem('inspectorBackFilter') != undefined) {
            var a = JSON.parse(sessionStorage.getItem('inspectorBackFilter'));
            console.log(a)
            $scope.timetype = a.timetype;
            if ($scope.timetype == 'ORDER') {
                $scope.start = a.start;
                $scope.endDay = a.end;
                $scope.accidentDateStart = '';
                $scope.accidentDateEnd = '';
            } else {
                $scope.start = '';
                $scope.endDay = '';
                $scope.accidentDateStart = a.start;
                $scope.accidentDateEnd = a.end;
            }
            $scope.ordertype = a.ordertype;
            $scope.caseNo = a.keyword;
            if (a.type == 'inspector') {
                $scope.createUserId = a.createUserId;
                $scope.pushShop4sId = '';
            } else {
                $scope.pushShop4sId = a.createUserId;
                $scope.createUserId = '';
            }

            $scope.pushResult = a.resulttype;
            $scope.current = 1;
            $scope.status = 'THIRD_BACK'
            $scope.reset_date();
        } else if (sessionStorage.getItem('filter') != undefined) {
            var a = JSON.parse(sessionStorage.getItem('filter'))
            $scope.timetype = a.timetype;
            if ($scope.timetype == 'ORDER') {
                $scope.start = a.startDate;
                $scope.endDay = a.endDate;
                $scope.accidentDateStart = '';
                $scope.accidentDateEnd = '';
            } else {
                $scope.start = '';
                $scope.endDay = '';
                $scope.accidentDateStart = a.startDate;
                $scope.accidentDateEnd = a.endDate;
            }
            $scope.status = a.status;
            $scope.caseNo = a.keyword;
            $scope.ordertype = a.ordertype;
            $scope.peifu = a.peifu;
            $scope.WuCha = a.wucha;
            $scope.pushResult = a.pushResult;
            $scope.resultType = a.resultType;
            $scope.insuranceType = a.insuranceType;
            if (a.order_current != '') {
                $scope.current = a.order_current;
            }
            $scope.reset_date();
        }
        $scope.get_order_list();

    }
    $scope.toPercent = function(num) {
        return num == 1 ? "100%" : (num * 100).toFixed(2) + '%'
    }
    $scope.get_order_total = function() {
        APIService.get(host + urlV1 + '/third/order/shop4s/statis').then(function(res) {
            if (res.data.http_status == 200) {
                $scope.ordertotaldate = res.data;
                $scope.orderTotalCount = res.data.orderTotal + '单';
                $scope.shop4sNoResRead = $scope.toPercent(res.data.shop4sNoResRead)
                $scope.shop4sAccConfirm = $scope.toPercent(res.data.shop4sAccConfirm)
            } else {
                isError(res)
            }
        })
    }
    $scope.get_date = function() {
            var startDate = $('#startDay').val();
            var endDate = $('#endDay').val();
            if (startDate != '') {
                $scope.start = startDate.split("-");
                if ($scope.timetype == 'ORDER') {
                    $scope.start = $scope.start[0].substr(2, 3) + '' + $scope.start[1] + '' + $scope.start[2];
                    $scope.accidentDateStart = '';
                } else {
                    $scope.accidentDateStart = $scope.start[0].substr(2, 3) + '' + $scope.start[1] + '' + $scope.start[2];
                    $scope.start = '';
                }

            } else {
                $scope.start = ''
            }
            if (endDate != '') {
                $scope.endDay = endDate.split("-");
                if ($scope.timetype == "ORDER") {
                    $scope.endDay = $scope.endDay[0].substr(2, 3) + '' + $scope.endDay[1] + '' + $scope.endDay[2];
                    $scope.accidentDateEnd = '';
                } else {
                    $scope.accidentDateEnd = $scope.endDay[0].substr(2, 3) + '' + $scope.endDay[1] + '' + $scope.endDay[2];
                    $scope.endDay = ''
                }

            } else {
                $scope.endDay = ''
            }
        }
        // $scope.dateType = function () {
        //     $scope.save_filter();

    // }
    $scope.get_order_list = function() {
        APIService.get_order_list(10, $scope.createUserId, $scope.pushShop4sId, $scope.start, $scope.endDay, $scope.status, $scope.caseNo, $scope.ordertype, $scope.WuCha, $scope.insuranceType, $scope.peifu, $scope.accidentDateStart, $scope.accidentDateEnd, $scope.pushResult, ($scope.current - 1) * 10).then(function(res) {
            if (res.data.http_status == 200) {
                closeloading();
                if (res.data.orderCounts == 0) {
                    $scope.tips = '未找到符合条件的订单';
                    $scope.table = hide;
                    $scope.page_p = hide;
                } else {
                    $scope.table = show;
                    $scope.tips = '';
                    $scope.orderList = res.data.orderList;

                    //分页部分
                    $scope.current = 1;
                    $scope.pageCount = Math.ceil(res.data.orderCounts / limit);
                    if (res.data.orderCounts <= limit) {
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
    $scope.reset_date = function() {
            if ($scope.timetype == 'ORDER') {
                var s = $scope.start.substr(0, 2) + '-' + $scope.start.substr(2, 2) + '-' + $scope.start.substr(4, 2)
                var e = $scope.endDay.substr(0, 2) + '-' + $scope.endDay.substr(2, 2) + '-' + $scope.endDay.substr(4, 2)
            } else {
                var s = $scope.accidentDateStart.substr(0, 2) + '-' + $scope.accidentDateStart.substr(2, 2) + '-' + $scope.accidentDateStart.substr(4, 2)
                var e = $scope.accidentDateEnd.substr(0, 2) + '-' + $scope.accidentDateEnd.substr(2, 2) + '-' + $scope.accidentDateEnd.substr(4, 2)
            }

            $('#startDay').val('20' + s)
            $('#endDay').val('20' + e)
        }
        // $scope.openDiv = function (index) {
        //     if ($scope.openDetail == index) {
        //         $scope.openDetail = -1;
        //     } else {
        //         $scope.openDetail = index;
        //     }

    // }
    $scope.editOrder = function(data, event) {
        event.stopPropagation();
        goto_view('main/editorder');
        $scope.save_filter();
        sessionStorage.setItem('editorder', JSON.stringify(data));
        sessionStorage.setItem('location_lat', data.accidentLatitude);
        sessionStorage.setItem('location_lng', data.accidentLongitude);
        sessionStorage.setItem('location_address', data.accidentAddress);
        sessionStorage.setItem('isDisaster', 'not');
    }
    $scope.toexcel = function(status, caseNo) {
        $scope.get_date();
        window.open(host + urlV1 + '/order/export/third?OrderStatus2=' + $scope.status + '&orderType=' + $scope.ordertype + '&$limit=999&startDay=' + $scope.start + '&endDay=' +
                $scope.endDay + '&keyword=' + $scope.caseNo + '&fixDiffDistance=' + $scope.WuCha + '&insuranceType=' + $scope.insuranceType + '&DirectType=' + $scope.peifu +
                '&accidentDateStart=' + $scope.accidentDateStart + '&accidentDateEnd=' + $scope.accidentDateEnd + '&PushResult=' +
                $scope.pushResult + '&createUserId=' + $scope.createUserId + '&pushShop4sId' + $scope.pushShop4sId + '&Authorization=' + APIService.token + '&user-id=' + APIService.userId)
            //window.open('http://dev.road167.com:8080/extrication/v1/order/export');
            // APIService.export().then(function (res) {
            //     console.log(res.data);
            // })
            // $http({
            //     method: 'GET',
            //     url: host + urlV1 + '/order/export/third?status=' + $scope.status + '&$limit=999&startDay=' + $scope.start + '&endDay=' + $scope.endDay  + '&keyword=' + $scope.caseNo,
            //     headers: {
            //         "Content-Type": undefined,
            //         "Authorization": APIService.token,
            //         "user-id": APIService.userId
            //     },
            //     responseType: 'blob',
            // }).then(function (res) {
            //     var blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            //     console.log(blob)
            //     var a = document.createElement("a");
            //     document.body.appendChild(a);
            //     a.download = '订单.xls';
            //     a.href = URL.createObjectURL(blob);
            //     a.click();
            // })
            // $("#table2excel").table2excel({
            //     // 不被导出的表格行的CSS class类
            //     exclude: ".noExl",
            //     // 导出的Excel文档的名称
            //     name: "Excel Document Name",
            //     // Excel文件的名称
            //     filename: "下载"
            // });
    }

    $scope.search = function() {
        $scope.current = 1;
        sessionStorage.removeItem('inspectorBackFilter');
        $scope.save_filter();

        $scope.openDetail = -1;
        loading();
        APIService.get_order_list(10, $scope.createUserId, $scope.pushShop4sId, $scope.start, $scope.endDay, $scope.status, $scope.caseNo, $scope.ordertype, $scope.WuCha, $scope.insuranceType, $scope.peifu, $scope.accidentDateStart, $scope.accidentDateEnd, $scope.pushResult, ($scope.current - 1) * 10).then(function(res) {
            if (res.data.http_status == 200) {
                closeloading();
                if (res.data.orderCounts == 0) {
                    $scope.tips = '未找到符合条件的订单';
                    $scope.table = hide;
                    $scope.page_p = hide;
                } else {
                    $scope.table = show;
                    $scope.tips = '';
                    $scope.orderList = res.data.orderList;

                    //分页部分
                    $scope.current = 1;
                    $scope.pageCount = Math.ceil(res.data.orderCounts / limit);
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
    $scope.save_filter = function() {
        $scope.get_date();
        filter.endDate = $scope.endDay;
        filter.keyword = $scope.caseNo;
        filter.startDate = $scope.start;
        filter.status = $scope.status;
        filter.pushResult = $scope.pushResult;
        filter.ordertype = $scope.ordertype;
        filter.peifu = $scope.peifu;
        filter.timetype = $scope.timetype;
        filter.accidentDateStart = $scope.accidentDateStart
        filter.accidentDateEnd = $scope.accidentDateEnd
        filter.order_current = $scope.current;
        filter.wucha = $scope.WuCha;
        filter.insuranceType = $scope.insuranceType
        sessionStorage.setItem('filter', JSON.stringify(filter));
    }

    $scope.detail = function(orderNo) {
        $scope.save_filter();
        sessionStorage.setItem('orderNo', orderNo);
        sessionStorage.setItem('isDisaster', 'not');
        goto_view('main/detail');
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
            APIService.paging(urlV1 + urlThird + urlOrder + '?startDay=' + $scope.start + '&endDay=' + $scope.endDay + '&OrderStatus2=' + $scope.status +
                '&orderType=' + $scope.ordertype + '&keyword=' + $scope.caseNo + '&fixDiffDistance=' + $scope.WuCha + '&insuranceType=' + $scope.insuranceType +
                '&DirectType=' + $scope.peifu + '&accidentDateStart=' + $scope.accidentDateStart + '&accidentDateEnd=' + $scope.accidentDateEnd + '&PushResult=' +
                $scope.pushResult + '&createUserId=' + $scope.createUserId + '&pushShop4sId=' + $scope.pushShop4sId, limit, type, $scope.pageCount, $scope.current).then(function(res) {
                if (res.data.http_status == 200) {
                    closeloading();
                    $scope.orderList = res.data.orderList;
                } else {
                    isError(res)
                }
            })
        } else {
            layer.msg('开始时间应在结束时间之前');
        }

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
    $scope.timeTypeTexts = [{
        id: 'ORDER',
        name: '下单时间'
    }, {
        id: 'ACCIDENT',
        name: '出险时间'
    }]
    $scope.resultTypeTexts = [{
        id: '',
        name: '全部'
    }, {
        id: 'SUCCESS',
        name: '成功'
    }, {
        id: 'SAME',
        name: '准确'
    }, {
        id: 'BE_CONFIRMED',
        name: '待确认'
    }, {
        id: 'FAIL',
        name: '失败'
    }]
    $scope.insuranceTypeTexts = [{
        id: '',
        name: '全部'
    }, {
        id: 'MARK_CAR',
        name: '标的车'
    }, {
        id: 'THIRD_CAR',
        name: '三者车'
    }]
    $scope.peifuTexts = [{
        id: '',
        name: '全部'
    }, {
        id: 'DIRECT',
        name: '直赔'
    }, {
        id: 'NO_DIRECT',
        name: '非直赔'
    }]
    $scope.statusTexts = [{
            id: 'THIRD_ALL',
            name: '全部'
        },
        {
            id: 'THIRD_ORDER',
            name: '待接单'
        },
        {
            id: 'THIRD_ALLOCATE',
            name: '待分配'
        },
        {
            id: 'THIRD_DOING',
            name: '进行中'
        },
        {
            id: 'THIRD_FINISH',
            name: '已完成'
        },
        {
            id: 'THIRD_CANCEL',
            name: '已取消'
        },
        {
            id: 'THIRD_BACK',
            name: '除已取消'
        }
    ]
    $scope.WuChaTexts = [{
            id: '',
            name: '全部'
        },
        {
            id: '300',
            name: '大于300米'
        },
        {
            id: '400',
            name: '大于400米'
        },
        {
            id: '500',
            name: '大于500米'
        },
        {
            id: '600',
            name: '大于600米'
        },
        {
            id: '700',
            name: '700米以上'
        }
    ]
    $scope.orderTypeTexts = [{
            id: '',
            name: '全部'
        },
        {
            id: '1',
            name: '施救'
        },
        {
            id: '3',
            name: '非施救'
        }
    ]

    $scope.hideEdit = function(status) {
        if (status === '已完成' || status == '已取消') {
            return true;
        }
        if ($scope.whichRole == 'liSuan' || $scope.whichRole == 'shop4sAdmin') {
            return true;
        }
        return false;
    }
    $scope.switchColor = function(text) {
        switch (text) {
            case '待接单':
                return 'font_yellow'
            case '待分配':
                return 'font_yellow'
            case '进行中':
                return 'font_green'
            case '已完成':
                return '';
            case '已取消':
                return 'font_gray'
            case '历史未完成':
                return 'font_gray'
            default:
                break;
        }
    }
    $scope.switchImg = function(type) {
        switch (type) {
            case 0:
                return 'img/icon_daiqueren.png'
            case 1:
                return 'img/icon_yiwancheng.png'
            case 2:
                return 'img/icon_zhunque.png'
            case -1:
                return 'img/icon_shibai.png'
            default:
                return '';
        }
    }
    $scope.switchCarType = function(type) {
        switch (type) {
            case 2:
                return 'img/icon_sanzhe.png'
            case 1:
                return 'img/icon_biaodi.png'
            default:
                break;
        }
    }
    $scope.searchAll = function() {
        sessionStorage.removeItem('inspectorBackFilter');
        sessionStorage.removeItem('filter');
        $scope.initData();
    }
    $scope.cancel = function(orderNo, event) {
        event.stopPropagation();
        if (confirm('确定要取消订单吗')) {
            loading();
            APIService.cancel_order(orderNo).then(function(res) {
                if (res.data.http_status == 200) {
                    $scope.orderList = res.data.orderList;
                    layer.msg('取消订单成功');
                    $scope.initData();
                } else {
                    isError(res);
                }
            })
        }
    }
}])