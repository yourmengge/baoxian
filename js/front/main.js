var main = angular.module('main', ['Road167']);
main.controller('mainCtrl', ['$scope', 'APIService', function ($scope, APIService) {
    $scope.sdk = new WSDK();
    $scope.history_message = {};
    var nextkey = '';
    $scope.logout = function () {
        APIService.user_logout().then(function (res) {
            if (res.data.result_status == 0) {
                layer.msg('退出成功');
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

    $scope.back = function () {
        window.history.back();
    }
    $scope.initData = function () {
        $scope.initChat();
        $scope.menuList = JSON.parse(sessionStorage.getItem('menuList'));
        $scope.not_read_counts = 0;
        $scope.whichRole = sessionStorage.getItem('whichRole');
        $scope.companyName = sessionStorage.getItem('companyName');
        $scope.adminName = sessionStorage.getItem('adminName');
        if ($scope.whichRole == 'liSuan') {

        } else if ($scope.whichRole == 'third') { //如果只只查看三者车的账号，隐藏左边栏

        } else if ($scope.whichRole == 'shop4sAdmin') { //车商人员

        } else if ($scope.whichRole == 'admin') {
            APIService.get_menu().then(function (res) {
                if (res.data.http_status == 200) {
                    //17045账号登录，隐藏抢单车队
                    if (sessionStorage.getItem('userId') == "21966") {

                    }
                } else {
                    isError(res)
                }
            })
        }
    }
    $scope.openFirst = function (data, index) {
        $scope.menuList[index].isActive = !$scope.menuList[index].isActive;
        sessionStorage.setItem('menuList', JSON.stringify($scope.menuList));
        if (data.secondList.length == 0) {
            goto_view(data.id)
        }else if($scope.menuList[index].isActive){
            goto_view(data.secondList[0].url)
        }
    }
    $scope.gotoView = function (url) {
        goto_view(url)
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