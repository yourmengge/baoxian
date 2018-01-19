var confirmation = angular.module('confirmation', ['Road167']);
confirmation.controller('confirmationCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        //$scope.orderNo = '1801090022'
        $scope.orderNo = sessionStorage.getItem('orderNo')
        loading()
        APIService.get_zhipei_confirmation($scope.orderNo).then(function (res) {
            closeloading()
            if (res.data.http_status == 200) {
                $scope.detail = res.data;
            } else {
                isError(res)
            }
        })
    }
    $scope.isNull = function (data) {
        return (data == '' || data == null) ? true : false
    }
    $scope.openImg = function (path) {
        if (path != null) {
            window.open(path)
        }

    }
}])