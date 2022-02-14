//LINE token
var linetoken = "LINE token";




function Rubbish_day(){
  let week_num = new Date().getDay();

  let text = "";

  if(week_num==2 && week_num==5){

    text += "\n★ゴミ収集車出動★\n"
    text += "今日は可燃ごみを出す日です\n 8：30までよ";

  }else if(week_num==3){

    text += "\n★ゴミ収集車出動★\n";
    text += "今日は不燃ごみを出す日です\n 8：30までよ";

  }

  console.log(text);
  
  return text;
}





function calendar_text(calendars,text){

calendars.forEach((calendar)=>{

  let count=0;

  let events = calendar.getEventsForDay(new Date());

  try{
     let color = events[0].getColor();
     if(calendar.getName().search("@gmail.com")===-1){
    
      text+="●"+calendar.getName()+"\n";

    }else{

      text+="●"+"ユーザー"+"\n";
    
    }

  }catch(e){
    text+="";
  }

  events.forEach((event)=>{

    let text_red="";
    if(event.getColor()==11){
      text_red+="　(重要☆彡）";

    }
    
    let title = event.getTitle();
    let start = toTime(event.getStartTime());
    let end = toTime(event.getEndTime());
    
    if (event.isAllDayEvent()==true){

      let alldayevent_start = Utilities.formatDate(event.getAllDayStartDate(), 'JST', 'M/d');
      let alldayevent_end = Utilities.formatDate(event.getAllDayEndDate(), 'JST', 'M/d');
      text+=` (${alldayevent_start} ~ ${alldayevent_end})`+'\n'+title+text_red+'\n';

    }else{

      count++;
      text += start + ' - ' + end + "\n"+ count+","+title +text_red + '\n';

    }

    text+='\n'+'\n';

  })
 })

 return text;

}




function todo_text(){

  let msg = "[Todo List]\n\n";
  let msg_copy = "[Todo List]\n\n";

  let myTaskLists = getTaskLists();

  myTaskLists.forEach((myTasklist)=>{

    let myTasks = getTasks(myTasklist.id);

    try{

      for(let i=0;i<myTasks.length;i++){
        msg +="・"+ myTasks[i].title + "\n";
       
        if(myTasks[i].notes!=undefined)
          msg+="   "+myTasks[i].notes+"\n"
      }
    }catch(e){

    }
    if (msg==msg_copy){
      msg += "タスクはありません\n\n";
    }
  })
  
  return msg;

}




function main() {
  setTrigger()
 
  const calendars = CalendarApp.getAllCalendars();
  const date = new Date();
  const day = date.getDay();
  const day_list = {0:"日",1:"月",2:"火",3:"水",4:"木",5:"金",6:"土"};

  let text = "\n"+"   "+Utilities.formatDate(new Date(), 'JST', 'yyyy/M/d')+` ${day_list[day]}`+"\n";

  for (let i in calendars) {
    let calendarName = calendars[i].getName();
    if(calendarName.search("@gmail.com")!=-1){
      if(i!=0){

        calendar_save = calendars[0];
        calendars[0]=calendars[i];
        calendars[i]=calendar_save;

      }
    }
  }

  let text_calendar = calendar_text(calendars,text);

  const text_comp = todo_text();
  const text_complete = text_calendar+text_comp;
  console.log(text_complete);
  sendToLine(text_complete);

  if (Rubbish_day()!=""){
    sendToLine_ev(Rubbish_day());
  }
  
}
  
  
  
 
function sendToLine(text){

  const token = linetoken;

  let options =
   {
     "method"  : "post",
     "payload" : "message=" + text,
     "headers" : {"Authorization" : "Bearer "+ token}
 
   };

   UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}
 



function toTime(str){

  return Utilities.formatDate(str, 'JST', 'HH:mm');

}




function getTaskLists() {

  var taskLists = Tasks.Tasklists.list().getItems();
  
  if (!taskLists) {
    return [];
  }

  return taskLists.map(function(taskList) {
    
    return {
      id: taskList.getId(),
      name: taskList.getTitle()
    };
  });
}




function getTasks(taskListId) {

  var tasks = Tasks.Tasks.list(taskListId).getItems();

  if (!tasks) {
    return [];
  }

  return tasks.map(function(task) {
    return {
      id: task.getId(),
      title: task.getTitle(),
      notes: task.getNotes(),
      completed: Boolean(task.getCompleted())
    };
  }).filter(function(task) {
    return task.title;
  });
}




function setTrigger(){
  const date = new Date();
  console.log(date);
  date.setDate(date.getDate()+1);
  date.setHours(07);
  date.setMinutes(00);
  ScriptApp.newTrigger("main").timeBased().at(date).create();
}


function doGet(e) {
  setTrigger()
 
  const calendars = CalendarApp.getAllCalendars();

  let text = "\n"+"   "+Utilities.formatDate(new Date(), 'JST', 'yyyy/M/d')+"\n";

  for (let i in calendars) {
    let calendarName = calendars[i].getName();
    if(calendarName.search("@gmail.com")!=-1){
      if(i!=0){

        calendar_save = calendars[0];
        calendars[0]=calendars[i];
        calendars[i]=calendar_save;

      }
    }
  }

  let text_calendar = calendar_text(calendars,text);

  const text_comp = todo_text();
  const text_complete = text_calendar+text_comp;
  console.log(text_complete);
  sendToLine(text_complete);

  if (Rubbish_day()!=""){
    sendToLine_ev(Rubbish_day());
  }
  
}
