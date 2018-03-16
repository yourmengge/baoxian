var detail = angular.module('detail', ['Road167']);
var map, orderPic = [],
    accidentPic = [],
    fixPic = [];
detail.controller('detailCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.ASSIGN_DRIVER = 'ASSIGN_DRIVER',
        $scope.PICTURE_VIDEO = 'PICTURE_VIDEO',
        $scope.PUSH_FIX = 'PUSH_FIX',
        $scope.LICENSE = 'LICENSE',
        $scope.DIRECT_COMPENSATION = 'DIRECT_COMPENSATION',
        $scope.CHARGE_MODE = 'CHARGE_MODE',
        $scope.FIX_ADDRESS = 'FIX_ADDRESS'
    $scope.initData = function () {

        $scope.openDetail = -1;
        $scope.tabType = $scope.ASSIGN_DRIVER;
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
        var funcList = []
        funcList = sessionStorage.getItem('funcList').split(',')
        if (contains(funcList, 1017)) {
            $scope.zhipeiDiv = show;
        } else {
            $scope.zhipeiDiv = hide;
        }
        loading();
        orderPic = [];
        accidentPic = [];
        fixPic = [];
        //$scope.order = '1711160018'
        $scope.order = sessionStorage.getItem('orderNo');
        APIService.get_order_detail($scope.order, 'BASE').then(function (res) {
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
        $scope.get_shijiu();
    }

    //获取变更记录
    $scope.changeList = function (type) {
        $('.alert_bg').css('display', 'block');
        if (type == $scope.CHARGE_MODE) {
            $('#changemode').css('display', 'block');
        } else {
            $('#fixchange').css('display', 'block');
        }
        APIService.get_order_detail($scope.order, type).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.list = res.data.items;
            } else {
                isError(res);
            }

        })
    }
    //获取施救信息
    $scope.isWeicaijiNull = function (weicaiji, text) {
        return weicaiji == '' ? text : '、' + text
    }
    $scope.get_shijiu = function () {
        loading();
        APIService.get_order_detail($scope.order, $scope.tabType).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                switch ($scope.tabType) {
                    case 'ASSIGN_DRIVER':
                        $scope.assignDriverses = res.data.items;
                        $scope.notTuoche = true;
                        $scope.notFinished = true;
                        for (let i in $scope.assignDriverses) {
                            if ($scope.assignDriverses[i].carType == 2) {
                                $scope.notTuoche = false;
                                if ($scope.assignDriverses[i].taskFlag == 0) {
                                    $scope.notFinished = false;
                                }

                                if ($scope.assignDriverses[i].notFixAddrRemark == null) {
                                    $scope.notFixAddrRemark = null
                                } else if ($scope.assignDriverses[i].notFixAddrRemark == '一致') {
                                    $scope.notFixAddrRemark = '一致'
                                } else {
                                    $scope.notFixAddrRemark = $scope.assignDriverses[i].notFixAddrRemark
                                }
                            }
                        }
                        break;
                    case 'PICTURE_VIDEO':
                        $scope.allPictures = res.data;
                        break;
                    case 'PUSH_FIX':
                        $scope.pushFix = res.data;
                        break;
                    case 'LICENSE':
                        $scope.weicaiji = '';
                        $scope.detail.licenseInfo = res.data;
                        if ($scope.detail.licenseInfo.idCard == null) {
                            $scope.weicaiji = $scope.isWeicaijiNull($scope.weicaiji, '身份证');
                        }
                        if ($scope.detail.licenseInfo.drivingLicense == null) {
                            $scope.weicaiji = $scope.weicaiji + $scope.isWeicaijiNull($scope.weicaiji, '行驶证');
                        }
                        if ($scope.detail.licenseInfo.driverLicense == null) {
                            $scope.weicaiji = $scope.weicaiji + $scope.isWeicaijiNull($scope.weicaiji, '驾驶证');
                        }
                        if ($scope.detail.licenseInfo.insurancePolicy == null) {
                            $scope.weicaiji = $scope.weicaiji + $scope.isWeicaijiNull($scope.weicaiji, '保单');
                        }
                        if ($scope.weicaiji.split('、').length == 4) {
                            $scope.weicaiji = '无采集证照'
                        }
                        break;
                    case 'DIRECT_COMPENSATION':
                        $scope.detail.authDirBilCancel = res.data;
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
                        break;
                    default:
                        break;
                }

            } else {
                isError(res);
            }
        })
    }

    $scope.tabs = function (type) {
        $scope.tabType = type;
        $scope.get_shijiu();
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
        APIService.get_order_detail($scope.order, 'DIRECT_COMPENSATION').then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.detail = res.data;
                if ($scope.detail.verifyStatus != 900) {
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
        '', '报案人', '查勘员', '司机'
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
        $('#fixchange').css('display', 'none')
        $('#changemode').css('display', 'none')
        $('.image_swiper').css('display', 'none');
        $scope.zhipeiremark = '';
        $scope.backPic = []
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
    $scope.hiddenView = function (pre, now) {
        if (pre === 1 && now === 2) {
            return 1;
        } else if (pre === 2 && now === 1) {
            return 2;
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

    $scope.openImg = function (data) {
        $('.alert_bg').css('display', 'block');
        $('.image_swiper').css('display', 'block');
        $scope.backPic = data;
        loading()
        setTimeout(() => {
            var mySwiper = new Swiper('.swiper-container', {
                autoplay: false,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                // pagination: {
                //     el: '.swiper-pagination',
                //     clickable :true,
                //     type: 'progress',
                // },
            });
            console.log(data)
            closeloading();
        }, 1500);

    }
}])