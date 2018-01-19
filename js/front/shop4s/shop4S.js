var shop4S = angular.module('shop4S', ['Road167']);
shop4S.controller('shop4SCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.checked = [];
        $scope.select_one = false;
        $scope.keyword = '';
        $scope.all = false;
        $scope.page_p = show;
        $scope.current = 1;
        $scope.status = '';
        var funcList = []
        funcList = sessionStorage.getItem('funcList').split(',')
        if (contains(funcList, 1017)) {
            $scope.zhipeiDiv = show;
        } else {
            $scope.zhipeiDiv = hide;
        }
        if (sessionStorage.getItem('shop4s_filter') != undefined) {
            var a = JSON.parse(sessionStorage.getItem('shop4s_filter'))
            $scope.keyword = a.keyword;
            $scope.current = a.shop4s_current;
            $scope.status = a.status;
        }
        $scope.get_shop4S_page();
    }
    //查询全部
    $scope.searchAll = function () {
        sessionStorage.removeItem('shop4s_filter');
        $scope.initData();
    }
    $scope.search = function () {
        $scope.current = 1;
        $scope.save_filter();
        $scope.get_shop4S_page();
    }
    $scope.statusTexts = [{
        id: '',
        name: '全部'
    }, {
        id: 'true',
        name: '是'
    }, {
        id: 'false',
        name: '否'
    }]
    //获取4S店列表
    $scope.get_shop4S_page = function () {
        loading();
        APIService.get_shop4S_page($scope.keyword, limit, ($scope.current - 1) * 10, $scope.status).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {

                $scope.shopList = res.data.items;
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
    $scope.output = function () {
        window.open(host + urlV1 + '/shop4s/export?keyword=' + $scope.keyword + '&directCompensation=' + $scope.status + '&Authorization=' + APIService.token + '&user-id=' + APIService.userId)
    }
    //页面跳转
    $scope.goto = function (type, a) {
        $scope.save_filter();
        sessionStorage.setItem('shop4S_type', type)
        sessionStorage.setItem('select_shop4sId', a.id)
        if (a == '') {
            sessionStorage.removeItem('shop4S_data');
        } else {
            sessionStorage.setItem('shop4S_data', JSON.stringify(a));
        }
        if (type == 'add') {
            goto_view('main/shop4snum')
        } else {
            goto_view('main/addshop4S')
        }

    }


    //全选
    $scope.selectAll = function () {
        $scope.select_one = false;
        if (!$scope.all) {
            $scope.select_one = true;
            $scope.all = true;
            $scope.checked = [];
            angular.forEach($scope.shopList, function (i, index) {
                $scope.checked.push(i.shop4sId);
            })
        } else {
            $scope.all = false;
            $scope.select_one = false;
            $scope.checked = [];
        }
    }

    //单选
    $scope.selectOne = function (id) {
        if (contains($scope.checked, id)) {
            angular.forEach($scope.checked, function (i, index) {
                if ($scope.checked[index] == id) {
                    $scope.checked.splice(index, 1);
                    $scope.all = false;
                }
            })
        } else {
            $scope.checked.push(id);
            if ($scope.checked.length == $scope.shopList.length) {
                $scope.all = true;
            }
        }
    }
    $scope.addDriver = function (data) {
        $('.alert_bg').css('display', 'block')
        $('.zhipeilist').toggle();
        $scope.get_zhipeilist(data.id)
    }
    $scope.get_zhipeilist = function (shop4sId) {
        APIService.get_zhipeilist(shop4sId).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.zhipeilist = res.data.items
            } else {
                isError(res)
            }
        })
    }
    $scope.close = function () {
        $('.alert_bg').css('display', 'none')
        $('.zhipeilist').css('display', 'none')
    }
    $scope.start = function (data) {
        if (confirm('确定车行' + (data.directCompensation ? '关闭' : '开启') + '直赔资质')) {
            APIService.update_zhipei(data.id, !data.directCompensation).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg((data.directCompensation ? '关闭' : '开启') + '直赔成功');
                    if ($scope.shopList.length == 1) {
                        $scope.current = $scope.current - 1;
                        $scope.save_filter();
                    }
                    setTimeout(() => {
                        $scope.initData();
                    }, 500);
                } else {
                    isError(res)
                }
            })
        } else {
            $scope.initData();
        }
    }

    //删除
    $scope.delete = function () {
        if ($scope.checked.length == 0) {
            alert('未选中任何推修厂')
        } else {
            var data = 'id=';
            if ($scope.checked.length == 1) {
                data = data + $scope.checked[0];
            } else {
                angular.forEach($scope.checked, function (i, index) {
                    if (index != $scope.checked.length - 1) {
                        data = data + i + '&id='
                    } else {
                        data = data + i;
                    }
                })
            }
            APIService.delete_shop4S(data).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('删除成功');
                    setTimeout(function () {
                        if ($scope.shopList.length == 1) {
                            $scope.current = $scope.current - 1
                            $scope.save_filter();
                        }
                        $scope.initData();
                    }, 2000);
                } else {
                    isError(res);
                }
            })
        }

    }
    $scope.save_filter = function () {
        shop4s_filter.keyword = $scope.keyword;
        shop4s_filter.shop4s_current = $scope.current;
        shop4s_filter.status = $scope.status;
        sessionStorage.setItem('shop4s_filter', JSON.stringify(shop4s_filter));
    }
    $scope.Page = function (type) {
        if (type == 'home') {
            $scope.current = 1;
        }
        if (type == 'end') {
            $scope.current = $scope.pageCount;
        }
        if (type == 'down') {
            $scope.up = show;
            $scope.current = $scope.current + 1;
        }
        if (type == 'up') {
            $scope.current = $scope.current - 1;
        }
        $scope.save_filter();
        $scope.page_show();
        loading();
        APIService.paging(urlV1 + '/shop4s/page?keyword=' + $scope.keyword + '&directCompensation=' + $scope.status, limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.shopList = res.data.items;
            } else {
                isError(res)
            }

        })
    }
}])