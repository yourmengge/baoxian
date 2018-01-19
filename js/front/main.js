var main = angular.module('main', ['Road167']);

main.controller('mainCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $('.left_menu p').click(function () {
        $(this).addClass('left_menu_click').siblings().removeClass('left_menu_click');
        sessionStorage.setItem('lmId', $(this).attr('id'));
        if ($(this).attr('id') != 'lm14' && $(this).attr('id') != 'lm9') {
            $("#second_14").hide()
            $("#second_9").hide()
            sessionStorage.removeItem('second_type')
        }

        if ($(this).attr('id') == 'lm9') {
            $("#second_9").show()
        }

        sessionStorage.setItem('jiexi_success', '');
        sessionStorage.removeItem('filter')
        sessionStorage.removeItem('disaster_filter');
        sessionStorage.removeItem('inspectorFilter');
        sessionStorage.removeItem('inspectorBackFilter');
        sessionStorage.removeItem('inspectorBackFilter2');
    })
    $scope.sdk = new WSDK();
    $scope.history_message = {};
    var nextkey = '';
    $scope.logout = function () {
        APIService.user_logout().then(function (res) {
            if (res.data.result_status == 0) {
                layer.msg('退出成功');
                // sessionStorage.removeItem('nar_address');
                // sessionStorage.removeItem('nar_address_fixaddress');
                a = [];
                goto_view('login')
                setTimeout(function () {

                    location.reload();
                }, 500);
            }
        })
    }
    $scope.chat_logout = function () {
        $scope.sdk.Base.destroy();

        $scope.sdk = null;
    }
    $scope.selectType = 1;
    $scope.goto = function () {
        goto_view('main/disaster')
    }
    $scope.back = function () {
        window.history.back();
    }
    $scope.openSecond = function (text) {
        if (text === 'lm14') {
            $('#second_14').show();
            $('#second_9').hide();
            sessionStorage.setItem('second_type', 'lm14')
            $scope.open(1)
        } else if (text === 'lm9') {
            $('#second_9').show();
            $('#second_14').hide();
            sessionStorage.setItem('second_type', 'lm9')
            $scope.open(3)
        }
    }
    $scope.open = function (type) {
        sessionStorage.removeItem('shop4s_filter')
        if (type == 1) {
            sessionStorage.setItem('audit_type', 'QUOTE')
        } else if (type == 2) {
            sessionStorage.setItem('audit_type', 'BILL')
        } else if (type == 3) {
            sessionStorage.setItem('audit_type', 'info')
        } else if (type == 4) {
            sessionStorage.setItem('audit_type', 'brand')
        } else if (type == 5) {
            sessionStorage.setItem('audit_type', 'member')
        } else if (type == 6) {
            sessionStorage.setItem('audit_type', 'nocooperation')
        }
        $scope.selectType = type;

    }
    $scope.initData = function () {
        $scope.initChat();

        $scope.not_read_counts = 0;
        switch (sessionStorage.getItem('audit_type')) {
            case 'QUOTE':
                $scope.selectType = 1;
                break;
            case 'BILL':
                $scope.selectType = 2;
                break;
            case 'info':
                $scope.selectType = 3;
                break;
            case 'brand':
                $scope.selectType = 4;
                break;
            case 'member':
                $scope.selectType = 5;
                break;
            case 'nocooperation':
                $scope.selectType = 6;
                break;
            default:
                break;
        }
        $scope.whichRole = sessionStorage.getItem('whichRole');
        $('.left_menu p').css('display', 'none')
        $scope.companyName = sessionStorage.getItem('companyName');
        $scope.adminName = sessionStorage.getItem('adminName');
        if ($scope.whichRole == 'liSuan') {
            $('.orderlist').css('display', 'block');
            $('.child_span').css('display', 'none')
        } else if ($scope.whichRole == 'third') { //如果只只查看三者车的账号，隐藏左边栏

        } else if ($scope.whichRole == 'shop4sAdmin') { //车商人员
            $('.child_span').css('display', 'none')
            $('.chat').css('display', 'block')
            $('.shop4SInfo').css('display', 'block')
            $('.brand').css('display', 'block')
            $('.member').css('display', 'block')

            $('.shop4S').css('display', 'block')
            $('.orderlist').css('display', 'block')
            $('#' + sessionStorage.getItem('lmId')).addClass('left_menu_click').siblings().removeClass('left_menu_click');
            if (sessionStorage.getItem('lmId') != 'lm9') {
                $("#second_9").hide()
            } else {
                $("#second_9").show()
            }
        } else if ($scope.whichRole == 'admin') {

            $('#' + sessionStorage.getItem('lmId')).addClass('left_menu_click').siblings().removeClass('left_menu_click');

            APIService.get_menu().then(function (res) {
                if (res.data.http_status == 200) {
                    if (res.data.items != null) {
                        for (let i = 0; i < res.data.items.length; i++) {
                            $('.left_menu .' + res.data.items[i].url).css('display', 'block')
                        }

                    }
                    //17045账号登录，隐藏抢单车队
                    if (sessionStorage.getItem('userId') == "21966") {
                        $('.left_menu .companyfleet').css('display', 'none')
                    }
                    if (sessionStorage.getItem('second_type') != undefined) {
                        if (sessionStorage.getItem('second_type') == 'lm14') {
                            $('#second_14').show();
                            $('#second_9').hide();
                            sessionStorage.setItem('second_type', 'lm14')
                        } else if (sessionStorage.getItem('second_type') == 'lm9') {
                            $('#second_9').show();
                            $('#second_14').hide();
                        }
                    } else {
                        $('#second_14').hide();
                        $('#second_9').hide();
                    }

                } else {
                    isError(res)
                }
            })

        }


    }
    $scope.read_message = function () {
        $('.message_center').toggle();
        if ($('.message_logo').hasClass('message_logo_has')) {
            $('.message_logo').removeClass('message_logo_has')
        } else {
            $('.message_content').removeClass('not_read')
            $scope.set_read_message();
        }

    }
    $scope.set_read_message = function () { //设置消息已读
        $scope.sdk.Chat.setReadState({
            touid: '10001',
            timestamp: Math.floor((+new Date()) / 1000),
            success: function (data) {
                console.log('设置已读成功', data);
            },
            error: function (error) {
                console.log('设置已读失败', error);
            }
        });
    }
    $scope.initChat = function () { //初始化聊天
        $scope.sdk.Base.login({
            uid: APIService.userId + '',
            appkey: appkey,
            credential: APIService.imPassword,
            timeout: 2000,
            success: function (data) {
                // {code: 1000, resultText: 'SUCCESS'}
                console.log('login success', data);
                $scope.get_message();
                setTimeout(function () {
                    $scope.get_not_read_counts();
                }, 500);


            },
            error: function (error) {
                // {code: 1002, resultText: 'TIMEOUT'}
                console.log('login fail', error);
                $scope.initChat();
            }
        });
    }
    $scope.get_message = function () { //获取实时聊天消息
        $scope.sdk.Event.on('CHAT.MSG_RECEIVED', function (data) {
            console.log(data)
            $('.message_logo').addClass('message_logo_has')
            $scope.message = data.data.msgs[0].msg.header.summary;
            $scope.message_time = data.data.msgs[0].time;
            // $scope.history_message[Object.keys($scope.history_message).length + 1] = {
            //     time: data.data.msgs[0].time,
            //     msg: $scope.message
            // }
            $('.message_content').first().before($domOfSth($scope.message, ToTime($scope.message_time), false));
        });

        $scope.sdk.Chat.startListenMsg({
            touid: '10001'
        });
    }

    function $domOfSth(text, time, type) {
        if (type) {
            return $("<div class='message_content'><p>" + time + "</p><p>" + text + "</p></div>")
        } else {
            return $("<div class='message_content not_read'><p>" + time + "</p><p>" + text + "</p></div>")
        }

    }
    $scope.chat = function () {
        if ($scope.whichRole == 'shop4sAdmin') {
            $scope.adminType = '35910750FD7FFF73'
        } else if ($scope.whichRole == 'admin') {
            $scope.adminType = 'A1704D0822D9930C'
        }
        window.open('chat.html#' + APIService.userId + '#' + APIService.imPassword + '#' + $scope.adminType)
    }

    $scope.isToday = function (time) {
        var now = new Date().getTime();
        if (now - time >= 86400000) {
            return false;
        } else {
            return true;
        }
    }
    $scope.get_history = function () { //获取历史消息
        $scope.sdk.Chat.getHistory({
            touid: '10001',
            nextkey,
            nextkey,
            count: 300,
            success: function (data) {
                console.log('get history msg success', data);
                nextkey = data.data && data.data.next_key;
                var history = data.data.msgs;
                for (let i in history) {
                    if ($scope.isToday(history[i].time)) {
                        $scope.history_message[i] = {
                            time: history[i].time,
                            msg: history[i].msg.header.summary
                        }
                        if (i < $scope.not_read_counts) {
                            $('.message_logo').addClass('message_logo_has')
                            $('#message_div').append($domOfSth($scope.history_message[i].msg, ToTime($scope.history_message[i].time), false));
                        } else {
                            $('#message_div').append($domOfSth($scope.history_message[i].msg, ToTime($scope.history_message[i].time), true));
                        }

                    }
                }
            },
            error: function (error) {
                console.log('get history msg fail', error);
                $scope.initChat();
            }
        });
    }
    $scope.get_not_read_counts = function () { //获取未读条数
        $scope.sdk.Base.getUnreadMsgCount({
            count: 1000,
            success: function (data) {
                console.log(data)
                if (data.data.length != 0) {
                    $scope.not_read_counts = data.data[0].msgCount;

                }
                $scope.get_history();
            },
            error: function (error) {
                console.log('获取未读消息的条数失败', error);
            }
        });
    }
}])