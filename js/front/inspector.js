var inspector = angular.module('inspector', ['Road167']);
inspector.controller('inspectorCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        loading();
        $scope.limit = 50;
        $scope.edit_div = hide;
        $scope.phone = '';
        $scope.Name = '';
        $scope.current = 1;
        $scope.keyword = '';
        if (sessionStorage.getItem('inspectorFilter') != undefined) {
            $scope.filter = JSON.parse(sessionStorage.getItem('inspectorFilter'))
            $scope.keyword = $scope.filter.keyword;
            $scope.current = $scope.filter.current;
        }
        $scope.get_inspector_list();
    }
    var inspectorFilter = {
        keyword: '',
        current: 1
    }
    $scope.searchALL = function () {
        inspectorFilter.keyword = '';
        $scope.saveFilter();
        $scope.initData();
    }
    $scope.initFilter = function () {
        inspectorFilter = {
            keyword: '',
            current: 1
        }
    }
    $scope.saveFilter = function () {
        sessionStorage.setItem('inspectorFilter', JSON.stringify(inspectorFilter));
    }
    $scope.search = function () {
        $scope.current = 1;
        $scope.get_inspector_list();
        inspectorFilter.keyword = $scope.keyword;
        inspectorFilter.current = $scope.current;
        $scope.saveFilter();
    }
    $scope.currentPage = function () {
        return $scope.limit * ($scope.current - 1);
    }
    $scope.get_inspector_list = function () {
        APIService.get_inspector_list($scope.limit, $scope.currentPage(), $scope.keyword).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.userList;
                //分页部分
                // $scope.current = 1;
                $scope.pageCount = Math.ceil(res.data.count / $scope.limit);
                if (res.data.count <= $scope.limit) {
                    $scope.page_p = hide;
                }
                if ($scope.current == 1) {
                    $scope.up = hide;
                } else if ($scope.current == $scope.pageCount) {
                    $scope.down = hide;
                }

                //分页结束
            } else {
                isError(res);
            }
        })

    }
    $scope.deletePhone = function (data) {
        if (confirm('确定将解除查勘员绑定的手机，查勘员可以重新绑定新的手机')) {
            APIService.delete_phone(data.userId).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('解绑成功')
                    setTimeout(function () {
                        $scope.initData();
                    }, 2000);
                } else {
                    isError(res)
                }
            })
        }
    }
    $scope.update = function (data) {
        $('.alert_bg').css('display', 'block');
        $scope.edit_div = show;
        $('#edit').css('display', 'block');
        $scope.editName = data.name;
        $scope.editPhone = data.phone;
        $scope.userId = data.userId;
    }
    $scope.submit_edit = function () {
        APIService.update_user_name($scope.userId, {
            name: $scope.editName,
            phone: $scope.editPhone
        }).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('修改成功');
                setTimeout(function () {
                    $scope.close();
                    $scope.initData();
                }, 1000);
            } else {
                isError(res)
            }
        })
    }

    $scope.addDriver = function () {
        $('.alert_bg').css('display', 'block')
        $('.addinspector_div').toggle();
    }

    $scope.close = function () {
        $scope.phone = '';
        $scope.Name = '';
        $('#edit').css('display', 'none');
        $scope.edit_div = hide;
        $('.alert_bg').css('display', 'none')
        $('.addinspector_div').css('display', 'none')
        $('.update_inspector').css('display', 'none')
    }
    $scope.output = function () {
        window.open(host + urlV1 + '/excel/inpsector/export?Authorization=' + APIService.token + '&user-id=' + APIService.userId + '&keyword=' + $scope.keyword)
    }
    $scope.delete = function (data) {

        if (confirm('确定离职' + data.name + '吗？')) {
            loading();
            APIService.delete_inspector(data.userId).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {
                    layer.msg('离职成功！');
                    if ($scope.list.length == 1) {
                        $scope.current--;
                        inspectorFilter.current = $scope.current;
                    }
                    setTimeout(function () {
                        $scope.initData();
                    }, 1000);
                } else {
                    isError(res);
                }
            })
        }
    }
    $scope.submit_add = function () {

        if (isPhone.test($scope.phone)) {
            var data = {
                'name': $scope.Name,
                'phone': $scope.phone
            }
            loading();
            APIService.add_inspector(data).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {

                    layer.msg('添加成功');
                    setTimeout(function () {
                        $scope.close();
                        $scope.initData();
                    }, 1000);

                    $scope.cencle();
                } else {
                    isError(res);
                }
            })
        } else {
            layer.msg('请输入合法的手机号码')
        }


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
        inspectorFilter.current = $scope.current;
        $scope.saveFilter();
        loading();
        APIService.paging(urlV1 + '/third/user?roleId=3&bOrderCounts=true', $scope.limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.userList;
            } else {
                isError(res)
            }

        })
    }
}])