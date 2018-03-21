var detail = angular.module('damagedetail', ['Road167']);
detail.controller('damagedetailCtrl', ['$scope', 'APIService', function($scope, APIService) {
    $scope.initData = function() {
        $scope.caseNo = sessionStorage.getItem('caseNo')
        $scope.carNo = sessionStorage.getItem('carNo')
        $scope.getDamageDetail();
    }
    $scope.getDamageDetail = function() {
        APIService.get_damage_detail($scope.caseNo, $scope.carNo).then(function(res) {
            if (res.data.http_status == 200) {
                $scope.detail = res.data;
                $scope.damagelist = res.data.items;
            } else {
                isError(res)
            }
        })
    }
}])