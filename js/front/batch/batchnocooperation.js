var batchnocooperation = angular.module('batchnocooperation', ['Road167']);
batchnocooperation.controller('batchnocooperationCtrl', ['$scope', 'APIService', "$http", function ($scope, APIService, $http) {
    /**
     *返回上页 
     */
    $scope.back = function () {
        window.history.back();
    }

    $scope.initData = function () {
        $scope.table = hide;
        $scope.list = '';
        $scope.url = 'https://t.road167.com/insurance/shop4snocooperation.xlsx'

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
                url: host + urlV1 + '/shop4s/import2',
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
                    $scope.list = res.data.tmpList
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
        if (confirm('确定导入页面信息')) {
            APIService.submit_shop4S_list2($scope.remarkId).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('批量导入成功');
                    setTimeout(function () {
                        $scope.back();
                    }, 2000);
                } else {
                    isError(res);
                }
            })
        } else {
            isError(res)
        }

    }
}])