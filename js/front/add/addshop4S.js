var addshop4S = angular.module('addshop4S', ['Road167']);
addshop4S.controller('addshop4SCtrl', ['$scope', 'APIService', "$http", function ($scope, APIService, $http) {
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

    $scope.initData = function () {
        $scope.data = {
            "branchCompany": '',
            "pushFixCode": '',
            "fullName": '',
            "simpleName": '',
            "address": '',
            "longitude": '',
            "latitude": '',
            'allowedDiff': ''
        }
        // $scope.data.noPushFixCode = false;
        if (JSON.parse(sessionStorage.getItem('shop4S_data') != '') && JSON.parse(sessionStorage.getItem('shop4S_data') != undefined)) {
            $scope.data = JSON.parse(sessionStorage.getItem('shop4S_data'))
            //$scope.noPushFixCode = $scope.data.noPushFixCode;
            if (sessionStorage.getItem('shop4S') != null && sessionStorage.getItem('shop4S') != '') {
                $scope.address = sessionStorage.getItem('shop4S');
                address.address = $scope.address;
                address.lat = sessionStorage.getItem('shop4S_nar_lat');
                address.lng = sessionStorage.getItem('shop4S_nar_lng');
            } else {
                $scope.address = $scope.data.address;
                address.address = $scope.address;
                address.lat = $scope.data.latitude;
                address.lng = $scope.data.longitude;
            }
        }

        $scope.shop4s_type = sessionStorage.getItem('shop4S_type');
        if ($scope.shop4s_type == 'addshop4s') {
            $scope.title = '添加推修厂'
        } else if ($scope.shop4s_type == 'update') {
            $scope.data = JSON.parse(sessionStorage.getItem('shop4S_data'))
            $scope.title = '修改推修厂'
        } else if ($scope.shop4s_type == 'change') {
            // $scope.data = {
            //     fullName: ''
            // }
            $scope.data.fullName = JSON.parse(sessionStorage.getItem('shop4S_data')).fullName;
            $scope.title = '转为推修厂'
        }


    }

    //确定按钮
    $scope.submit_button = function () {
        if ($scope.shop4s_type == 'addshop4s') {
            $scope.add_shop4S($scope.data, address);
        } else if ($scope.shop4s_type == 'update') {
            $scope.update_shop4S($scope.data, address);
        } else if ($scope.shop4s_type == 'change') {
            if (confirm('确认将这修理厂转为推修厂')) {
                $scope.change_shop4S($scope.data, address);
            }
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
                    goto_view('main/shop4S')
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
                    sessionStorage.removeItem('shop4S');
                    goto_view('main/shop4S')
                }, 2000);
            } else {
                isError(res);
            }
        })
    }

    //转为推修厂
    $scope.change_shop4S = function (data, address) {
        data.address = address.address;
        data.latitude = address.lat;
        data.longitude = address.lng;
        data.id = sessionStorage.getItem('changeId')
        APIService.change_shop4S(data).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('转换成功');
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

    $scope.change = function () {
        sessionStorage.setItem('shop4S_data', JSON.stringify($scope.data));
    }
    $scope.selectMap = function (type) {
        sessionStorage.setItem('addorder_nar_type', '车行')
        sessionStorage.setItem('shop4S_data', JSON.stringify($scope.data));
        goto_view('main/nar_location');
    }



    $scope.$watch('data.pushFixCode', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts1 = 0;
        } else {
            $scope.counts1 = 1;
        }
    });
    $scope.$watch('address', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts4 = 0;
        } else {
            $scope.counts4 = 1;
        }
    });
    $scope.$watch('data.fullName', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts3 = 0;
        } else {
            $scope.counts3 = 1;
        }
    });
    $scope.$watch('data.allowedDiff', function (newValue, oldValue) {
        if (newValue == '' || newValue == null) {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
            $scope.counts5 = 0;
        } else {
            if (newValue > 1 && newValue < 9999) {
                $scope.counts5 = 1;
            }

        }
    });
    $scope.$watch('counts1  + counts3  + counts4 + counts5', function (newValue, oldValue) {
        if (newValue == 4) {
            $('#submit').removeAttr("disabled").removeClass('button_disabled');
        } else {
            $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
        }
    });
    // $scope.$watch('data.noPushFixCode', function (newValue) {
    //     if (newValue == true) {
    //         $scope.data.pushFixCode = ''
    //         $scope.address = '';
    //         sessionStorage.removeItem('shop4S')
    //     } else {
    //         $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
    //     }
    //     $scope.change();
    // })
    // $scope.$watch('counts1  + counts3  + counts4', function (newValue, oldValue) {
    //     if ($scope.data.noPushFixCode) {
    //         if (newValue == 1) {
    //             $('#submit').removeAttr("disabled").removeClass('button_disabled');
    //         } else {
    //             $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
    //         }
    //     } else {
    //         if (newValue == 3) {
    //             $('#submit').removeAttr("disabled").removeClass('button_disabled');
    //         } else {
    //             $('#submit').addClass('button_disabled').attr("disabled", 'disabled');
    //         }
    //     }
    // });
    $scope.reset = function () {
        if (confirm('重置后页面填写的信息将被清空')) {
            sessionStorage.setItem('shop4S_data', '{}');
            sessionStorage.setItem('shop4S', '')
            $scope.initData();
        }
    }
}])