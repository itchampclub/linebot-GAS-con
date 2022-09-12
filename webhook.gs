var channelToken = "59rotQ+Han4OF0IOQqEZIxPmHsjdTN5h5jYhxcx+NLPBaa3PeU/EvXyFyNP84Sbe9f6yUkkj8F7w1/0AIrEGdPLhN2pVuK8JEZRAkkTJiGKAaOD7owQVPErq73SS2FaFu3uErXHPrXm0uqvUkojElQdB04t89/1O/w1cDnyilFU=";
var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1_eGx9KSAlgz2i34oPmRfsOxSly3B8DTygznrBUuJkt8/edit#gid=0");
var sheet = ss.getSheetByName("data");
var sheet2 = ss.getSheetByName("test");
var admId = "Uf879a6ef33f584bb96f7053e564b8376";

var confcheck = sheet.getRange(2, 1, sheet.getLastRow(),sheet.getLastColumn()).getValues();
var testdata = sheet2.getRange(2, 1, sheet2.getLastRow(),sheet2.getLastColumn()).getValues();

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
        var event = events[0];
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

            if(messageText.indexOf("conf ")>-1){            //Admin
if(userId == admId){
              var confId = messageText.split(' ',2)[1];
            var uid = sheet.getRange(2, 1, sheet.getLastRow(),sheet.getLastColumn()).getValues();
            for(var i = 0;i<uid.length; i++){
            if(confId == uid[i][0]){
              sheet.getRange(i+2,5).setValue("TRUE");
              var mess = [{'type': 'text', 'text': 'ได้รับสิทธิ์ใช้งานจากผู้ดูแล'}];
              pushMsg(confId, mess, channelToken);
                }
              }
}else{
                  var mess = [{'type': 'text', 'text': 'คุณไม่มีสิทธิ์ในการใช้คำสั่งนี้'}];
                  replyMsg(replyToken, mess, channelToken);
}
            }else if(messageText.indexOf("uncon ")>-1){
if(userId == admId){
              var confId = messageText.split(' ',2)[1];
            var uid = sheet.getRange(2, 1, sheet.getLastRow(),sheet.getLastColumn()).getValues();
            for(var i = 0;i<uid.length; i++){
            if(confId == uid[i][0]){
              sheet.getRange(i+2,5).setValue("FALSE");
              var mess = [{'type': 'text', 'text': 'ยกเลิกสิทธิ์ใช้งานจากผู้ดูแล'}];
              pushMsg(confId, mess, channelToken);
                }
              }
}else{
                  var mess = [{'type': 'text', 'text': 'คุณไม่มีสิทธิ์ในการใช้คำสั่งนี้'}];
                  replyMsg(replyToken, mess, channelToken);
}
            }
            else{                      //User
            for(var i = 0;i<confcheck.length; i++){
               if(userId == confcheck[i][0]){
                 var userf = true;
               var confstatus = sheet.getRange(i+2,5).getValue();
            if(confstatus == true){
            if(messageText.length >= 1){

            for(var i = 0;i<testdata.length; i++){                      //Sheet2 q&a
            if(messageText == testdata[i][0]){                    //Sheet2 for loop match question.
              var isquestion = true
              var ans = sheet2.getRange(i+2,2).getValue();       //Sheet2 answer
              var mess = [{'type': 'text', 'text': ans}];
              replyMsg(replyToken, mess, channelToken);
                }
              }
              
              if(!isquestion){
                  var mess = [{'type': 'text', 'text': 'ไม่พบคำถามในรายการ >_\n'+messageText}];
                  replyMsg(replyToken, mess, channelToken);
              }
               }
              }
             else{
            var mess = [{'type': 'text', 'text': "ไอดีท่านยังไม่ได้รับการยืนยัน"}];
            replyMsg(replyToken, mess, channelToken);
                }
              }
            }
          }
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
                    sheet.appendRow([userId, displayName, statusMessage, img, 'false']);

                   
            
                    var mess = [{
        "type": "flex",
        "altText": "confirm or not!!",
        "contents": {
  "type": "bubble",
  "hero": {
    "type": "image",
    "size": "full",
    "aspectRatio": "20:13",
    "aspectMode": "cover",
    "url": pictureUrl
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "spacing": "md",
    "contents": [
      {
        "type": "text",
        "text": displayName,
        "size": "xl",
        "weight": "bold",
        "align": "center"
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "horizontal",
    "contents": [
      {
        "type": "button",
        "style": "primary",
        "color": "#41A317",
        "action": {
          "type": "message",
          "label": "CONFIRM",
          "text": "conf "+userId
        },
        "gravity": "center"
      },
      {
        "type": "separator",
        "margin": "sm"
      },
      {
        "type": "button",
        "style": "primary",
        "color": "#9F000F",
        "action": {
          "type": "message",
          "label": "REJECT",
          "text": "uncon "+userId
        },
        "gravity": "center"
      }
    ]
  }
}
        }];


                    pushMsg(admId, mess, channelToken);
                   }
            break;
          default:
            break;
        }
      }
