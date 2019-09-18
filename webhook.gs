//active
var channelToken = "oB+dxq4x/QW0LK5ChAdkW8lA/NB45OZBqL9esFEklV4HE+s0s/uYj87W/pFC8TVux4iE28au22uaTj7by26TAeG+yYwl4bgAvV4xam3djBZRhaC2iYxroQNVYYqyfv84hAsnHS8/Di9m6w7OP8LElQdB04t89/1O/w1cDnyilFU=";
var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Xp34vfiK5x7qkToff4rC2rH8RKokvKieGwszLaqlaaM/edit#gid=0");
var sheet = ss.getSheetByName("data");

function replyMsg(replyToken, Msg, channelToken) {
  var url = 'https://api.line.me/v2/bot/message/reply';
  var opt = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channelToken,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': Msg
    })
  };
  UrlFetchApp.fetch(url, opt);
}

function pushMsg(usrId, Msg, channelToken) {
  var url = 'https://api.line.me/v2/bot/message/push';
  var opt = {
    'headers': {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + channelToken,
  },
  'method': 'post',
  'payload': JSON.stringify({
    'to': usrId,
    'messages': Msg
  })
 };
 UrlFetchApp.fetch(url, opt);
}

function doPost(e) {
  var value = JSON.parse(e.postData.contents);
    var events = value.events;
    if (events != null) {
      for (var i in events) {
        var event = events[i];
        var type = event.type;
        var replyToken = event.replyToken;
        var sourceType = event.source.type;
        var userId = event.source.userId;
        var groupId = event.source.groupId;
        var timeStamp = event.timestamp;
        var url = "https://api.line.me/v2/bot/profile/"+userId;
        var headers = {
             "contentType": "application/json",
    "headers":{"Authorization": "Bearer "+channelToken}
             };
        var getprofile = UrlFetchApp.fetch(url, headers);
        var profiledata = JSON.parse(getprofile.getContentText());
        var displayName = profiledata.displayName;
        var statusMessage = profiledata.statusMessage;
        var pictureUrl = profiledata.pictureUrl;

        
        //message type
        switch (type) {
          case 'postback':
            break;
          case 'message':
            var messageType = event.message.type;
            var messageId = event.message.id;
            var messageText = event.message.text;
            if(messageText == "ฝ่ายขาย"){
            var mess = [{'type': 'text', 'text': 'กรุณาระบุ\n-รุ่นรถ\n-ทะเบียน\n-เบอร์โทรติดต่อ'}];
            replyMsg(replyToken, mess, channelToken);
            var uid = sheet.getRange(2, 1, sheet.getLastRow(),sheet.getLastColumn()).getValues();
            for(var i = 0;i<uid.length; i++){
               if(userId == uid[i][0]){
                  sheet.getRange(i+2,8).setValue("1");
               }
             }
            }
            else if(messageText.indexOf("conf ")>-1){
            var confId = messageText.split(' ',2)[1];
            var uid = sheet.getRange(2, 1, sheet.getLastRow(),sheet.getLastColumn()).getValues();
            for(var i = 0;i<uid.length; i++){
            if(confId == uid[i][0]){
              sheet.getRange(i+2,5).setValue("TRUE");
              var mess = [{'type': 'text', 'text': 'ได้รับการยืนยันจากผู้ดูแล'}];
              pushMsg(confId, mess, channelToken);
                }
              }
            }
            else{
            var uid = sheet.getRange(2, 1, sheet.getLastRow(),sheet.getLastColumn()).getValues();
            for(var i = 0;i<uid.length; i++){
            if(userId == uid[i][0]){
            var save = sheet.getRange(i+2,8).getValue();
               if(save == "1"){
               for(var i = 0;i<uid.length; i++){
               if(userId == uid[i][0]){
                  sheet.getRange(i+2,5).setValue(messageText);
                  sheet.getRange(i+2,8).setValue("0");
                  var mess = [{'type': 'text', 'text': 'ได้รับข้อมูลของท่านแล้ว'}];
                  replyMsg(replyToken, mess, channelToken);
               }
             }
            }
              }
             }
            }

            break;
          case 'join':
            var mess = [{'type': 'text', 'text': "join"}];
            replyMsg(replyToken, mess, channelToken);
            break;
          case 'leave':
            var mess = [{'type': 'text', 'text': "leave"}];
            replyMsg(replyToken, mess, channelToken);
            break;
          case 'memberLeft':
            var mess = [{'type': 'text', 'text': "memberLeft"}];
            replyMsg(replyToken, mess, channelToken);
            break;
          case 'memberJoined':
            var mess = [{'type': 'text', 'text': "memberJoined"}];
            replyMsg(replyToken, mess, channelToken);
            break;
          case 'follow':
            var mess = [{'type': 'text', 'text': "โปรดรอการยืนยันจากผู้ดูแล"}];
            replyMsg(replyToken, mess, channelToken);
            var uid = sheet.getRange(2, 1, sheet.getLastRow(),sheet.getLastColumn()).getValues();
                for(var i = 0;i<uid.length; i++){
                   if(userId == uid[i][0]){
                    var already = true;
                    sheet.getRange(i+2,2).setValue(displayName);
                    sheet.getRange(i+2,3).setValue(statusMessage);
                    sheet.getRange(i+2,4).setValue('=IMAGE("'+pictureUrl+'")');
                   }
                }
                   if(!already){
                    var img = '=IMAGE("'+pictureUrl+'")';
                    sheet.appendRow([userId, displayName, statusMessage, img, "false"]);
                    var admId = "Uf879a6ef33f584bb96f7053e564b8376";
                    var mess = [{'type': 'text', 'text': 'conf '+userId}];
                    pushMsg(admId, mess, channelToken);
                   }
            break;
          case 'unfollow':
            var mess = [{'type': 'text', 'text': "unfollow"}];
            replyMsg(replyToken, mess, channelToken);
            break;
          default:
            break;
        }
      }
   }
}
