var damagelist = angular.module('damagelist', ['Road167']);
damagelist.controller('damagelistCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.selectText = [{
        id: '',
        name: '新上传'
    }, {
        id: '1',
        name: '所有'
    }]
    $scope.init = function(){
        $scope.select = '';
    }
    $scope.initData = function(){
        $scope.init();
    }
}])