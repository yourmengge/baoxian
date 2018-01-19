var member = angular.module('member', ['Road167']);
member.controller('memberCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.checked = [];
        $scope.select_one = false;
        $scope.keyword = '';
        $scope.all = false;
        $scope.page_p = show;
        $scope.current = 1;
        $scope.limit = limit;
        $scope.status = '';
        $scope.Name = '';
        $scope.get_shop4S_page();
    }
    //查询全部
    $scope.searchAll = function () {
        $scope.initData();
    }
    $scope.search = function () {
        $scope.current = 1;
        $scope.get_shop4S_page();
    }
    //获取4S店列表
    $scope.get_shop4S_page = function () {
        loading()
        APIService.get_member_page($scope.limit, ($scope.current - 1) * 10, $scope.keyword, 'true', $scope.status).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.shopList = res.data.items;
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
                isError(res);
            }
        })
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
    //获取推修厂列表
    $scope.get_member_list = function () {
        $scope.shop4sId = '';
        APIService.get_member_list(3, 0, $scope.Name, 'false').then(function (res) {
            if (res.data.http_status == 200) {
                if (res.data.count == 0) {
                    $scope.list = [{
                        fullName: '未找到符合条件的推修厂',
                        id: '-1'
                    }]
                } else {
                    $scope.list = res.data.items;
                }

            } else {
                isError(res);
            }
        })
    }
    $scope.select = function (data) {
        if (data.id == -1) {

        } else {
            $scope.Name = data.fullName;
            $scope.shop4sId = data.shop4sId;
            $scope.list = '';
        }

    }
    $scope.submit_add = function () {
        if ($scope.shop4sId == '') {
            layer.msg('请选择推修厂')
        } else {
            APIService.add_delete_member($scope.shop4sId, 'true').then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('添加成功')
                    setTimeout(function () {
                        $scope.close();
                        $scope.initData();
                    }, 2000);
                } else {
                    isError(res);
                }
            })
        }
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

    //页面跳转
    $scope.goto = function (type, a) {
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


    //添加
    $scope.add = function () {
        $('.alert_bg').css('display', 'block')
        $('.addinspector_div').toggle();

    }
    $scope.close = function () {
        $scope.Name = '';
        $('.alert_bg').css('display', 'none')
        $('.addinspector_div').css('display', 'none')
    }
    //删除
    $scope.del = function (data) {
        if (confirm('确定移除' + data.fullName + '吗？')) {
            APIService.add_delete_member(data.id, 'false').then(function (res) {
                if (res.data.http_status == 200) {
                    closeloading();
                    layer.msg('移除成功');
                    setTimeout(function () {
                        $scope.initData();
                    }, 2000);
                } else {
                    isError(res)
                }

            })
        }

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
        $scope.page_show();
        loading();
        APIService.paging(urlV1 + '/shop4s/page?isMember=true&keyword=' + $scope.keyword + '&directCompensation=' + $scope.status, $scope.limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.shopList = res.data.items;
            } else {
                isError(res)
            }

        })
    }
}])