var brand = angular.module('brand', ['Road167']);
brand.controller('brandCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.checked = [];
        $scope.select_one = false;
        $scope.keyword = '';
        $scope.all = false;
        $scope.page_p = show;
        $scope.current = 1;
        $scope.limit = limit;
        $scope.Name = '';
        $scope.close();
        if (sessionStorage.getItem('filter_data') != undefined) {
            var data = JSON.parse(sessionStorage.getItem('filter_data'));
            $scope.keyword = data.keyword;
            $scope.current = data.current;
        }
        $scope.get_shop4S_page();
    }
    $scope.filter = {
        current: '',
        keyword: ''
    }
    //查询全部
    $scope.searchAll = function () {
        sessionStorage.removeItem('filter_data')
        $scope.initData();
    }
    $scope.save_data = function () {
        
        $scope.filter.current = $scope.current;
        $scope.filter.keyword = $scope.keyword;
        sessionStorage.setItem('filter_data', JSON.stringify($scope.filter))
    }
    $scope.search = function () {
        $scope.current = 1;
        $scope.save_data();
        $scope.get_shop4S_page();
    }
    //获取4S店列表
    $scope.get_shop4S_page = function () {
        APIService.get_car_brand($scope.limit, ($scope.current - 1) * 10, $scope.keyword).then(function (res) {
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
    $scope.goto = function (data) {
        sessionStorage.setItem('brand_data', JSON.stringify(data))
        goto_view('main/brandcfg')
    }

    $scope.submit_add = function () {
        var data = {
            name: $scope.Name
        }
        if ($scope.type == '添加') {
            APIService.add_car_brand(data).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('添加成功')
                    setTimeout(function () {
                        $scope.initData()
                    }, 2000);
                } else {
                    isError(res);
                }
            })

        } else {
            APIService.update_car_brand($scope.brandId, data).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('修改成功')
                    setTimeout(function () {
                        $scope.initData()
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

    // //页面跳转
    // $scope.goto = function (type, a) {
    //     sessionStorage.setItem('shop4S_type', type)
    //     sessionStorage.setItem('select_shop4sId', a.shop4sId)
    //     if (a == '') {
    //         sessionStorage.removeItem('shop4S_data');
    //     } else {
    //         sessionStorage.setItem('shop4S_data', JSON.stringify(a));
    //     }
    //     if (type == 'add') {
    //         goto_view('main/shop4snum')
    //     } else {
    //         goto_view('main/addshop4S')
    //     }

    // }


    //添加
    $scope.add = function (data) {
        if (data == '') { //添加动作
            $('.alert_bg').css('display', 'block')
            $('.addinspector_div').toggle();
            $scope.type = '添加'
        } else {
            $('.alert_bg').css('display', 'block')
            $('.addinspector_div').toggle();
            $scope.type = '修改'
            $scope.Name = data.name;
            $scope.brandId = data.id;
        }


    }
    $scope.close = function () {
        $scope.Name = '';
        $('.alert_bg').css('display', 'none')
        $('.addinspector_div').css('display', 'none')
    }
    //删除
    $scope.del = function (data) {
        if (confirm('确定移除' + data.name + ',删除后配置的推修厂及订单比例一并移除？')) {
            APIService.delete_car_brand(data.id).then(function (res) {
                if (res.data.http_status == 200) {
                    closeloading();
                    layer.msg('移除成功');
                    setTimeout(function () {
                        $scope.initData()
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
        $scope.save_data();
        APIService.paging(urlV1 + '/car-brand/page?name=' + $scope.keyword, $scope.limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.shopList = res.data.items;
            } else {
                isError(res)
            }

        })
    }
}])