var brandcfg = angular.module('brandcfg', ['Road167']);
brandcfg.controller('brandcfgCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {

        $scope.keyword = '';
        $scope.page_p = show;
        $scope.current = 1;
        $scope.limit = limit;
        $scope.Name = '';
        $scope.status = '';
        $scope.addShop4sId = ''
        $scope.detail = JSON.parse(sessionStorage.getItem('brand_data'));
        $scope.close();
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
        APIService.get_car_brand_list($scope.detail.id, $scope.keyword, $scope.status).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                $scope.shopList = res.data.items;
                $scope.list = res.data.items;
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
    $scope.submit_add = function () {
        var data = {
            "shop4sId": $scope.addShop4sId,
            "carBrandId": $scope.detail.id
        }
        if ($scope.addShop4sId == '') {
            layer.msg('请选择推修厂')
        } else {
            loading();
            APIService.add_shop4s_to_brand(data).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {
                    layer.msg('添加成功')
                    setTimeout(function () {
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
        sessionStorage.setItem('select_shop4sId', a.shop4sId)
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

    $scope.select = function (data) {
        if (data.id == -1) {

        } else {
            $scope.addShop4sId = data.id;
            $scope.list1 = '';
            $scope.Name = data.fullName;
        }
    }

    //添加
    $scope.add = function (data) {
        if (data == '') { //添加动作
            $('.alert_bg').css('display', 'block')
            $('.addinspector_div').toggle();
            $scope.type = '添加'
        }
    }
    //配置
    $scope.cfg = function () {
        $('.alert_bg').css('display', 'block');
        $('.weightCfg_div').toggle();
        $scope.disabled = false;

    }
    $scope.close = function () {
        $scope.Name = '';
        $('.alert_bg').css('display', 'none')
        $('.weightCfg_div').css('display', 'none')
        $('.addinspector_div').css('display', 'none')
        $scope.get_shop4S_page();
    }
    $scope.isIntNum = function (num) {
        if (parseInt(num) == num) {
            return true;
        } else {
            return false;
        }
    }
    //输入配额
    $scope.inputNum = function (index, a) {
        if (a > 100 || a < 0 || !$scope.isIntNum(a)) {
            layer.msg('请输入0到100的自然数');
            $scope.disabled = true;
        } else {
            $scope.disabled = false;
            $scope.list[index].weight = a;
            var totle = 0;
            for (let i in $scope.list) {
                totle = totle + $scope.list[i].weight;
            }
            if (totle == 0) {
                for (let i in $scope.list) {
                    $scope.list[i].percentage = 100 / $scope.list.length
                }
            } else {
                for (let i in $scope.list) {
                    $scope.list[i].percentage = parseInt(($scope.list[i].weight / totle) * 100)
                }
            }
        }

    }
    $scope.get_member_list = function () {
        APIService.get_not_exist_shop4s($scope.detail.id, $scope.Name).then(function (res) {

            if (res.data.http_status == 200) {
                if (res.data.count == 0) {
                    $scope.list1 = [{
                        fullName: '未找到符合条件的推修厂',
                        id: '-1'
                    }]
                } else {
                    $scope.list1 = res.data.items;
                }
            } else {
                isError(res);
            }
        })
    }
    //提交配额
    $scope.update_cfg = function () {
        var data = {
            "req": [],
            "carBrandId": $scope.detail.id

        }
        var temp = {
            "shop4sId": '',
            "weight": ''
        }
        if ($scope.list.length != 0) {
            for (let i in $scope.list) {
                temp.shop4sId = $scope.list[i].shop4sId;
                temp.weight = $scope.list[i].weight;
                data.req.push(temp);
                temp = {
                    "shop4sId": '',
                    "weight": ''
                }
            }
            loading()
            APIService.update_car_brand_cfg(data).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {
                    closeloading();
                    layer.msg('数据保存成功');
                    setTimeout(function () {
                        $scope.initData();
                    }, 2000);
                } else {
                    isError(res)
                }

            })
        }else{
            $scope.close();
        }

    }
    //删除
    $scope.del = function (data) {
        if (confirm('确定移除' + data.shop4sFullName + '吗？')) {
            loading()
            APIService.delete_car_brand_shop4s(data.id).then(function (res) {
                closeloading();
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

    
}])