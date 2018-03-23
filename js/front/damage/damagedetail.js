var detail = angular.module('damagedetail', ['Road167']);
detail.controller('damagedetailCtrl', ['$scope', 'APIService', function($scope, APIService) {
    $scope.initData = function() {
        $scope.caseNo = sessionStorage.getItem('caseNo')
        $scope.carNo = sessionStorage.getItem('carNo')

    }
    $scope.$on('summon', function(e, newLocation) {
        console.log(newLocation)
        $scope.detail = newLocation;
    });
}])