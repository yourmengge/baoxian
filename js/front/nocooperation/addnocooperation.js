var addnocooperation = angular.module('addnocooperation', ['Road167']);
addnocooperation.controller('addnocooperationCtrl', ['$scope', 'APIService', "$http", function ($scope, APIService, $http) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
        sessionStorage.removeItem('shop4S_data');
        sessionStorage.removeItem('shop4S');
    }
    var address = {
        address: '',
        lat: '',
        lng: ''
    }
    $scope.branchOne = branchOne;
    $scope.branchTwo = branchTwo;
    $scope.branchThree = branchThree;
    $scope.branch = function (type) {
        $scope.data.branchCompany = type;
        console.log(type)
        $scope.change();
    }
    $scope.initData = function () {
        $scope.data = {
            // "noPushFixCode": '',
            "branchCompany": '',
            "fullName": '',
            "address": '',
            "longitude": '',
            "latitude": '',
            "type": 2
            // "afterSaleMgr": '',
            // "afterSalePhone": '',
            // "afterSaleMgr2": '',
            // "afterSalePhone2": '',
            // "dealer": '',
            // "dealerPhone": ''
        }
        if (JSON.parse(sessionStorage.getItem('shop4S_data') != '') && JSON.parse(sessionStorage.getItem('shop4S_data') != undefined)) {
            $scope.data = JSON.parse(sessionStorage.getItem('shop4S_data'))
            //$scope.noPushFixCode = $scope.data.noPushFixCode;
            if (sessionStorage.getItem('nocoopertation') != null && sessionStorage.getItem('nocoopertation') != '') {
                $scope.address = sessionStorage.getItem('nocoopertation');
                address.address = $scope.address;
                address.lat = sessionStorage.getItem('nocoopertation_nar_lat');
                address.lng = sessionStorage.getItem('nocoopertation_nar_lng');
            } else {
                $scope.address = $scope.data.address;
                address.address = $scope.address;
                address.lat = $scope.data.latitude;
                address.lng = $scope.data.longitude;
            }

        }

        if (sessionStorage.getItem('shop4S_type') == 'addshop4s') {
            $scope.title = '添加'
        } else {
            $scope.data = JSON.parse(sessionStorage.getItem('shop4S_data'))
            $scope.title = '修改'
        }

    }

    //确定按钮
    $scope.submit_button = function () {
        if (sessionStorage.getItem('shop4S_type') == 'addshop4s') {
            $scope.add_shop4S($scope.data, address);
        } else {
            $scope.update_shop4S($scope.data, address);
        }
    }

    //添加推修厂
    $scope.add_shop4S = function (data, address) {
        data.address = address.address;
        data.latitude = address.lat;
        data.longitude = address.lng;
        APIService.add_shop4S(data).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('添加成功');
                setTimeout(function () {
                    sessionStorage.removeItem('shop4S_data');
                    sessionStorage.removeItem('shop4S');
                    $scope.back();
                }, 2000);
            } else {
                isError(res);
            }
        })
    }

    //修改推修厂
    $scope.update_shop4S = function (data, address) {
        data.address = address.address;
        data.latitude = address.lat;
        data.longitude = address.lng;
        APIService.update_shop4S(data).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('修改成功');
                setTimeout(function () {
                    sessionStorage.removeItem('shop4S_data');
                    sessionStorage.removeItem('nocoopertation');
                    $scope.back();
                }, 2000);
            } else {
                isError(res);
            }
        })
    }
    $scope.change = function () {
        sessionStorage.setItem('shop4S_data', JSON.stringify($scope.data));
    }
    $scope.selectMap = function (type) {
        sessionStorage.setItem('addorder_nar_type', '修理厂')
        sessionStorage.setItem('shop4S_data', JSON.stringify($scope.data));
        goto_view('main/nar_location');
    }

    $scope.reset = function () {
        if (confirm('重置后页面填写的信息将被清空')) {
            sessionStorage.setItem('shop4S_data', '{}');
            sessionStorage.setItem('nocoopertation', '')
            $scope.initData();
        }
    }
}])