var caijidetail = angular.module('caijidetail', ['Road167']);
caijidetail.controller('caijidetailCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.init();
    }
    $scope.init = function () {
        $scope.url = sessionStorage.getItem('threecars')
        if ($scope.url === 'threecars') {
            $scope.title = '三者车采集详情'
        } else {
            $scope.title = '采集详情'
        }
    }
    $scope.isWeicaijiNull = function (weicaiji, text) {
        return weicaiji == '' ? text : '、' + text
    }
    $scope.detail = function () {
        APIService.get_order_detail().then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.detail = res.data;
                $scope.weicaiji = '';
                $scope.detail.licenseInfo = res.data;
                if ($scope.detail.licenseInfo.idCard == null) {
                    $scope.weicaiji = $scope.isWeicaijiNull($scope.weicaiji, '身份证');
                }
                if ($scope.detail.licenseInfo.drivingLicense == null) {
                    $scope.weicaiji = $scope.weicaiji + $scope.isWeicaijiNull($scope.weicaiji, '行驶证');
                }
                if ($scope.detail.licenseInfo.driverLicense == null) {
                    $scope.weicaiji = $scope.weicaiji + $scope.isWeicaijiNull($scope.weicaiji, '驾驶证');
                }
                if ($scope.detail.licenseInfo.insurancePolicy == null) {
                    $scope.weicaiji = $scope.weicaiji + $scope.isWeicaijiNull($scope.weicaiji, '保单');
                }
                if ($scope.weicaiji.split('、').length == 4) {
                    $scope.weicaiji = '无采集证照'
                }

            } else {
                isError(res);
            }
        })
    }
}])