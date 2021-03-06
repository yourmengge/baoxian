var batchaddorder = angular.module('batchaddorder', ['Road167']);
batchaddorder.controller('batchaddorderCtrl', ['$scope', 'APIService', "$http", function ($scope, APIService, $http) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }

    $scope.initData = function () {
        $scope.table = hide;
        $scope.list = '';
        $scope.companyNo = sessionStorage.getItem('companyNo').split('-')[0]
        if($scope.companyNo == 6){
            $scope.url = 'http://test.road167.com/insurance/picctemplate.xls'
        }else{
            $scope.url = 'http://test.road167.com/insurance/template.xls'
        }
        $scope.title = sessionStorage.getItem('disaster_title')
        $scope.disasterId = sessionStorage.getItem('disasterId_site');
    }
    $scope.clear = function () {
        document.getElementById("file").value = '';
    }
    $scope.file = function () {
        loading();
        var f = document.getElementById("file").value;
        $scope.file_title = document.getElementById("file").files[0].name;
        if (!/\.(xls|xlsx)$/.test(f)) {
            alert("文件类型必须是.xls或者.xlsx");
            $scope.file_title = '';
            document.getElementById("file").value = '';
            closeloading();
            return false;
        } else {
            var input = document.getElementById("file");
            var formData = new FormData();
            formData.append('file', input.files[0])
            $http({
                method: 'POST',
                url: host + urlV1 + urlOrder + '/disaster/import/' + $scope.disasterId,
                data: formData,
                headers: {
                    "Content-Type": undefined,
                    "Authorization": APIService.token,
                    "user-id": APIService.userId
                }, transformRequest: angular.identity,
            }).then(function (res) {
                if (res.data.http_status == 200) {
                    closeloading();
                    $scope.remarkId = res.data.tmpKey
                    $scope.list = res.data.tmpOrderList
                    $scope.table = show;
                } else if (res.data.http_status == 400) {
                    $scope.file_title = '';
                    alert(res.data.message)
                    document.getElementById("file").value = '';
                    closeloading();
                }
            })
        }
    }
    $scope.$watch('list', function (newValue) {
        if (newValue != '') {
            $('#add').removeClass('button_disabled').removeAttr("disabled");
        } else {
            $('#add').addClass('button_disabled ').attr("disabled", 'true');
        }
    })
    $scope.submit_order_list = function () {
        APIService.submit_order_list($scope.remarkId).then(function (res) {
            if (res.data.http_status == 200) {
                layer.msg('批量导入成功');
                setTimeout(function() {
                    location.reload();
                }, 2000);
            } else {
                isError(res);
            }
        })
    }
}])