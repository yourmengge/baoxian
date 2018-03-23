var detail = angular.module('damage', ['Road167']);
detail.controller('damageCtrl', ['$scope', 'APIService', function($scope, APIService) {
    $scope.initData = function() {
        $scope.caseNo = sessionStorage.getItem('caseNo')
        $scope.carNo = sessionStorage.getItem('carNo')
        $scope.type = sessionStorage.getItem('orderdetail')
        $scope.getDamageDetail();
    }
    $scope.getDamageDetail = function() {
        APIService.get_damage_detail($scope.caseNo, $scope.carNo).then(function(res) {
            if (res.data.http_status == 200) {
                $scope.detail = res.data;
                $scope.damagelist = res.data.items;
                $scope.$emit('summon', $scope.detail);
                for (let i in $scope.damagelist) {
                    if ($scope.damagelist[i].pictures != null && $scope.damagelist[i].pictures.length >= 6) {
                        $scope.damagelist[i].pic = $scope.damagelist[i].pictures.slice(0, 6);
                        $scope.damagelist[i].show = true;
                    } else {
                        $scope.damagelist[i].pic = $scope.damagelist[i].pictures;
                        $scope.damagelist[i].show = false;
                    }
                }
            } else {
                isError(res)
            }
        })
    }
    $scope.openImg = function(i) {
        if ($scope.damagelist[i].show) {
            $scope.damagelist[i].pic = $scope.damagelist[i].pictures;
            $scope.damagelist[i].show = false;
        } else {
            $scope.damagelist[i].pic = $scope.damagelist[i].pictures.slice(0, 6);
            $scope.damagelist[i].show = true;
        }
        console.log($scope.damagelist)
    }
    $scope.download = function(url) {
        window.open(url)
    }

}])