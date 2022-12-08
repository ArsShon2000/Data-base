
require('dotenv').config()

let bool = true
const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')

const app = express()
const bodyParser = require('body-parser')
const db = new sqlite3.Database('./mock.db', sqlite3.OPEN_READWRITE, (error) => {
  if (error) return console.error(error);

  console.log('connected successfully')
})
let ID_Name
let posetitely = 0
let setYear = "2022"
let setMonth = "10"
let setDay = "13"



app.use(bodyParser.json())
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    // if(whitelist.includes(origin || ""))
    //     return callback(null, true)
    //
    // callback(new Error('Not allowed by CORS'));
    console.log("origin: ", origin, posetitely++);
    callback(null, true); // everyone is allowed
  }
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }))






// =====================Получаю все видео из указанной папки==========================


let path = require('path');
let async = require('async');


function getFiles (dirPath, callback) {

    fs.readdir(dirPath, function (err, files) {
        if (err) return callback(err);

        var filePaths = [];
        async.eachSeries(files, function (fileName, eachCallback) {
          let filePath = path.join(dirPath, fileName);

            fs.stat(filePath, function (err, stat) {
                if (err) return eachCallback(err);

                if (stat.isDirectory()) {
                    getFiles(filePath, function (err, subDirFiles) {
                        if (err) return eachCallback(err);

                        filePaths = filePaths.concat(subDirFiles);
                        eachCallback(null);
                    });

                } else {
                    if (stat.isFile() && /\.mp4$/.test(filePath)) {
                        filePaths.push(filePath);
                    }

                    eachCallback(null);
                }
            });
        }, function (err) {
            callback(err, filePaths);
        });

    });
}

// getFiles('C:/develop/playgraund/FinallyWork/my-app/src/Videobar/multi/', function (err, files) {
//   console.log(err || files);
// });


app.get('/archiveList', (req, res) => {
  getFiles(`C:/develop/playgraund/FinallyWork/my-app/src/Videobar/multi/${setYear}/${setMonth}/${setDay}`, function (err, files){
    console.log("запрос на получение видео из архива");
    console.log(err || files);
    if (err) return console.error(err);
    res.send({files,setYear,setMonth,setDay})
  })
})

// =====================Получаю все видео из указанной папки==========================


app.post('/archiveList/byDate', (req, res) => {
  setYear = req.body.year.toString()
  setMonth = req.body.month.toString()
  setDay = req.body.day.toString()
  console.log(req.body.year + "----------------------------------------")
  console.log(req.body.month + "----------------------------------------")
  console.log(req.body.day + "----------------------------------------")
  console.log(typeof(setYear))
  res.send({ message: 'ok' })
  
})




//==============================================================================================

// создание списка имен для белого списка
// app.post('/create-db-wn', () => {
//   db.run(
//     `CREATE TABLE wNames (id_name INTEGER PRIMARY KEY AUTOINCREMENT, 
//                                         name);`
//   )
// })

app.post('/create-db-wn2', () => {
  db.run(
    `CREATE TABLE wNames2 (id_name INTEGER PRIMARY KEY AUTOINCREMENT, 
                                        name);`
  )
})

// создание списка для белого списка
app.post('/create-db-w', () => {
  db.run(
    `CREATE TABLE wNum(id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_name INTEGER,
      name CHAR(16), 
      car_number TEXT UNIQUE);`
  )
})

app.post('/create-login', () => {
  db.run(
    `CREATE TABLE login (bool);`
  )
})
//-------------------------------------------------------------------------------------------------------------------

// создание списка для черного списка
app.post('/create-db-bn2', () => {
  db.run(
    `CREATE TABLE bNames2 (id_name INTEGER PRIMARY KEY AUTOINCREMENT, 
      name);`
  )
})

// создание списка для черного списка
app.post('/create-db-b', () => {
  db.run(
    `CREATE TABLE bNum(id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_name,
      name, 
      car_number TEXT UNIQUE,
      workPosition,
      telNumber);`
  )
})
//==============================================================================================

// // создание списка для генератора номера (long)
// app.post('/create-db-long', () => {
//   db.run(
//     `CREATE TABLE genNomLong(car_number);`
//   )
// })


// // создание списка для генератора номера (short)
// app.post('/create-db', () => {
//   db.run(
//     `CREATE TABLE genNomShort(car_number);`
//   )
// })



//==============================================================================================

app.delete('/delete-db-w', () => {
  db.run(
    `DROP TABLE wNum;`
  )
})
//-------------------------------------------------------------------------------------------------------------------

app.delete('/delete-db-B', () => {
  db.run(
    `DROP TABLE bNum;`
  )
})
//==============================================================================================

// delFunction
//удаление по номеру
app.delete('/wNum/cn/:car_number', (req, res) => {
  const { car_number } = req.params
  const sql = `DELETE FROM wNum WHERE car_number = ?`
  db.run(sql, [car_number], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'Deleted' })
  })
})

// удаление по владельцу
app.delete('/wNum/id/:id_name', (req, res) => {
  const { id_name } = req.params
  parseInt(id_name)
  console.log(typeof parseInt(id_name) + " на удаление")
  const sql = `DELETE FROM wNum WHERE id_name = ?`
  db.run(sql, [parseInt(id_name)], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'Deleted' })
  })
})

// переопределение потока камеры
app.put('/Cameras/id/:id_name', (req, res) => {
  const { id_name} = req.params
  const { edit_stream, edit_mode  } = req.body;
  const sql = `UPDATE videoStreams SET nameStream = ?, editMode = ? WHERE id_name = ?`
  db.run(sql, [ edit_stream, edit_mode, parseInt(id_name)], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'updated' })
  })
})



// ==========================================================
// logout
app.delete('/login/:bool', (req, res) => {
  bool = true
  const sql = `DELETE FROM login WHERE bool = ?`
  db.run(sql, [bool], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'Deleted' })
  })
})

//-------------------------------------------------------------------------------------------------------------------

//удаление по номеру
app.delete('/bNum/cn/:car_number', (req, res) => {
  const { car_number } = req.params
  const sql = `DELETE FROM bNum WHERE car_number = ?`
  db.run(sql, [car_number], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'Deleted' })
  })
})

// удаление по владельцу
app.delete('/bNum/id/:id_name', (req, res) => {
  const { id_name } = req.params
  parseInt(id_name)
  const sql = `DELETE FROM bNum WHERE name = ?`
  db.run(sql, [parseInt(id_name)], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'Deleted' })
  })
})
// delFunction
//==============================================================================================



// получаем white данные из бд по номеру
app.get('/wNum', (req, res) => {
  const sql2 = `SELECT * FROM wNames2`
  db.all(sql2, [], (error, rows) => {
    if (error) return console.error(error);
    ID_Name = rows.length
    console.log(ID_Name + " id Name")
  })
  const sql = `SELECT * FROM wNum`
  db.all(sql, [], (error, rows) => {
    if (error) return console.error(error);
    // let info = rows[9]
    res.send({ wNum: rows })
    // console.log(sql.length)
  })
})

// получаем white данные из бд по имени
// app.get('/wNames', (req, res) => {
//   const sql = `SELECT * FROM wNames`
//   db.all(sql, [], (error, rows) => {
//     if (error) return console.error(error);
//     // let info = sql.length
//     res.send({ wNames: rows })
//     // console.log(info)
//   })
// })

// получаем white данные из бд по имени
app.get('/wNames2', (req, res) => {
  const sql = `SELECT * FROM wNames2`
  db.all(sql, [], (error, rows) => {
    if (error) return console.error(error);
    ID_Name = rows.length
    // res.send({ wNames2: rows })
    // console.log(sql)
  })
})
// =======================================================
// проверка на авторизацию
app.get('/login', (req, res) => {
  const sql = `SELECT * FROM login`
  db.all(sql, [], (error, rows) => {
    if (error) return console.error(error);
    // let info = rows.length
    res.send({ login: rows })
    console.log("запросы на логинизацию")
  })
})
//-------------------------------------------------------------------------------------------------------------------

// получаем black данные из бд
app.get('/bNum', (req, res) => {
  const sql2 = `SELECT * FROM bNames2`
  db.all(sql2, [], (error, rows) => {
    if (error) return console.error(error);
    ID_Name = rows.length
  })
  const sql = `SELECT * FROM bNum`
  db.all(sql, [], (error, rows) => {
    if (error) return console.error(error);
    res.send({ bNum: rows })
  })
})

// получаем black данные из бд по имени
app.get('/bNames2', (req, res) => {
  const sql = `SELECT * FROM bNames2`
  db.all(sql, [], (error, rows) => {
    if (error) return console.error(error);
    // let info = rows[3]
    ID_Name = rows.length
    // console.log(info.name)
  })
})
//==============================================================================================

// получаем данные из бд videoStreams
app.get('/Cameras', (req, res) => {
  const sql = `SELECT * FROM videoStreams`
  db.all(sql, [], (error, rows) => {
    if (error) return console.error(error);
    // let info = rows.length
    res.send({ videoStreams: rows })
    console.log("запросы на видео потоки")
  })
})

// получаем данные из бд которые в текстовом файле
app.get('/genNum', (req, res) => {
  fs.readFile('carNumber.txt', (error, data) => {
    if (error) { return console.error(error); }
    else {
      // const carNumber = parseInt(data)
      // data.toString()
      res.send({ genNum: data.toString() })
      console.log(typeof(data.toString()) + " data car number")
      res.end()
    }
  })
})

// получаем данные из бд которые в текстовом файле log.txt  
app.get('/logFile', (req, res) => {
  fs.readFile('log.txt', (error, data) => {
    if (error) { return console.error(error); }
    else {
      // const carNumber = parseInt(data)
      // data.toString()
      res.send({ log: data.toString() })
      console.log(typeof(data.toString()) + " data log")
      res.end()
    }
  })
})

//==============================================================================================

// добавление данных в белый список 

app.post('/wNum', (req, res) => {
  // const wNames2 = `SELECT COUNT(id_name) FROM wNames2`
  let id_name = ID_Name + 1;
  console.log(id_name + " (id_name После добавления)")
  const { carNumber, name} = req.body;
  const sql = `INSERT INTO wNum(car_number, name, id_name ) VALUES(?, ?, ?)`
  if (carNumber != '') {
    db.run(sql, [carNumber, name, id_name], (error) => {
      if (error) return console.error(error);
      res.send({ message: 'ok' })
    })
  }
})

app.post('/wNumWithId', (req, res) => {
  const { carNumber, name, id_name} = req.body;
  const sql = `INSERT INTO wNum(car_number, name, id_name) VALUES(?, ?, ?)`
  if (carNumber != '') {
    db.run(sql, [carNumber, name, id_name], (error) => {
      if (error) return console.error(error);
      res.send({ message: 'ok' })
    })
  }
})

// добавление имени в белый список
// app.post('/wNames', (req, res) => {
//   const { name } = req.body;
//   const sql = `INSERT INTO wNames( name) VALUES( ?)`
//   db.run(sql, [name], (error) => {
//     if (error) return console.error(error);
//     res.send({ message: 'ok' })
//   })
// })

app.post('/wNames2', (req, res) => {
  const { name } = req.body;
  const sql = `INSERT INTO wNames2 (name) VALUES( ?)`
  db.run(sql, [name], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'ok' })
  })
})

// ==============================================
// login

app.post('/login', (req, res) => {
  const { login, password } = req.body;
  if(login === "admin" && password === "admin"){
    bool = true
  const sql = `INSERT INTO login (bool) VALUES( ?)`
  db.run(sql, bool, (error) => {
    if (error) return console.error(error);
    res.send({ message: 'ok' })
  })
}
})
//-------------------------------------------------------------------------------------------------------------------

// добавление данных в черный список
app.post('/bNum', (req, res) => {
  let id_name = ID_Name + 1;
  console.log(id_name + " (id_name После добавления)")
  const { carNumber, name, workPosition, telNumber } = req.body;
  const sql = `INSERT INTO bNum(car_number, name, id_name, workPosition, telNumber) VALUES(?, ?, ?, ?, ?)`
  if (carNumber != '') {
    db.run(sql, [carNumber, name, id_name, workPosition, telNumber], (error) => {
      if (error) return console.error(error);
      res.send({ message: 'ok' })
    })
  }
})

// добавление имени в черный список
app.post('/bNames2', (req, res) => {
  const { name } = req.body;
  const sql = `INSERT INTO bNames2 (name) VALUES(?)`
  db.run(sql, [name], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'ok' })
  })
})


//==============================================================================================


app.listen(5000, () => {
  console.log(`Наш порт http://127.0.0.1:5000`)
})

module.exports = app




