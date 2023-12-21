import React from 'react';
import SQLite from 'react-native-sqlite-2'
import moment from 'moment';


export const CreateBD = () => {
  global.db = SQLite.openDatabase(
    {
      name: 'kemel',
      location: 'default',
      createFromLocation: '~kemel.db',
    },
    () => {
      console.log("kemelDB: OPEN ");

      CreateTable()
    },
    error => {
      console.log(" kemelDB ERROR2: " + error);
    }
  );
}





const ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
  db.transaction((trans) => {
    trans.executeSql(sql, params, (trans, results) => {
      resolve(results);

    },
      (error) => {
        reject(error);
        console.log('kemelDB ERROR12', error)
      });
  });
});






////////////////////// TABLES ///////////




// ka_folder  id, label, created_at, updated_at, author, root, parent
// ka_reminder id, label , created_at, updated_at, time 
//ka_habits  id,  label , created_at , updated_at , time, click_date , dessc , done , purpose , target , target_id , target_date, target_value, weeks 
//ka_tasks  id,  label , created_at , updated_at , address, author, datetime,  dessc, done, priority, reminder,
//  ka_notes   id ,label, created_at, updated_at, author folder, dessc, parent, 
//  ka_maksat   id,  label, created_at,updated_at, sort, color, 
//  ka_goal  id,  label, created_at, updated_at, author,    category_id,   date_from, date_to,statuss, dessc, 


export const CreateTable = async () => {
  let ka_folder = await ExecuteQuery("CREATE TABLE IF NOT EXISTS ka_folder (id INTEGER PRIMARY KEY NOT NULL, label TEXT, created_at  VARCHAR(16), updated_at  VARCHAR(16), author INTEGER, root INTEGER, parent INTEGER )", []);
  let ka_reminder = await ExecuteQuery("CREATE TABLE IF NOT EXISTS ka_reminder (id INTEGER PRIMARY KEY NOT NULL, label TEXT, created_at  VARCHAR(16), updated_at  VARCHAR(16), time INTEGER )", []);
  let ka_habits = await ExecuteQuery("CREATE TABLE IF NOT EXISTS ka_habits (id INTEGER PRIMARY KEY NOT NULL, label TEXT, created_at  VARCHAR(16), updated_at  VARCHAR(16), time INTEGER, click_date VARCHAR(16), dessc TEXT, done INTEGER, purpose INTEGER, target INTEGER, target_id INTEGER, target_date VARCHAR(16), target_value VARCHAR(16), weeks VARCHAR(16))", []);
  let ka_tasks = await ExecuteQuery("CREATE TABLE IF NOT EXISTS ka_tasks (id INTEGER PRIMARY KEY NOT NULL,  label TEXT, created_at VARCHAR(16), updated_at VARCHAR(16), address, author, datetime TEXT,  dessc TEXT, done INTEGER, priority INTEGER, reminder TEXT )", []);
  let ka_notes = await ExecuteQuery("CREATE TABLE IF NOT EXISTS ka_notes (id INTEGER PRIMARY KEY NOT NULL, label TEXT, created_at  VARCHAR(16), updated_at  VARCHAR(16), author INTEGER, folder INTEGER, parent INTEGER, dessc TEXT)", []);
  let ka_maksat = await ExecuteQuery("CREATE TABLE IF NOT EXISTS ka_maksat (id INTEGER PRIMARY KEY NOT NULL, label TEXT, created_at  VARCHAR(16), updated_at  VARCHAR(16), sort INTEGER,  color TEXT)", []);
  let ka_goal = await ExecuteQuery("CREATE TABLE IF NOT EXISTS ka_goal (id INTEGER PRIMARY KEY NOT NULL, label TEXT, created_at  VARCHAR(16), updated_at  VARCHAR(16), author INTEGER, category_id INTEGER, date_from  VARCHAR(16),date_to  VARCHAR(16), statuss INTEGER, dessc TEXT)", []);

}




///////////////////////// INSERT ////////////

export const InsertQueryFolder = async (folders, single) => {

  if (single) {

  } else {
    let folderQuery = "INSERT INTO ka_folder ( id, label, created_at, updated_at, author, root, parent) VALUES";
    let hasElement = false
    for (let i = 0; i < folders.length; ++i) {

      let hasItem = await ExecuteQuery("SELECT * FROM ka_folder WHERE id = ?", [folders[i].id]);
      var rows = hasItem.rows;
      if (rows.length > 0) {

        UpdateQueryFolder(folders[i])
      } else {
        hasElement = true

        let parent = folders[i].parent ? folders[i].parent : 0
        let root = folders[i].root ? 1 : 0

        folderQuery = folderQuery + "('"
          + folders[i].id //id
          + "','"
          + folders[i].label //label
          + "','"
          + folders[i].created_at //created_at
          + "','"
          + folders[i].updated_at //updated_at
          + "','"
          + folders[i].author //author
          + "','"
          + root  //root
          + "','"
          + parent//parent
          + "')";

        if (i != folders.length - 1) {
          folderQuery = folderQuery + ",";
        }
      }
    }

    if (hasElement) {
      folderQuery = folderQuery + ";";

      let folderMultipleInsert = await ExecuteQuery(folderQuery, []);
      console.log(folderMultipleInsert);
    }

  }
}


export const InsertQueryNotes = async (array, single) => {
  //  ka_notes   id ,label, created_at, updated_at, author, folder, dessc, parent, 

  if (single) {

  } else {
    let folderQuery = "INSERT INTO ka_notes ( id, label, created_at, updated_at, author, folder, dessc, parent) VALUES";
    let hasElement = false
    for (let i = 0; i < array.length; ++i) {
      let element = array[i]
      let hasItem = await ExecuteQuery("SELECT * FROM ka_notes WHERE id = ?", [element.id]);
      var rows = hasItem.rows;
      if (rows.length > 0) {

        UpdateQueryNotes(element)
      } else {
        hasElement = true

        let parent = element.parent ? element.parent : 0

        folderQuery = folderQuery + "('"
          + element.id //id
          + "','"
          + element.label //label
          + "','"
          + element.created_at //created_at
          + "','"
          + element.updated_at //updated_at
          + "','"
          + element.author //author
          + "','"
          + element.folder  //root author, folder, dessc, parent
          + "','"
          + element.dessc  //root author, folder, dessc, parent
          + "','"
          + parent//parent
          + "')";

        if (i != array.length - 1) {
          folderQuery = folderQuery + ",";
        }
      }
    }

    if (hasElement) {
      folderQuery = folderQuery + ";";

      let folderMultipleInsert = await ExecuteQuery(folderQuery, []);
      console.log(folderMultipleInsert);
    }

  }
}


export const InsertQueryReminder = async (array) => {

  // ka_reminder id, label , created_at, updated_at, time 
  let insertQuery = "INSERT INTO ka_reminder (id, label , created_at, updated_at, time) VALUES";
  let hasElement = false
  for (let i = 0; i < array.length; ++i) {
    let element = array[i]

    let hasItem = await ExecuteQuery("SELECT * FROM ka_reminder WHERE id = ?", [element.id]);
    var rows = hasItem.rows;
    if (rows.length > 0) {

      UpdateQueryReminder(element)
    } else {
      hasElement = true

      insertQuery = insertQuery + "('"
        + element.id //id
        + "','"
        + element.label //label
        + "','"
        + element.created_at //created_at
        + "','"
        + element.updated_at //updated_at
        + "','"
        + element.time //time
        + "')";

      if (i != array.length - 1) {
        insertQuery = insertQuery + ",";
      }
    }
  }

  if (hasElement) {
    insertQuery = insertQuery + ";";

    let multipleInsert = await ExecuteQuery(insertQuery, []);

  }
}



export const InsertQueryHabits = async (array) => {

  //ka_habits  id,  label , created_at , updated_at , time, click_date , dessc , done , purpose , target , target_id , target_date, target_value, 

  let insertQuery = "INSERT INTO ka_habits (id,  label , created_at , updated_at , time, click_date , dessc , done , purpose , target , target_id , target_date, target_value, weeks) VALUES";
  let hasElement = false
  for (let i = 0; i < array.length; ++i) {
    let element = array[i]

    let hasItem = await ExecuteQuery("SELECT * FROM ka_habits WHERE id = ?", [element.id]);
    var rows = hasItem.rows;

    if (rows.length > 0) {
      UpdateQueryHabits(element)
    } else {
      hasElement = true

      let target_date = element?.target_value?.date ? element?.target_value?.date : ''
      let target_value = element?.target_value?.value ? element?.target_value?.value : ''
      let done = element.done ? 1 : 0


      insertQuery = insertQuery + "('"
        + element.id //id
        + "','"
        + element?.label //label
        + "','"
        + element?.created_at
        + "','"
        + element?.updated_at
        + "','"
        + element?.time
        + "','"
        + element?.click_date
        + "','"
        + element?.dessc
        + "','"
        + done
        + "','"
        + element?.purpose
        + "','"
        + element?.target
        + "','"
        + element?.target_template?.id
        + "','"
        + target_date
        + "','"
        + target_value
        + "','"
        + element?.week
        + "')";



      if (i != array.length - 1) {
        insertQuery = insertQuery + ",";
      }
    }
  }

  if (hasElement) {
    insertQuery = insertQuery + ";";

    let multipleInsert = await ExecuteQuery(insertQuery, []);

  }


}


export const InsertQueryTasks = async (array) => {


  //ka_tasks  id,  label , created_at , updated_at , address, author, datetime,  dessc, done, priority, reminder,


  let insertQuery = "INSERT INTO ka_tasks (id,  label , created_at , updated_at ,address, author, datetime,  dessc, done, priority, reminder) VALUES";
  let hasElement = false
  for (let i = 0; i < array.length; ++i) {
    let element = array[i]

    let hasItem = await ExecuteQuery("SELECT * FROM ka_tasks WHERE id = ?", [element.id]);
    var rows = hasItem.rows;

    if (rows.length > 0) {
      UpdateQueryTasks(element)
    } else {
      hasElement = true

      let reminder = element?.reminder?.label ? element?.reminder?.label : ''
      let done = element.done ? 1 : 0
      let priority = element.priority ? 1 : 0



      insertQuery = insertQuery + "('"
        + element.id //id
        + "','"
        + element?.label //label
        + "','"
        + element?.created_at
        + "','"
        + element?.updated_at
        + "','"
        + element?.address
        + "','"
        + element?.author
        + "','"
        + element?.datetime
        + "','"
        + element?.dessc
        + "','"
        + done
        + "','"
        + priority
        + "','"
        + reminder
        + "')";



      if (i != array.length - 1) {
        insertQuery = insertQuery + ",";
      }
    }
  }

  if (hasElement) {
    insertQuery = insertQuery + ";";

    let multipleInsert = await ExecuteQuery(insertQuery, []);

  }


}



export const InsertQueryMaqsat = async (array, single) => {
  //  ka_maksat   id,  label, created_at,updated_at, sort, color, 

  if (single) {

  } else {
    let folderQuery = "INSERT INTO ka_maksat ( id, label, created_at, updated_at, sort, color) VALUES";
    let hasElement = false
    for (let i = 0; i < array.length; ++i) {
      let element = array[i]
      let hasItem = await ExecuteQuery("SELECT * FROM ka_maksat WHERE id = ?", [element.id]);
      var rows = hasItem.rows;
      if (rows.length > 0) {

        UpdateQueryMaqsat(element)
      } else {
        hasElement = true


        folderQuery = folderQuery + "('"
          + element.id //id
          + "','"
          + element.label //label
          + "','"
          + element.created_at //created_at
          + "','"
          + element.updated_at //updated_at
          + "','"
          + element.sort //sort
          + "','"
          + element.color  //color
          + "')";

        if (i != array.length - 1) {
          folderQuery = folderQuery + ",";
        }
      }
    }

    if (hasElement) {
      folderQuery = folderQuery + ";";

      let folderMultipleInsert = await ExecuteQuery(folderQuery, []);

    }

  }
}



export const InsertQueryGoals = async (array, single) => {
  //  ka_goal  id,  label, created_at, updated_at, author,    category_id ,   date_from, date_to,statuss, dessc, 

  if (single) {

  } else {
    let folderQuery = "INSERT INTO ka_goal ( id, label, created_at, updated_at, author,category_id, date_from, date_to, statuss, dessc ) VALUES";
    let hasElement = false
    for (let i = 0; i < array.length; ++i) {
      let element = array[i]
      let hasItem = await ExecuteQuery("SELECT * FROM ka_goal WHERE id = ?", [element.id]);
      var rows = hasItem.rows;
      if (rows.length > 0) {

        UpdateQueryGoals(element)
      } else {
        hasElement = true

        folderQuery = folderQuery + "('"
          + element.id //id
          + "','"
          + element.label //label
          + "','"
          + element.created_at //created_at
          + "','"
          + element.updated_at //updated_at
          + "','"
          + element.author //author
          + "','"
          + element.category_id //category_id
          + "','"
          + element.date_from  //date_from
          + "','"
          + element.date_to  //date_to
          + "','"
          + element.statuss  //statuss
          + "','"
          + element.dessc  //dessc
          + "')";

        if (i != array.length - 1) {
          folderQuery = folderQuery + ",";
        }
      }
    }

    if (hasElement) {
      folderQuery = folderQuery + ";";

      let folderMultipleInsert = await ExecuteQuery(folderQuery, []);

    }

  }
}




////////////////// UPDATE //////////////////////

export const UpdateQueryFolder = async (row) => {
  // ka_folder  id, label, created_at, updated_at, author, root, parent

  let parent = row.parent ? row.parent : 0
  let root = row.root ? 1 : 0

  let updateQuery = await ExecuteQuery('UPDATE ka_folder SET label=? , created_at=? , updated_at=? , author=?, root=? , parent=?  WHERE id=?',
    [row.label, row.created_at, row.updated_at, row.author, root, parent, row.id]);

}

export const UpdateQueryReminder = async (row) => {
  // ka_reminder id, label , created_at, updated_at, time 
  let updateQuery = await ExecuteQuery('UPDATE ka_reminder SET label=? , created_at=? , updated_at=? ,time=?  WHERE id=?',
    [row.label, row.created_at, row.updated_at, row.time, row.id]);

}

export const UpdateQueryHabits = async (row) => {
  let done = row.done ? 1 : 0
  let target_date = row?.target_value?.date ? row?.target_value?.date : ''
  let target_value = row?.target_value?.value ? row?.target_value?.value : ''
  //ka_habits  id,  label , created_at , updated_at , time, click_date , dessc , done , purpose , target , target_id , target_date, target_value, weeks
  let updateQuery = await ExecuteQuery('UPDATE ka_habits SET label=? , created_at=? , updated_at=? ,time=? ,click_date=? ,dessc=? ,done=? ,purpose=?, target=?, target_id=?,target_date=?,target_value=?, weeks=? WHERE id=?',
    [row.label, row.created_at, row.updated_at, row.time, row.click_date, row.dessc, done, row.purpose, row.target, row.target_template.id, target_date, target_value, row.week, row.id]);

}

export const UpdateQueryTasks = async (row) => {
  let reminder = row?.reminder?.label ? row?.reminder?.label : ''
  let done = row.done ? 1 : 0
  let priority = row.priority ? 1 : 0

  //ka_tasks  id,  label , created_at , updated_at , address, author, datetime,  dessc, done, priority, reminder,

  let updateQuery = await ExecuteQuery('UPDATE ka_tasks SET label=? , created_at=? , updated_at=? ,address=? ,author=?, datetime=? ,dessc=? ,done=? ,priority=?, reminder=? WHERE id=?',
    [row.label, row.created_at, row.updated_at, row.address, row.author, row.datetime, row.dessc, done, priority, reminder, row.id]);

}


export const UpdateQueryNotes = async (row) => {
  //  ka_notes   id ,label, created_at, updated_at, author, folder, dessc, parent, 
  let parent = row.parent ? row.parent : 0
  let updateQuery = await ExecuteQuery('UPDATE ka_notes SET label=? , created_at=? , updated_at=? ,author=? ,folder=? ,dessc=? ,parent=?  WHERE id=?',
    [row.label, row.created_at, row.updated_at, row.author, row.folder, row.dessc, parent, row.id]);
}



export const UpdateQueryMaqsat = async (row) => {
  //  ka_maksat   id,  label, created_at,updated_at, sort, color, 

  let updateQuery = await ExecuteQuery('UPDATE ka_maksat SET label=? , created_at=? , updated_at=? ,sort=? ,color=?  WHERE id=?',
    [row.label, row.created_at, row.updated_at, row.sort, row.color, row.id]);
}



export const UpdateQueryGoals = async (row) => {
  //  ka_goal  id,  label, created_at, updated_at, author,category_id  date_from, date_to,statuss, dessc, 

  let updateQuery = await ExecuteQuery('UPDATE ka_goal SET label=? , created_at=? , updated_at=? ,author=? , category_id=?, date_from=?, date_to=?, statuss=?, dessc=?  WHERE id=?',
    [row.label, row.created_at, row.updated_at, row.author, row.category_id, row.date_from, row.date_to, row.statuss, row.dessc, row.id]);
}





//////////////// GET //////////////////////

export const GetRootFolder = async () => {
  let selectQuery = await ExecuteQuery("SELECT * FROM ka_folder where parent = 0", []);
  let rows = selectQuery.rows
  return rows
}


export const GetRootNotes = async () => {
  let selectQuery = await ExecuteQuery("SELECT * FROM ka_notes where parent = 0", []);
  let rows = selectQuery.rows


  return rows
}

export const GetNotesByID = async (id) => {
  let selectQuery = await ExecuteQuery("SELECT * FROM ka_notes where folder  =?", [id]);
  let rows = selectQuery.rows

  return rows
}

export const GetFolderByID = async (id) => {
  let selectQuery = await ExecuteQuery("SELECT * FROM ka_folder where parent =?", [id]);
  let rows = selectQuery.rows
  return rows
}

export const GetReminderDB = async () => {
  let selectQuery = await ExecuteQuery("SELECT * FROM ka_reminder", []);
  let rows = selectQuery.rows

  return rows
}

export const GetHabitsDB = async (now) => {

  var weeknumber = moment(now, "YYYY-MM-DD").day();


  let selectQuery = await ExecuteQuery("SELECT * FROM ka_habits where weeks like ?", ['%' + weeknumber + '%']);
  let rows = selectQuery.rows

  return rows
}


export const GetTasksDB = async (now) => {
  let selectQuery = await ExecuteQuery("SELECT * FROM ka_tasks where datetime like ?", ['%' + now + '%']);
  let rows = selectQuery.rows

  return rows
}


export const GetMaqsats = async () => {
  let selectQuery = await ExecuteQuery("SELECT * FROM ka_maksat", []);
  let rows = selectQuery.rows

  return rows
}


export const GetGoalById = async (id) => {
  let selectQuery = await ExecuteQuery("SELECT * FROM ka_goal where category_id =?", [id]);
  let rows = selectQuery.rows
  return rows
}



