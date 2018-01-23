var caijidetail = angular.module('caijidetail', ['Road167']);
caijidetail.controller('caijidetailCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {

    }
    $scope.detail = function () {
        APIService.get_order_detail().then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.detail = res.data;
                if (res.data.verifyAddressItems != null) {
                    $scope.fix_change_list = res.data.verifyAddressItems.items.reverse();
                }

            } else {
                isError(res);
            }
        })
    }
}])