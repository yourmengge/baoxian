var detail = angular.module('detail', ['Road167']);
var map, orderPic = [],
    accidentPic = [],
    fixPic = [];
detail.controller('detailCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        $scope.openDetail = -1;
        $scope.zhipeiremark = '';
        $scope.disaster = sessionStorage.getItem('isDisaster')
        if ($scope.disaster == 'yes') {
            $scope.title = sessionStorage.getItem('disaster_title')
            $scope.text = '接单司机';
            $scope.driverText = '接单'
        } else {
            $scope.text = '施救车队'
            $scope.driverText = '派遣'
        }
        loading();
        orderPic = [];
        accidentPic = [];
        fixPic = [];
        //$scope.order = '1712200006'
        $scope.order = sessionStorage.getItem('orderNo');
        APIService.get_order_detail($scope.order).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.detail = res.data;
                $scope.assignDriverses = res.data.assignDriverses;
                if (res.data.verifyAddressItems != null) {
                    $scope.fix_change_list = res.data.verifyAddressItems.items.reverse();
                }
                $scope.authDirBilCancel = $scope.detail.authDirBilCancel;
                if ($scope.authDirBilCancel == null) {
                    $scope.confirmationDiv = true;
                } else {
                    $scope.hideZhipeiFN($scope.authDirBilCancel);
                    $scope.hideCancelTypeFN($scope.authDirBilCancel);
                    $scope.hideButtonFN($scope.authDirBilCancel);
                    $scope.hideCancelButtonFN($scope.authDirBilCancel);
                    $scope.hideCancelFN($scope.authDirBilCancel);
                }

                // $scope.pictures = $scope.detail.assignDriverses.pictureAndVideo;
                // if ($scope.pictures.length != 0) {
                //     for (var i = 0; i < $scope.pictures.length; i++) {
                //         if ($scope.pictures[i].type == 1) {
                //             orderPic.push($scope.pictures[i]);
                //             $scope.order_pic = orderPic;
                //         } else if ($scope.pictures[i].type == 2) {
                //             accidentPic.push($scope.pictures[i]);
                //             $scope.accident_pic = accidentPic;
                //         } else {
                //             fixPic.push($scope.pictures[i]);
                //             $scope.fix_pic = fixPic;
                //         }
                //     }
                //     console.log($scope.accident_pic)
                // }

            } else {
                isError(res);
            }
        })
    }
    $scope.isDriverFinish = function (taskFlag) {
        console.log(isDriverFinish(taskFlag));
        return isDriverFinish(taskFlag);
    }
    $scope.taskCancel = function (taskFlag) {
        return isCancel(taskFlag);
    }
    $scope.openDiv = function (index, roleType) {
        if ($scope.openDetail == index) {
            $scope.openDetail = -1;

        } else {
            $scope.openDetail = index;
            APIService.get_bodajilu_list($scope.order, roleType).then(function (res) {
                if (res.data.http_status == 200) {
                    $scope.bodalist = res.data.items;
                } else {
                    isError(res)
                }
            })
        }


    }
    $scope.confirmation = function () {
        APIService.get_order_detail($scope.order).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.detail = res.data;
                if ($scope.detail.authDirBilCancel.verifyStatus != 900) {
                    goto_view('main/confirmation')
                } else {
                    layer.msg('直赔已取消')
                }
            } else {
                isError(res);
            }
        })
    }
    $scope.dialTypeTexts = [
        '', '报案人', '查勘姓名', '司机姓名'
    ]
    $scope.back = function () {
        window.history.go(-1);
    }
    $scope.openPic = function (path) {
        window.open(path);
    }
    $scope.location = function () {
        $('.closeBg').css('display', 'block');
        $('.detail_map').css('display', 'block');
        map = new BMap.Map("allmap");
        map.centerAndZoom(new BMap.Point($scope.detail.accidentLongitude, $scope.detail.accidentLatitude), 14);
        map.enableScrollWheelZoom(true);
        $scope.map_location($scope.detail.accidentLatitude, $scope.detail.accidentLongitude, '事故地点');
        $scope.map_location($scope.detail.fixLatitude, $scope.detail.fixLongitude, '拖送地点');
    }
    $scope.closeBG = function () {
        $('.closeBg').css('display', 'none');
        $('.detail_map').css('display', 'none');
    }
    $scope.map_location = function (lat, lng, text) {
        var new_point = new BMap.Point(lng, lat);
        var marker = new BMap.Marker(new_point); // 创建标注
        map.addOverlay(marker); // 将标注添加到地图中
        var label = new BMap.Label(text, {
            offset: new BMap.Size(20, -10)
        });
        marker.setLabel(label);
    }



    $scope.reload = function (paiqianId) {
        loading();
        APIService.reflash_distance(paiqianId).then(function (res) {

            if (res.data.http_status == 200) {
                closeloading();
                layer.msg('同步成功');
                for (var i = 0; i < $scope.assignDriverses.length; i++) {
                    if ($scope.assignDriverses[i].id == paiqianId) {
                        $scope.assignDriverses[i].chargedDistance = res.data.distance;
                    }
                }
            } else {
                isError(res);
            }
        })
    }
    $scope.hideZhipeiFN = function (data) {
        if (data.verifyStatus == 900) {
            $scope.hideZhipei = true;
        } else {
            $scope.hideZhipei = false;
        }
    }

    $scope.hideCancelTypeFN = function (data) {
        if (data == null || data.verifyStatus != 900) {
            $scope.hideCancelType = true;
        } else {
            $scope.hideCancelType = false;
        }
    }

    $scope.hideButtonFN = function (data) {
        if (data.directCompensation && data.verifyStatus == 2) {
            $scope.hideButton = false;
        } else {
            $scope.hideButton = true;
        }
    }
    $scope.hideCancelButtonFN = function (data) {
        if (data.directCompensation == false || data.verifyStatus == 900) {
            $scope.hideCancelButton = true;
        } else {
            $scope.hideCancelButton = false;
        }
    }

    $scope.hideCancelFN = function (data) {
        if (data.verifyStatus == 900) {
            $scope.hideCancel = false;
        } else {
            $scope.hideCancel = true;
        }
    }

    $scope.close = function () {
        $('.alert_bg').css('display', 'none')
        $('.addinspector_div').css('display', 'none')
        $scope.zhipeiremark = '';
    }
    $scope.cancel = function () {
        $('.alert_bg').css('display', 'block')
        $('.addinspector_div').toggle();

    }
    $scope.cancelSubmit = function () {
        var data = {
            cancelRemark: $scope.zhipeiremark
        }
        if ($scope.zhipeiremark.length != 0) {
            APIService.cancelZhipei($scope.order, data).then(function (res) {
                if (res.data.http_status == 200) {
                    layer.msg('直赔取消成功')
                    $scope.close();
                    setTimeout(function () {
                        location.reload();
                    }, 2000);

                } else {
                    isError(res)
                }
            })
        } else {
            layer.msg('请输入取消备注')
        }
    }

    $scope.track = function (data, order) {
        sessionStorage.setItem('driver_detail', JSON.stringify(data));
        sessionStorage.setItem('order_detail', JSON.stringify(order));
        goto_view('main/track')
    }
    $scope.goto = function (orderNo) {
        sessionStorage.setItem('fixaddress_orderNo', orderNo)
        sessionStorage.setItem('select_type', 'update')
        goto_view('main/updateFix')
    }
}])