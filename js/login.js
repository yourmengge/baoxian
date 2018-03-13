var login = angular.module('login', ['Road167']);

login.controller('loginCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.login = function () {
        if ($scope.name != null && $scope.password != null) {
            loading();
            APIService.login($scope.name, $scope.password).then(function (res) {
                if (res.data.http_status == 200) {
                    reloadMenuList();
                    sessionStorage.removeItem('second_type')
                    closeloading();
                    layer.msg('登录成功');
                    sessionStorage.setItem('lmId', 1)
                    sessionStorage.setItem('funcList', res.data.funcList)
                    if (res.data.roleId == '72') { //理算人员
                        sessionStorage.setItem('whichRole', 'liSuan')
                        sessionStorage.setItem('lmId', 'lm2')
                        setTimeout(function () {
                            goto_view('main/orderlist');
                        }, 1000);
                    } else if (res.data.roleId == '71') { //车商人员
                        sessionStorage.setItem('whichRole', 'shop4sAdmin')
                        sessionStorage.setItem('lmId', 'lm9')
                        sessionStorage.setItem('audit_type', 'info')
                        setTimeout(function () {
                            goto_view('main/shop4S');
                        }, 1000);
                    } else if ((res.data.userFlag & 1) > 0) { //查看三者车
                        sessionStorage.setItem('whichRole', 'third')
                        setTimeout(function () {
                            goto_view('main/third');
                        }, 1000);
                    } else { //保险人员
                        sessionStorage.setItem('whichRole', 'admin')
                        setTimeout(function () {
                            goto_view('main');
                        }, 1000);
                    }
                }
                isError(res)
            })
        } else {
            layer.msg('账号密码不能为空')
        }

    }
    // $(document).keydown(function (e) {
    //     console.log(e.keyCode);
    //     var theEvent = e || window.event;
    //     var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    //     if (code == 13 || code == 108) {
    //         $scope.login();
    //         return false;
    //     }
    //     return true;
    // });
    $scope.keydown = function (e) {
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13 || code == 108) {
            $scope.login();
            return false;
        }
        return true;
    }

    function contains(e, d) {
        for (var i = 0; i < e.length; i++) {
            if (d == e[i]) {
                return true;
            }
        }
    }
}])