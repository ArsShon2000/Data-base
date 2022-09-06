
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();

const app = express()
const bodyParser = require('body-parser')
const db = new sqlite3.Database('./mock.db', sqlite3.OPEN_READWRITE, (error) => {
  if (error) return console.error(error);

  console.log('connected successfully')
})

app.use(bodyParser.json())
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    // if(whitelist.includes(origin || ""))
    //     return callback(null, true)
    //
    // callback(new Error('Not allowed by CORS'));
    console.log("origin: ", origin);
    callback(null, true); // everyone is allowed
  }
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }))
//==============================================================================================
// создание списка имен для белого списка
app.post('/create-db-wn', () => {
  db.run(
    `CREATE TABLE wNames (id_name INTEGER PRIMARY KEY AUTOINCREMENT, 
                                        name);`
  )
})

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
      id_name,
      name, 
      car_number TEXT UNIQUE);`
  )
})

//-------------------------------------------------------------------------------------------------------------------

// создание списка для черного списка
app.post('/create-db-bn', () => {
  db.run(
    `CREATE TABLE bNames(id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name);`
  )
})

// создание списка для черного списка
app.post('/create-db-b', () => {
  db.run(
    `CREATE TABLE bNum(id INTEGER PRIMARY KEY AUTOINCREMENT,
          car_number TEXT UNIQUE, 
          name,
          id_name,
          CONSTRAINT fk_bNames
          FOREIGN KEY (id_name) REFERENCES bNames (id_name)
          );`
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

app.delete('/delete-db-W', () => {
  db.run(
    `DROP TABLE WNum;`
  )
})
//-------------------------------------------------------------------------------------------------------------------

app.delete('/delete-db-b', () => {
  db.run(
    `DROP TABLE bNum;`
  )
})
//==============================================================================================

// delFunction
//удаление по номеру
app.delete('/wNum/:car_number', (req, res) => {
  const { car_number } = req.params
  const sql = `DELETE FROM wNum WHERE car_number = ?`
  db.run(sql, [car_number], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'Deleted' })
  })
})

// удаление по владельцу
app.delete('/wNames/:id_name', (req, res) => {
  const { id_name } = req.params
  const sql = `DELETE FROM wNames WHERE id_name = ?`
  db.run(sql, [id_name], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'Deleted' })
  })
})

//-------------------------------------------------------------------------------------------------------------------

//удаление по номеру
app.delete('/bNum/:car_number', (req, res) => {
  const { car_number } = req.params
  const sql = `DELETE FROM bNum WHERE car_number = ?`
  db.run(sql, [car_number], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'Deleted' })
  })
})

// удаление по владельцу
app.delete('/bNames/:name', (req, res) => {
  const { name } = req.params
  const sql = `DELETE FROM bNames WHERE name = ?`
  db.run(sql, [name], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'Deleted' })
  })
})
// delFunction
//==============================================================================================

// получаем white данные из бд по номеру
app.get('/wNum', (req, res) => {
  const sql = `SELECT * FROM wNum`
  db.all(sql, [], (error, rows) => {
    if (error) return console.error(error);
    // let info = rows[9]
    res.send({ wNum: rows })
    // console.log(info.name)
  })
})

// получаем white данные из бд по имени
app.get('/wNames', (req, res) => {
  const sql = `SELECT * FROM wNames`
  db.all(sql, [], (error, rows) => {
    if (error) return console.error(error);
    let info = rows.length
    res.send({ wNames: rows })
    console.log(info)
  })
})

// получаем white данные из бд по имени
app.get('/wNames2', (req, res) => {
  const sql = `SELECT * FROM wNames2`
  db.all(sql, [], (error, rows) => {
    if (error) return console.error(error);
    let info = rows.length
    res.send({ wNames2: rows })
    console.log(info)
  })
})
//-------------------------------------------------------------------------------------------------------------------

// получаем black данные из бд
app.get('/bNum', (req, res) => {
  const sql = `SELECT * FROM bNum`
  db.all(sql, [], (error, rows) => {
    if (error) return console.error(error);
    res.send({ bNum: rows })
  })
})

// получаем black данные из бд по имени
app.get('/bNames', (req, res) => {
  const sql = `SELECT * FROM bNames`
  db.all(sql, [], (error, rows) => {
    if (error) return console.error(error);
    // let info = rows[3]
    res.send({ bNames: rows })
    // console.log(info.name)
  })
})
//==============================================================================================

// // получаем данные из бд которые в текстовом файле
// app.get('/genNomLong', (req, res) => {
//   const sql = `SELECT * FROM genNomLong`
//   db.all(sql, [], (error, rows) => {
//     if (error) return console.error(error);
//     res.send({ genNomLong: rows})
//   })
// })


// // получаем данные из бд которые в текстовом файле
// app.get('/genNomShort', (req, res) => {
//   const sql = `SELECT * FROM genNomShort`
//   db.all(sql, [], (error, rows) => {
//     if (error) return console.error(error);
//     res.send({ genNomShort: rows})
//   })
// })


//==============================================================================================

// добавление данных в белый список 

app.post('/wNum', (req, res) => {
  const { carNumber, name, id_name } = req.body;
  const sql = `INSERT INTO wNum(car_number, name, id_name) VALUES(?, ?, ?)`
  if (carNumber != '') {
    db.run(sql, [carNumber, name, id_name], (error) => {
      if (error) return console.error(error);
      res.send({ message: 'ok' })
    })
  }
})

// добавление имени в белый список
app.post('/wNames', (req, res) => {
  const { name } = req.body;
  const sql = `INSERT INTO wNames( name) VALUES( ?)`
  db.run(sql, [name], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'ok' })
  })
})

app.post('/wNames2', (req, res) => {
  const { name } = req.body;
  const sql = `INSERT INTO wNames2 ( name) VALUES( ?)`
  db.run(sql, [name], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'ok' })
  })
})
//-------------------------------------------------------------------------------------------------------------------

// добавление данных в черный список
app.post('/bNum', (req, res) => {
  const { carNumber, name, id_name } = req.body;
  const sql = `INSERT INTO bNum(car_number, name, id_name) VALUES(?, ?, ?)`
  if (carNumber != '') {
    db.run(sql, [carNumber, name, id_name], (error) => {
      if (error) return console.error(error);
      res.send({ message: 'ok' })
    })
  }
})

// добавление имени в черный список
app.post('/bNames', (req, res) => {
  const { name } = req.body;
  const sql = `INSERT INTO bNames(name) VALUES(?)`
  db.run(sql, [name], (error) => {
    if (error) return console.error(error);
    res.send({ message: 'ok' })
  })
})

//==============================================================================================

// // добавление данных из текстового файла
// app.post('/genNomLong', (req, res) => {
//   const {carNumber} = req.body;
//   const sql = `INSERT INTO genNomLong(car_number) VALUES('long.txt',readfile('long.txt'))`
// db.run(sql, [ carNumber], (error) => {
//   if (error) return console.error(error);
//   res.send({message: 'ok'})
// })
// })

// // добавление данных из текстового файла
// app.post('/genNomShort', (req, res) => {
//   const {carNumber} = req.body;
//   const sql = `INSERT INTO genNomShort(car_number) VALUES('short.txt',readfile('short.txt'))`
// db.run(sql, [ carNumber], (error) => {
//   if (error) return console.error(error);
//   res.send({message: 'ok'})
// })
// })

//==============================================================================================


app.listen(5000, () => {
  console.log(`Наш порт http://127.0.0.1:5000`)
})

module.exports = app