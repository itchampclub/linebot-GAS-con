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
            for(var i = 0;i<confcheck.length; i++){                //for loop, Match user by UID.
               if(userId == confcheck[i][0]){  
               var confstatus = sheet.getRange(i+2,5).getValue();
            if(confstatus == true){                                            //เพิ่มเพื่อนแล้ว+ได้รับการยืนยันแล้ว


            if(messageText.length >= 1){ //messageText คือข้อความจาก User * .length >= 1 คือการตรวจสอบความยาวของข้อความ เมื่อ messageText มีความยาวมากกว่าหรือเท่ากับ 1 อักษร จะเข้าเงื่อนไขนี้


// กรณีที่คาดว่าจะมีข้อมูลซ้ำกันเมื่อค้นหา
 var messdata = "รายการข้อมูล"   //สร้างตัวแปรเริ่มต้นเพื่อตอบกลับเมื่อพบข้อมูล >= 1 แถว


            for(var i = 0;i<testdata.length; i++){                      //ค้นหาคำถาม Sheet2 จากตัวแปร testdata (sheet2.getRange(2, 1) 2,1 คือ row,column เริ่มต้น 
            if(messageText == testdata[i][0]){                    //ค้นหาคำถาม Sheet2   (messageText = ข้อความจาก user / testdata = Sheet2 Column1 ที่เรา loop เพื่อเทียบค่า * [i] จะนับจาก 0 = row 1 ไปจนถึง row สุดท้ายที่มีข้อมูล * [0] = ค้นหาจาก column เริ่มต้นตามที่กำหนดในตัวแปร testdata ([0] = column 1, [1] = column 2)
           
              var isquestion = true // ตัวแปร isquestion ใช้สำหรับยืนยันการพบข้อมูลที่ตรงกัน >= 1 row

              var ans = sheet2.getRange(i+2,2).getValue();       //Sheet2 i+2 (i = row ที่พบคำถามเริ่มนับจาก 0 / +2 คือ +1 สำหรับข้ามหัวแถวและ +1 สำหรับเพิ่ม i ให้ i ที่เริ่มนับจาก 0 เป็นเริ่มนับจาก 1) 

                                // กรณีต้องการดึงข้อมูล column อื่นๆจาก row เดียวกัน สามารถเพิ่มตัวแปรตามตัวอย่างได้เลย
              var ansrow3 = sheet2.getRange(i+2,3).getValue(); 
              var ansrow4 = sheet2.getRange(i+2,4).getValue(); 

        messdata += '\nRow = '+(i+2)+'\ncol2'+ans+'\ncol3'+ansrow3+'\ncol3'+ansrow4   // messdata += (+= คือเพิ่มข้อมูลเข้าไปในตัวแปร messdata ที่มีอยู่แล้วตามจำนวน row ที่ค้นพบ * \n คือขึ้นบรรทัดใหม่ )

                }
              }

              if(!isquestion){ // หากไม่พบข้อมูลใดๆ ตัวแปร var isquestion จะไม่ถูกกำหนดขึ้น และเข้าเงื่อนไข !isquestion ( isquestion = false)
                  var messdata = 'ไม่พบคำถามในรายการ >_\n'+messageText;
              }

              var mess = [{'type': 'text', 'text': messdata}];
                  replyMsg(replyToken, mess, channelToken);  
               }

              }
             else{                                                                  //เพิ่มเพื่อนแล้วแต่ยังไม่ได้รับการยืนยัน
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
