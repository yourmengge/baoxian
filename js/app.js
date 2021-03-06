var insurance = angular.module('insurance', ['threecars', 'confirmation', 'backinfo', 'backtotal', 'brandcfg', 'member', 'brand', 'shop4sorder', 'shop4snum', 'updateFix', 'auditDetail', 'audit', 'third', 'auth', 'datastatistics', 'paymentdetail', 'batchinspector', 'payment', 'inspector', 'companyfleet', 'addshop4S', 'batchshop4S', 'shop4S', 'nar_location', 'disasterdriverorderlist', 'disastermap', 'driverordertotle', 'disasterorderlist', 'totleorder', 'batchaddorder', 'review', 'driverlocation', 'disasterdriver', 'disasterinspector', 'site', 'disasterdetail', 'disaster', 'createdisaster', 'addorder_nar', 'selectlocation', 'editorder', 'track', 'detail', 'team', 'ui.router', 'evaluation', 'adddriver', 'map', 'login', 'Road167', 'fixaddress', 'main', 'addorder', 'orderlist']);
var t;
insurance.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/login');
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'view/login.html'
        })
        .state('main', {
            url: '/main',
            templateUrl: 'view/main.html'
        })

        .state('main.addshop4S', {
            url: '/addshop4S',
            templateUrl: 'view/add/addshop4S.html'
        })
        .state('main.threecars', {
            url: '/threecars',
            templateUrl: 'view/threecars.html'
        })
        .state('main.backinfo', {
            url: '/backinfo',
            templateUrl: 'view/backinfo.html'
        })
        .state('main.backtotal', {
            url: '/backtotal',
            templateUrl: 'view/backtotal.html'
        })
        .state('main.member', {
            url: '/member',
            templateUrl: 'view/member.html'
        })
        .state('main.brand', {
            url: '/brand',
            templateUrl: 'view/brand.html'
        })
        .state('main.auditQ', {
            url: '/auditQ',
            templateUrl: 'view/audit/audit.html'
        })
        .state('main.brandcfg', {
            url: '/brandcfg',
            templateUrl: 'view/brandcfg.html'
        })
        .state('main.auditQ.detailQ', {
            url: '/detailQ',
            templateUrl: 'view/audit/audit_detail.html'
        })
        .state('main.auditB', {
            url: '/auditB',
            templateUrl: 'view/audit/audit.html'
        })
        .state('main.auditB.detailB', {
            url: '/detailB',
            templateUrl: 'view/audit/audit_detail.html'
        })
        .state('main.datastatistics', {
            url: '/datastatistics',
            templateUrl: 'view/datastatistics.html'
        })
        .state('main.updateFix', {
            url: '/updateFix',
            templateUrl: 'view/map/updateFix.html'
        })
        .state('main.inspector', {
            url: '/inspector',
            templateUrl: 'view/inspector.html'
        })
        .state('main.companyfleet', {
            url: '/companyfleet',
            templateUrl: 'view/companyfleet.html'
        })
        .state('main.addorder', {
            url: '/addorder',
            templateUrl: 'view/add/addorder.html'
        })
        .state('main.payment', {
            url: '/payment',
            templateUrl: 'view/payment.html'
        })
        .state('main.batchinspector', {
            url: '/batchinspector',
            templateUrl: 'view/batch/batchinspector.html'
        })
        .state('main.shop4S', {
            url: '/shop4S',
            templateUrl: 'view/shop4s/shop4S.html'
        })
        .state('main.shop4sorder', {
            url: '/shop4sorder',
            templateUrl: 'view/shop4s/shop4sorder.html'
        })
        .state('main.shop4snum', {
            url: '/shop4snum',
            templateUrl: 'view/shop4s/shop4snum.html'
        })
        .state('main.batchshop4S', {
            url: '/batchshop4S',
            templateUrl: 'view/batch/batchshop4S.html'
        })
        .state('main.addorder_nar', {
            url: '/addorder_nar',
            templateUrl: 'view/add/addorder_nar.html'
        })
        .state('main.selectlocation', {
            url: '/selectlocation',
            templateUrl: 'view/map/selectlocation.html'
        })
        .state('main.disasterdriverorderlist', {
            url: '/disasterdriverorderlist',
            templateUrl: 'view/disaster/disasterdriverorderlist.html'
        })
        .state('main.paymentdetail', {
            url: '/paymentdetail',
            templateUrl: 'view/detail/paymentdetail.html'
        })
        .state('main.payment.paymentdetail', {
            url: '/paymentdetail',
            templateUrl: 'view/detail/paymentdetail.html'
        })
        .state('main.editorder', {
            url: '/editorder',
            templateUrl: 'view/editorder.html'
        })
        .state('main.team', {
            url: '/team',
            templateUrl: 'view/team.html'
        })
        .state('main.disastermap', {
            url: '/disastermap',
            templateUrl: 'view/disaster/disastermap.html'
        })
        .state('main.createdisaster', {
            url: '/createdisaster',
            templateUrl: 'view/disaster/createdisaster.html'
        })
        .state('main.disasterdetail', {
            url: '/disasterdetail',
            templateUrl: 'view/disaster/disasterdetail.html'
        })
        .state('main.site', {
            url: '/site',
            templateUrl: 'view/site.html'
        })
        .state('main.disasterinspector', {
            url: '/disasterinspector',
            templateUrl: 'view/disaster/disasterinspector.html'
        })
        .state('main.disasterdriver', {
            url: '/disasterdriver',
            templateUrl: 'view/disaster/disasterdriver.html'
        })
        .state('main.driverlocation', {
            url: '/driverlocation',
            templateUrl: 'view/disaster/driverlocation.html'
        })
        .state('main.review', {
            url: '/review',
            templateUrl: 'view/review.html'
        })
        .state('main.batchaddorder', {
            url: '/batchaddorder',
            templateUrl: 'view/batch/batchaddorder.html'
        })
        .state('main.totleorder', {
            url: '/totleorder',
            templateUrl: 'view/totleorder.html'
        })
        .state('main.disasterorderlist', {
            url: '/disasterorderlist',
            templateUrl: 'view/disaster/disasterorderlist.html'
        })
        .state('main.driverordertotle', {
            url: '/driverordertotle',
            templateUrl: 'view/disaster/driverordertotle.html'
        })
        .state('main.evaluation', {
            url: '/evaluation',
            templateUrl: 'view/evaluation.html'
        })
        .state('main.nar_location', {
            url: '/nar_location',
            templateUrl: 'view/map/nar_location.html'
        })
        .state('main.fixaddress', {
            url: '/fixaddress',
            templateUrl: 'view/map/fixaddress.html'
        })
        .state('main.adddriver', {
            url: '/adddriver',
            templateUrl: 'view/add/adddriver.html'
        })
        .state('main.detail', {
            url: '/detail',
            templateUrl: 'view/detail/detail.html'
        })
        .state('main.payment.detail', {
            url: '/detail',
            templateUrl: 'view/detail/detail.html'
        })
        .state('main.payment.auth', {
            url: '/auth',
            templateUrl: 'view/auth.html'
        })
        .state('main.confirmation', {
            url: '/confirmation',
            templateUrl: 'view/confirmation.html'
        })
        .state('main.map', {
            url: '/map',
            templateUrl: 'view/map/map.html'
        })
        .state('main.disaster', {
            url: '/disaster',
            templateUrl: 'view/disaster/disaster.html'
        })
        .state('main.orderlist', {
            url: '/orderlist',
            templateUrl: 'view/orderlist.html'
        })
        .state('main.third', {
            url: '/third',
            templateUrl: 'view/third.html'
        })
        .state('main.orderlist.detail', {
            url: '/detail',
            templateUrl: 'view/detail/detail.html'
        })
        .state('main.orderlist.editorder', {
            url: '/editorder',
            templateUrl: 'view/editorder.html'
        })
        .state('main.track', {
            url: '/track',
            templateUrl: 'view/track.html'
        })
        .state('main.addorder.map', {
            url: '/map',
            templateUrl: 'view/map.html'
        })
        .state('watchphoto', {
            url: '/watchphoto',
            templateUrl: 'view/watchphoto.html'
        })


})

function isError(err) {
    if (err.data.http_code == 'token.error' || err.data.http_code == 'userId.head.illeagl') {
        layer.msg('请重新登录');
        clearTimeout(t)
        setTimeout(function () {
            closeloading();
            setTimeout(function () {
                location.reload();
            }, 500);
            goto_view('login');

        }, 2000);
    }
    if (err.data.http_status == 400 || err.data.http_status == 403) {
        if (err.data.http_code == 'user.no.exist') {
            layer.msg(err.data.message);
            goto_view('login');
        } else {
            layer.msg(err.data.message);
            closeloading();
        }

    }
    if (err.data.http_status >= 500) {
        layer.msg('网络出现问题了，请刷新重试');
        closeloading();
    }
}

function getString(url) {
    var type = url.split('=');
    return type[1];
}

function goto_view(v) {
    var baseUrl = window.location.href;
    //window.location.reload();
    baseUrl = (baseUrl.indexOf('#') > 0 ? baseUrl.substr(0, baseUrl.indexOf('#')) : baseUrl);
    window.location.href = baseUrl + "#!/" + v;
    return {
        'a': 1,
        b: 2
    };
}

function ToLocalTime(shijianchuo) {
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    var nowtime = y + '-' + add0(m) + '-' + add0(d);
    return nowtime;
}

function ToTime(shijianchuo) {
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    var nowtime = y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    return nowtime;
}

function add0(m) {
    return m < 10 ? '0' + m : m
}

function DateFormat(type, date) {
    switch (type) {
        case 'yyMM':
            return date.getFullYear() % 2000 + '' + add0(date.getMonth() + 1);
            break;

        default:
            break;
    }
}
var cancelArray = [7, 8, 81, 82, 9];

function isCancel(taskFlag) {
    console.log(contains(cancelArray, taskFlag))
    return contains(cancelArray, taskFlag);
}

function isDriverFinish(taskFlag) {
    return taskFlag == 0 ? 'true' : 'false';
}
insurance.filter('zhiPei', function () {
    function ToLocal(text) {
        if (text) {
            return '是'
        } else {
            return '否';
        }
    }
    return ToLocal;
});
insurance.filter('ToDay', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo != null) {
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var nowtime = y + '-' + add0(m) + '-' + add0(d);
            return nowtime;
        } else {
            return null;
        }
    }
    return ToLocal;
});
insurance.filter('ToMin', function () {
    function add0(num) {
        num = parseInt(num);
        if (num < 10) {
            return '0' + num;
        } else {
            return num;
        }
    }

    function ToLocal(shijianchuo) {
        if (shijianchuo == 0) {
            return '00:00:00'
        } else {
            shijianchuo = parseInt(shijianchuo / 1000);
            var hour = shijianchuo / 3600;
            var min = (shijianchuo % 3600) / 60;
            var second = (shijianchuo % 3600) % 60;
            return add0(hour) + ':' + add0(min) + ':' + add0(second);
        }
    }
    return ToLocal;
});
insurance.filter('ToFormat', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo == null) {
            return null;
        } else {
            //shijianchuo是整数，否则要parseInt转换
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            var nowtime = y + '年' + add0(m) + '月' + add0(d) + '日';
            return nowtime;
        }
    }
    return ToLocal;
})
insurance.filter('ToFormatDate', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo == null) {
            return null;
        } else {
            //shijianchuo是整数，否则要parseInt转换
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var nowtime = y + '年' + add0(m) + '月' + add0(d) + '日' + add0(h) + '时';
            return nowtime;
        }
    }
    return ToLocal;
})
insurance.filter('noIdCard', function () {
    function noIdCard(path) {
        if (path == null) {
            return 'img/img-zhipei-idcard@2x.png'
        } else {
            return path;
        }
    }
    return noIdCard;
})
insurance.filter('SecondOrder', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo != null) {

            return '是';
        } else {
            return '否';
        }
    }
    return ToLocal;
});
insurance.filter('Arrive', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo != null) {
            return '未到达'
        } else {
            return '已到达';
        }
    }
    return ToLocal;
});
insurance.filter('ToTime', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo != null) {
            var time = new Date(shijianchuo);
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            var nowtime = add0(h) + ':' + add0(mm) + ':' + add0(s);
            return nowtime;
        } else {
            return null;
        }
    }
    return ToLocal;
});
insurance.filter('ToLocal', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo != null) {
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            var nowtime = y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
            return nowtime;
        } else {
            return null;
        }

    }
    return ToLocal;
});
insurance.filter('ToLocal2', function () {
    function ToLocal(shijianchuo) {
        if (shijianchuo != null) {
            var time = new Date(shijianchuo);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            var nowtime = y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
            return nowtime;
        } else {
            return '-';
        }

    }
    return ToLocal;
});
insurance.filter('trackStatus', function () {
    function ToLocal(text) {
        if (text == '静止') {
            return 'img/jingzhi.png'
        } else if (text == '移动') {
            return 'img/zaixian.png'
        } else {
            return 'img/lixian.png'
        }


    }
    return ToLocal;
});
insurance.filter('Driver', function () {
    function ToLocal(array) {
        if (array == null) {
            return '';
        } else {
            return array[0].driverName + ' - ' + array[0].driverPhone;
        }


    }
    return ToLocal;
});
insurance.filter('DisasterShi', function () {
    function ToLocal(string) {
        if (string == null) {
            return '';
        } else {
            return string.split('#')[0] + string.split('#')[1];
        }


    }
    return ToLocal;
});
insurance.filter('DisasterQu', function () {
    function ToLocal(string) {
        if (string == null) {
            return '';
        } else {
            return string.split('#')[2];
        }


    }
    return ToLocal;
});
insurance.filter('DisasterProvince', function () {
    function ToLocal(string) {
        if (string == null) {
            return '';
        } else {
            return string.split('#')[0];
        }


    }
    return ToLocal;
});
insurance.filter('DisasterCity', function () {
    function ToLocal(string) {
        if (string == null) {
            return '';
        } else {
            return string.split('#')[1];
        }


    }
    return ToLocal;
});
insurance.filter('Drivers', function () {

    function ToLocal(array) {
        var drivers = '';
        var a = '';
        if (array == null) {
            return '';
        } else {
            for (var i = 0; i < array.length; i++) {
                a = array[i].driverName + ' - ' + array[i].driverPhone;
                drivers = drivers + a + ';';

            }

            return drivers;

        }


    }
    return ToLocal;
});
insurance.filter('OrderStatus', function () {
    function OrderStatus(text) {
        switch (text) {
            case 1:
                return '待接单'
                break;
            case 2:
                return '待分配'
                break;
            case 3:
                return '进行中'
                break;
            case 4:
                return '已完成'
                break;
            case 7:
                return '系统取消'
                break;
            case 8:
                return '查勘取消'
                break;
            case 81:
                return '保险人员取消'
                break;
            case 9:
                return '历史未完成'
                break;

            default:
                break;
        }
    }
    return OrderStatus;
});
insurance.filter('OrderType', function () {
    function OrderType(text) {
        switch (parseInt(text)) {
            case 1:
                return '事故救援'
                break;
            case 2:
                return '非事故救援'
                break;

            default:
                break;
        }
    }
    return OrderType;
});
insurance.filter('TaskStatus', function () {
    function TaskStatus(text) {
        switch (parseInt(text)) {
            case 1:
                return '派遣审核中'
                break;
            case 2:
                return '前往事故地点'
                break;
            case 3:
                return '审核未通过'
                break;
            default:
                break;
        }
    }
    return TaskStatus;
});
insurance.filter('TaskFlag', function () {
    function TaskFlag(text) {
        switch (parseInt(text)) {
            case 0:
                return '任务结束'
                break;
            case 2:
                return '前往目的地点'
                break;
            case 4:
                return '审核未通过'
                break;
            case 1:
                return '前往事故地点'
                break;
            case 8:
                return '查勘取消'
                break;
            case 81:
                return '保险人员取消'
                break;
            case 9:
                return '任务取消'
                break;
            case 7:
                return '管理员取消'
                break;
            case 6:
                return '公里数未填写'
                break;
            default:
                break;
        }
    }
    return TaskFlag;
});
insurance.filter('CreateRole', function () {
    function CreateRole(text) {
        switch (parseInt(text)) {
            case 0:
                return '后台下单'
                break;
            case 2:
                return '调度下单'
                break;
            case 3:
                return '查勘下单'
                break;
            case 4:
                return '用户下单'
                break;
            case 7:
                return '保险后台下单'
                break;
            default:
                break;
        }
    }
    return CreateRole;
});
insurance.filter('InsuranceType', function () {
    function InsuranceType(text) {
        switch (text) {
            case 0:
                return '未知类型'
                break;
            case 2:
                return '三者车'
                break;
            case 3:
                return '三者车和标的车'
                break;
            case 1:
                return '标的车'
                break;

            default:
                break;
        }
    }
    return InsuranceType;
});
insurance.filter('CarType', function () {
    function CarType(text) {
        switch (parseInt(text)) {
            case 1:
                return '吊车'
                break;
            case 2:
                return '拖车'
                break;
            case 3:
                return '其他'
                break;
            case 4:
                return '拖加吊'
                break;
            case 5:
                return '非事故救援车'
                break;

            default:
                break;
        }
    }
    return CarType;
});
insurance.filter('gongli', function () {
    function Price(value) {
        if (value == 0) {
            return 0.0;
        } else {
            return (value / 1000).toFixed(1);
        }
    }
    return Price;
})
insurance.filter('Price', function () {
    function Price(value) {
        if (value == 0) {
            return 0;
        } else {
            return (value / 100).toFixed(2);
        }
    }
    return Price;
})
insurance.filter('AccidentCarNoType', function () {
    function Price(text) {
        if (text != 1) {
            return null;
        } else {
            return '挂';
        }
    }
    return Price;
});
insurance.filter('ServiceItems', function () {
    var a = '';

    function ServiceItems(array) {
        a = '';
        if (array != null) {
            for (var i = 0; i < array.length; i++) {
                if (i == array.length - 1) {
                    a = a + array[i];
                } else {
                    a = a + array[i] + '+';
                }
            }
            return a;
        } else {
            return '';
        }
    }
    return ServiceItems;
})
insurance.filter('Distance', function () {
    function Price(text) {
        if (text == null) {
            return null;
        } else {
            return (text / 1000).toFixed(1) + '公里';
        }
    }
    return Price;
});
insurance.filter('Shi', function () {
    function Shi(address) {
        if (address == null || address.length == 0) {
            return null;
        } else {
            address = address.replace(/-/g, "");
            if (address.indexOf('省') != -1) {
                if (address.indexOf('市') != -1) {
                    return address.substring(address.indexOf('省') + 1, address.indexOf('市'));
                } else {
                    return null;
                }
            } else {
                if (address.indexOf('市') != -1) {
                    return address.substring(0, address.indexOf('市'));
                } else {
                    return null;
                }

            }
        }

    }
    return Shi;
});
insurance.filter('Qu', function () {
    function Qu(address) {
        if (address == null || address.length == 0) {
            return null;
        } else {
            address = address.replace(/-/g, "");
            if (address.indexOf('省') != -1) {
                if (address.indexOf('市') != -1) {
                    if (address.indexOf('区') != -1) {
                        return address.substring(address.indexOf('市') + 1, address.indexOf('区'));
                    } else if (address.indexOf('县') != -1) {
                        return address.substring(address.indexOf('市') + 1, address.indexOf('县'));
                    }

                } else {
                    return null;
                }
            } else {
                if (address.indexOf('市') != -1) {
                    if (address.indexOf('区') != -1) {
                        return address.substring(address.indexOf('市') + 1, address.indexOf('区'));
                    } else if (address.indexOf('县') != -1) {
                        return address.substring(address.indexOf('市') + 1, address.indexOf('县'));
                    }
                } else {
                    return null;
                }

            }
        }

    }
    return Qu;
});

var index;

function loading() {
    index = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
}

function closeloading() {
    layer.close(index);
}

function contains(e, d) {
    for (var i = 0; i < e.length; i++) {
        if (d == e[i]) {
            return true;
        }
    }
    return false;
}
//判断是车商人员还是4s店人员
function shop4sMsg(type) {
    return type == 8 ? '4S店人员' : '车商人员'
}