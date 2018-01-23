var
//     host = 'https://dev.road167.com/extrication';
// url = 'https://dev.road167.com';
// appkey = '23637239'
host = 'https://t.road167.com/extrication';
url = 'https://t.road167.com';
appkey = '23726639'
// host = 'https://www.road167.com/extrication';
// url = 'https://www.road167.com';
// appkey = '23638436'
urlOrder = '/order';
urlV1 = '/v1';
urlUser = '/user';
urlLogin = '/login';
urlAction = '/action';
urlToken = '/token';
urlActions = '/actions';
urlThird = '/third';
urlFleet = '/fleet';
show = 0;
hide = 1;
urlDriver = '/driver';
limit = 10;
offset = 0;
fav_driver = '/fav-driver';
fav_address = '/fav-address';
urlAdd = '/add';
order_eval = '/order-eval';
urlAssigndrivers = '/assigndrivers';
urlTrack1 = '/proxy/baidu/map/trace/gethistory?start_time=';
urlTrack2 = '&end_time=';
urlTrack3 = '&entity_name=';
urlTrack4 = '&page_size=5000&is_processed=1&simple_return=0&supplement_mode=driving&process_option=[need_denoise=1,need_vacuate=1,need_mapmatch=1,transport_mode=1]'
isPhone = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
urlSpecify_fleet = '/specify-fleet';
token = '';
userId = ''
urlTrack5 = '/baidu/map/trace/entity/list?disasterId=';
urlKey = '&key=';
urlTaskStatus = '&TaskStatus=';
urlDisaster = '/disaster/page';
urlDisasterAddress = '/disaster-address'
var filter = {
    status: '',
    keyword: '',
    startDate: '',
    endDate: '',
    status2: '',
    order_current: '',
    shop_current: '',
    ordertype: '',
    wucha: '',
    insuranceType: ''
}
var shop4s_filter = {
    keyword: '',
    shop4s_current: '',
    status: ''
}
var disaster_filter = {
    startDay: '',
    status: '',
    keyword: '',
    disaster_current: ''
}
var inspector_back = {
    start: '',
    end: '',
    type: '',
    inspector: '',
    success: ''
}
var
branchOne = '一类修理厂';
branchTwo = '二类修理厂';
branchThree = '三类修理厂';