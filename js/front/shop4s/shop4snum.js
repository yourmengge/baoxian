var shop4snum = angular.module('shop4snum', ['Road167']);
shop4snum.controller('shop4snumCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        loading();
        $scope.limit = 50;
        $scope.edit_div = hide;
        $scope.phone = '';
        $scope.Name = '';
        $scope.msg_type = '9';
        $scope.shop4sId = sessionStorage.getItem('select_shop4sId')
        $scope.get_shop4s_num_list($scope.shop4sId);
    }
    $scope.get_shop4s_num_list = function (shop4sId) {
        APIService.get_shop4s_num_list(shop4sId).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.list = res.data.items;
            } else {
                isError(res);
            }
        })
    }
    $scope.location = function (data) {
        if (confirm('确定' + (data.locateDiffLimit ? '关闭' : '开启') + '该人员的定损位置限定')) {
            APIService.dingsun_location(data.id, !data.locateDiffLimit).then(function (res) {
                if(res.data.http_status == 200){
                    layer.msg('切换成功');
                    setTimeout(() => {
                        $scope.initData();
                    }, 2000);
                }else{
                    isError(res)
                }
            })
        }

    }
    $scope.deletePhone = function (data) {
        if (confirm('确定将解除该账号绑定的手机，该账号可以重新绑定新的手机')) {
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
        $scope.editName = data.afterSaleMgr;
        $scope.shop4sUserId = data.id;
    }
    $scope.shop4sMsg = function (type) {
        return shop4sMsg(type)
    }
    $scope.submit_edit = function () {
        APIService.update_shop4s_msg({ id: $scope.shop4sUserId, afterSaleMgr: $scope.editName }).then(function (res) {
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
    $scope.msgText = [{
        id: '9',
        name: '车商人员'
    }, {
        id: '8',
        name: '4S店人员'
    }]
    $scope.delete = function (data) {

        if (confirm('是否确认删除' + (data.type == 8 ? '4S店人员' : '车商人员') + (data.afterSaleMgr == null ? '' : data.afterSaleMgr) + '吗？')) {
            loading();
            APIService.delete_afterSaleMgr(data.id).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {
                    layer.msg('删除成功！');
                    setTimeout(function () {
                        $scope.close();
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
                "shop4sId": $scope.shop4sId,
                "afterSaleMgr": $scope.Name,
                "afterSalePhone": $scope.phone,
                "type": $scope.msg_type
            }
            loading();
            APIService.add_shop4s_msg(data).then(function (res) {
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

}])