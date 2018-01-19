var companyfleet = angular.module('companyfleet', ['Road167']);
companyfleet.controller('companyfleetCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.initData = function () {
        loading();
        $('#startDay').val('');
        $('#endDay').val('');
        $scope.smallSize = false;
        $scope.bigSize = false;
        $scope.limit = 200;
        $scope.num = [];
        $scope.keyword = '';
        $scope.open = false;
        $scope.searchName = '';
        $scope.table = show;
        $scope.carSize = '';
        $scope.sizeType = '';
        $scope.fleetId = '';
        $scope.canAdd = false;//控制添加车队的确认按钮
        $scope.get_company_fleet('', $scope.limit);
        $scope.isBigSizeTab = false;
        $scope.bigList = [];
        $scope.smallList = [];
        $scope.tips = '当前无车队，请尽快配置车队启用模式，以免影响接单'
        $scope.disabled = false;
        //获取公司信息
        $scope.get_company_detail();
    }
    $scope.get_company_detail = function () {
        APIService.get_company_province(sessionStorage.getItem('companyId')).then(function (res) {
            if (res.data.http_status == 200) {
                $scope.current_mode = res.data.orderDispatchMode;
                $scope.witchTpye($scope.current_mode);
            } else {
                isError(res)
            }
        })
    }
    $scope.witchTpye = function (type) {
        switch (type) {
            case 1:
                $scope.alert = '';
                $scope.currentTitle = '就近抢单模式'
                $scope.description = $scope.Texts[0];
                break;
            case 2:
                $scope.alert = '确定移除' + $scope.delete_fleetName + '的抢单。'
                $scope.currentTitle = '抢单模式'
                $scope.description = $scope.Texts[1];
                break;
            case 3:
                $scope.alert = '确定移除' + $scope.delete_fleetName + '车队，请尽快调整车队比例配置，以免影响订单分配！'
                $scope.currentTitle = '按比例指派'
                $scope.description = $scope.Texts[2];
                break;
            default:
                break;
        }
    }
    $scope.sizeTexts = [
        { id: '', name: '显示全部' },
        { id: 1, name: '小车资质' },
        { id: 2, name: '大车资质' },
        { id: 3, name: '大小车资质' }
    ]
    $scope.changeMode = function () {
        $('.description').toggle();
        $scope.open = !$scope.open;
    }
    $scope.Texts = [
        '刚下单推送30公里范围内，30公里范围内的调度可以抢单；3分钟未接单推送50公里范围内，50公里范围内的调度可以抢单；5分钟未接单推送70公里范围内，70公里范围内的调度可以抢单。',
        '加入此模式下的车队，系统会根据施救资质和就近抢单的公里范围进行抢单。',
        '系统会根据大、小车资质的配置比例，直接指派订单给对应的调度；若比例相同时，平均分配。'
    ]
    function isInteger(obj) {
        return obj % 1 === 0
    }
    $scope.scale = function (weight) {
        if (isAllEqual($scope.num) && $scope.num[0] == 0) {
            return parseInt(100 / $scope.num.length)
        } else {
            return parseInt(weight * 100 / $scope.totle)
        }

    }
    function isAllEqual(array) {//判断数组内所有值是否相等
        if (array.length > 0) {
            return !array.some(function (value, index) {
                return value !== array[0];
            });
        } else {
            return true;
        }
    }
    $scope.inputNum = function (id) {
        var totle = 0;
        var array = [];
        if ($scope.isBigSizeTab) {//大车tab
            for (let i in $scope.bigList) {
                var num = $('#' + $scope.bigList[i].fleetId + 'big').val();
                if (num == '') {
                    num = '0'
                }
                array.push(num);
                totle = parseInt(num) + totle;
            }
            if (isAllEqual(array) && array[0] == 0) {
                for (var i in $scope.bigList) {
                    $('.' + $scope.bigList[i].fleetId + 'big').text(parseInt(100 / $scope.bigList.length) + '%')
                }
            } else {
                for (let i in $scope.bigList) {
                    weight = $('#' + $scope.bigList[i].fleetId + 'big').val()
                    $('.' + $scope.bigList[i].fleetId + 'big').text(parseInt(weight * 100 / totle) + '%')
                }
            }
        } else {//小车tab
            for (let i in $scope.smallList) {
                var num = $('#' + $scope.smallList[i].fleetId).val();
                if (num == '') {
                    num = '0'
                }
                array.push(num);
                totle = parseInt(num) + totle;
            }
            console.log(typeof (totle))
            if (isAllEqual(array) && array[0] == 0) {
                for (var i in $scope.smallList) {
                    $('.' + $scope.smallList[i].fleetId).text(parseInt(100 / $scope.smallList.length) + '%')
                }
            } else {
                for (let i in $scope.smallList) {
                    weight = $('#' + $scope.smallList[i].fleetId).val()
                    $('.' + $scope.smallList[i].fleetId).text(parseInt(weight * 100 / totle) + '%')
                }
            }


        }
        // for (let i in $scope.team_list) {
        //     if ($scope.isBigSizeTab) {
        //         var num = $('#' + $scope.team_list[i].fleetId + 'big').val()
        //     } else {
        //         var num = $('#' + $scope.team_list[i].fleetId).val()
        //     }

        //     if (num == '') {
        //         num = '0';
        //     }
        //     array.push(num);
        //     totle = parseInt(num) + totle;
        // }
        // console.log(totle)
        // if (isAllEqual(array) && $('#' + $scope.team_list[0].fleetId).val() == 0) {
        //     for (var i in $scope.team_list) {
        //         if ($scope.isBigSizeTab) {
        //             $('.' + $scope.team_list[i].fleetId + 'big').text(parseInt(100 / $scope.team_list.length) + '%')
        //         } else {
        //             $('.' + $scope.team_list[i].fleetId).text(parseInt(100 / $scope.team_list.length) + '%')
        //         }

        //     }
        // } else {
        //     for (var i in $scope.team_list) {
        //         if ($scope.isBigSizeTab) {
        //             weight = $('#' + $scope.team_list[i].fleetId + 'big').val();
        //         } else {
        //             weight = $('#' + $scope.team_list[i].fleetId).val();
        //         }

        //         if (weight == '') {
        //             weight = 0;
        //         }
        //         if ($scope.isBigSizeTab) {
        //             $('.' + $scope.team_list[i].fleetId + 'big').text(parseInt(weight * 100 / totle) + '%')
        //         } else {
        //             $('.' + $scope.team_list[i].fleetId).text(parseInt(weight * 100 / totle) + '%')
        //         }

        //     }
        // }

    }
    $scope.lose_focus = function () {
        $('input').removeClass('wrong_input');
    }
    $scope.update_weight = function () {
        if ($scope.isBigSizeTab) {
            var temp = {
                "fleetId": '',
                "bigWeight": ''
            };
        } else {
            var temp = {
                "fleetId": '',
                "weight": ''
            };
        }

        var data = [];
        if ($scope.isBigSizeTab) {
            for (let i in $scope.bigList) {
                temp.bigWeight = $('#' + $scope.bigList[i].fleetId + 'big').val();
                if (temp.bigWeight < 0 || parseInt(temp.bigWeight) != temp.bigWeight || temp.bigWeight > 100) {
                    layer.msg('请输入0到100的自然数');
                    break;
                }
                temp.bigWeight = parseInt(temp.bigWeight);
                temp.fleetId = $scope.bigList[i].fleetId;
                data.push(temp);
                var temp = {
                    "fleetId": '',
                    "bigWeight": ''
                };
                if (i == $scope.bigList.length - 1) {
                    var upload = {
                        carSize: 2,
                        req: data
                    }
                    APIService.weight_cfg(sessionStorage.getItem('companyNo'), upload).then(function (res) {
                        if (res.data.http_status == 200) {
                            layer.msg('配置成功');
                            $scope.close();
                            $scope.initData();
                        } else {
                            isError(res);
                        }
                    })
                }
            }
        } else {
            for (let i in $scope.smallList) {
                temp.weight = $('#' + $scope.smallList[i].fleetId).val();
                if (temp.weight < 0 || parseInt(temp.weight) != temp.weight || temp.weight > 100) {
                    layer.msg('请输入0到100的自然数');
                    break;
                }
                temp.weight = parseInt(temp.weight)
                temp.fleetId = $scope.smallList[i].fleetId;
                data.push(temp);
                var temp = {
                    "fleetId": '',
                    "weight": ''
                };
                if (i == $scope.smallList.length - 1) {
                    var upload = {
                        carSize: 1,
                        req: data
                    }
                    APIService.weight_cfg(sessionStorage.getItem('companyNo'), upload).then(function (res) {
                        if (res.data.http_status == 200) {
                            layer.msg('配置成功');
                            $scope.close();
                            $scope.initData();
                        } else {
                            isError(res);
                        }
                    })
                }
            }
        }
        // for (var i in $scope.team_list) {
        //     if (!$scope.isBigSizeTab) {
        //         if ($scope.team_list[i].carSize == 1 || $scope.team_list[i].carSize == 3) {
        //             temp.fleetId = $scope.team_list[i].fleetId;
        //             temp.weight = $('#' + temp.fleetId).val();
        //             if (temp.weight < 0 || temp.weight >= 100 || !isInteger(temp.weight)) {
        //                 layer.msg('请输入大于等于0且小于等于100的整数');
        //                 $('#' + temp.fleetId).addClass('wrong_input').focus();
        //                 break;
        //             }
        //             data.push(temp);
        //             temp = {
        //                 "fleetId": '',
        //                 "weight": ''
        //             };
        //         }
        //     } else {
        //         if ($scope.team_list[i].carSize == 2 || $scope.team_list[i].carSize == 3) {
        //             temp.fleetId = $scope.team_list[i].fleetId;
        //             temp.bigWeight = $('#' + temp.fleetId + "big").val();
        //             if (temp.bigWeight < 0 || temp.bigWeight >= 100 || !isInteger(temp.bigWeight)) {
        //                 layer.msg('请输入大于等于0且小于等于100的整数');
        //                 $('#' + temp.fleetId + 'big').addClass('wrong_input').focus();
        //                 break;
        //             }
        //             data.push(temp);
        //             temp = {
        //                 "fleetId": '',
        //                 "bigWeight": ''
        //             };
        //         }
        //     }
        //     if (i == $scope.team_list.length - 1) {
        //         if ($scope.isBigSizeTab) {
        //             var upload = {
        //                 carSize: 2,
        //                 req: data
        //             }
        //         } else {
        //             var upload = {
        //                 carSize: 1,
        //                 req: data
        //             }
        //         }
        //         console.log(upload)
        //         APIService.weight_cfg(sessionStorage.getItem('companyNo'), upload).then(function (res) {
        //             if (res.data.http_status == 200) {
        //                 layer.msg('配置成功');
        //                 $scope.close();
        //                 $scope.initData();
        //             } else {
        //                 isError(res);
        //             }
        //         })
        //     }
        // }

    }

    $scope.switchMode = function (type, e) {
        if ($scope.current_mode == type) {

        } else {
            $scope.message = '确定退出' + $scope.currentTitle + '，现有模式配置失效！'
            if (confirm($scope.message)) {
                var data = {
                    orderDispatchMode: type
                }
                APIService.update_company(sessionStorage.getItem('companyId'), data).then(function (res) {
                    if (res.data.http_status == 200) {
                        layer.msg('切换模式成功');
                        $('.description').toggle();
                        $scope.initData();
                    } else {
                        isError(res);
                    }
                })
            } else {
                if (window.event) {
                    window.event.returnValue = false;
                }
                else {
                    e.preventDefault(); //for firefox 
                }
            }
        }

    }

    $scope.selectSize = function () {
        if ($scope.smallSize == true && $scope.bigSize == true) {
            $scope.sizeType = 3;
        } else if ($scope.smallSize == true && $scope.bigSize == false) {
            $scope.sizeType = 1;
        } else if ($scope.smallSize == false && $scope.bigSize == true) {
            $scope.sizeType = 2;
        } else if ($scope.smallSize == false && $scope.bigSize == false) {
            $scope.sizeType = '';
        }
        console.log($scope.sizeType)
    }
    $scope.isSelect = function (type) {
        if (type == $scope.current_mode) {
            return true;
        } else {
            return false;
        }
    }
    $scope.get_company_fleet = function () {
        var startDay = $('#startDay').val();

        var endDay = $('#endDay').val();
        APIService.get_company_fleet(startDay, endDay, $scope.carSize).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.smallList = [];
                $scope.bigList = [];
                $scope.team_list = res.data.items;
                $scope.totle = 0;
                for (let i in $scope.team_list) {
                    if ($scope.team_list[i].carSize == 2 || $scope.team_list[i].carSize == 3) {
                        $scope.bigList.push($scope.team_list[i])
                    }
                    if ($scope.team_list[i].carSize == 1 || $scope.team_list[i].carSize == 3) {
                        $scope.smallList.push($scope.team_list[i])
                    }
                }
                console.log($scope.smallList)
                //分页部分
                $scope.current = 1;
                $scope.pageCount = Math.ceil(res.data.count / $scope.limit);
                if (res.data.count <= $scope.limit) {
                    $scope.page_p = hide;
                } else {
                    $scope.page_p = show;
                    $scope.down = show;
                }
                $scope.up = hide;
                //分页结束
            } else {
                isError(res);
            }
        })
    }

    $scope.search = function () {
        if ($scope.searchName == '') {
            $scope.fleetId = '';
        }
        loading();
        APIService.search_team($scope.searchName).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                if (res.data.count == 0) {
                    $('.add_driver_div_p').css('display', 'none');
                } else {
                    $('.add_driver_div_p').css('display', 'block');
                    $scope.searchlist = res.data.fleetList;
                }
            } else {
                isError(res);
            }
        })
    }

    $scope.select = function (data) {
        $('.add_driver_div_p').css('display', 'none');
        $scope.searchName = data.name;
        $scope.fleetId = data.fleetId;

    }
    $scope.$watch('fleetId', function (newValue) {
        if (newValue != '') {
            $scope.count1 = 1;
        } else {
            $scope.count1 = 0;
        }
    })
    $scope.$watch('sizeType', function (newValue) {
        if (newValue != '') {
            $scope.count2 = 1;
        } else {
            $scope.count2 = 0;
        }
    })
    $scope.$watch('count1 + count2', function (newValue) {
        if (newValue == 2) {
            $scope.canAdd = true;
        } else {
            $scope.canAdd = false;
        }
    })

    $scope.openTips = function (id) {
        $('#' + id).toggle(200);
    }
    $scope.closeTips = function (id) {
        $('#' + id).css('display', 'none');
    }

    $scope.isNum = function (id) {//限制输入0到100的正整数
        var preventDefault = function () {
            if (window.event) {
                window.event.returnValue = false;
            }
            else {
                e.preventDefault(); //for firefox 
            }
        }
        var k = window.event ? e.keyCode : e.which;
        if (((k >= 48) && (k <= 57))) {//限制输入数字
            var num = $('#' + id).val();
            if (num > 10) {
                preventDefault();
            } else if (num == 10) {
                if (k != 48) {
                    preventDefault();
                }
            }
            if (num.length == 3) {
                preventDefault();
            }

        } else {
            preventDefault();
        }
    }
    $scope.addDriver = function (type, data) {
        $('.alert_bg').css('display', 'block')
        $('.addinspector_div').toggle();
        if (type == 'add') {
            $scope.isUpdate = false;
        } else {
            $scope.isUpdate = true;
            $scope.updateFleetName = data.fleetName;
            $scope.sizeType = data.carSize;
            $scope.fleetId = data.fleetId;
            $scope.fleet_Id = data.id;
            switch (data.carSize) {
                case 1:
                    $scope.smallSize = true;
                    $scope.bigSize = false;
                    break;
                case 2:
                    $scope.smallSize = false;
                    $scope.bigSize = true;
                    break;
                case 3:
                    $scope.smallSize = true;
                    $scope.bigSize = true;
                    break;
                default:
                    break;
            }
        }
    }
    $scope.change_size_cfg = function (type) {
        $scope.isBigSizeTab = type;
        $scope.write($scope.isBigSizeTab);
    }
    $scope.write = function (type) {
        console.log($scope.smallList)
        var weight = 0;
        var bigtotle = 0;
        var smalltotle = 0;
        $scope.num = [];


        if (type == false) {//小车
            for (let i in $scope.smallList) {
                smalltotle = smalltotle + $scope.smallList[i].weight;
                $scope.num.push($scope.smallList[i].weight)
            }
            if (isAllEqual($scope.num) && $scope.num[0] == 0) {//全部的权重为0
                for (var i in $scope.smallList) {
                    $('.' + $scope.smallList[i].fleetId).text(parseInt(100 / $scope.smallList.length) + '%')
                }
            } else {
                for (var i in $scope.smallList) {
                    weight = $scope.smallList[i].weight;
                    $('#' + $scope.smallList[i].fleetId).val(weight)
                    $('.' + $scope.smallList[i].fleetId).text(parseInt(weight * 100 / smalltotle) + '%')
                }
            }
        } else {
            for (let i in $scope.bigList) {
                bigtotle = bigtotle + $scope.bigList[i].bigWeight;
                $scope.num.push($scope.bigList[i].bigWeight)
            }
            if (isAllEqual($scope.num) && $scope.num[0] == 0) {
                for (var i in $scope.bigList) {
                    $('.' + $scope.bigList[i].fleetId + 'big').text(parseInt(100 / $scope.bigList.length) + '%')
                }
            } else {
                for (var i in $scope.bigList) {
                    weight = $scope.bigList[i].bigWeight;
                    $('#' + $scope.bigList[i].fleetId + 'big').val(weight)
                    $('.' + $scope.bigList[i].fleetId + 'big').text(parseInt(weight * 100 / bigtotle) + '%')

                }
            }
        }

    }
    $scope.weightCfg = function () {
        $('.alert_bg').css('display', 'block')
        $('.weightCfg_div').toggle();
        console.log($scope.smallList)
        $scope.write($scope.isBigSizeTab);

    }
    $scope.cencle = function () {
        $('.add_driver_div').toggle(500);
        $scope.phone = null;
        $('.add_driver_div_p').css('display', 'none');
    }
    $scope.close = function () {
        $scope.bili = '';
        $('.alert_bg').css('display', 'none')
        $('.addinspector_div').css('display', 'none')
        $('.weightCfg_div').css('display', 'none');
        $scope.initData();
    }

    $scope.delete = function (data) {
        $scope.delete_fleetName = data.fleetName;
        $scope.witchTpye($scope.current_mode);
        if (confirm($scope.alert)) {
            loading();
            APIService.delete_company_fleet(data.id).then(function (res) {
                closeloading();
                if (res.data.http_status == 200) {
                    layer.msg(data.fleetName + '移除成功！');
                    setTimeout(function () {
                        $scope.initData()
                    }, 1000);
                } else {
                    isError(res);
                }
            })
        }
    }
    $scope.submit_btn = function () {
        if ($scope.isUpdate) {
            $scope.update_fleet();
        } else {
            $scope.submit_add();
        }
    }
    $scope.update_fleet = function () {//修改车队资质
        loading();
        var data = {
            carSize: $scope.sizeType
        }
        APIService.update_fleet_size(data, $scope.fleet_Id).then(function (res) {
            closeloading();
            if (res.data.http_status == 200) {
                if ($scope.current_mode == 3) {
                    layer.msg('车队资质调整，请尽快调整车队比例配置，以免影响订单分配！');
                } else {
                    layer.msg('修改成功');
                }

                setTimeout(function () {
                    $scope.close();
                }, 1000);
            }
        })

    }
    $scope.submit_add = function () {//确认添加车队
        loading();
        APIService.search_team($scope.searchName).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                if (res.data.count == 0) {
                    layer.msg('该车队不存在，请重新确认车队名是否有误')
                } else {
                    var data = {
                        fleetId: $scope.fleetId,
                        carSize: $scope.sizeType
                    }
                    APIService.add_company_fleet(data).then(function (res) {
                        if (res.data.http_status == 200) {
                            if ($scope.current_mode == 3) {
                                layer.msg('您有新添加的车队，请尽快调整车队比例配置，以免影响订单分配！');
                            } else {
                                layer.msg('添加成功');
                            }


                            setTimeout(function () {
                                $scope.close();
                            }, 1000);

                            $scope.cencle();
                        } else {
                            isError(res);
                        }
                    })
                }
            } else {
                isError(res);
            }
        })
    }
    $scope.Page = function (type) {
        if (type == 'home') {
            $scope.current = 1;
            $scope.up = hide;
            $scope.down = show;
        }
        if (type == 'end') {
            $scope.current = $scope.pageCount;
            $scope.up = show;
            $scope.down = hide;
        }
        if (type == 'down') {
            $scope.up = show;
            $scope.current = $scope.current + 1;
            if ($scope.current == $scope.pageCount) {
                $scope.down = hide;
            }
        }
        if (type == 'up') {
            $scope.down = show;
            $scope.current = $scope.current - 1;
            if ($scope.current == 1) {
                $scope.up = hide;
            }
        }
        loading();
        APIService.paging(urlV1 + '/company-fleet?keyword=' + $scope.keyword, $scope.limit, type, $scope.pageCount, $scope.current).then(function (res) {
            if (res.data.http_status == 200) {
                closeloading();
                $scope.team_list = res.data.items;
            } else {
                isError(res)
            }

        })
    }
}])