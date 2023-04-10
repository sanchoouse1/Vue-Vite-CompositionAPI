import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';


var app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);


let db = new sqlite3.Database('database.sqlite', (err) => {
  if (err) {
    // Can't open database.sqlite
    console.log(err.message);
    throw err;
  } else {
    db.run(`CREATE TABLE tasks (id TEXT PRIMARY KEY, text TEXT NOT NULL, description TEXT, completed INTEGER DEFAULT 0, deadline TEXT)`, (err) => {
      if (err) {
        // Таблица уже создана
        console.log("Возможно таблица уже создана");
      } else {
        console.log("Таблица tasks базы данных SQLite успешно создана");
      }
    })
  }
})




app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/src'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.use(cors());




app.post('/api/addTasks', (req, res) => {
  if (!req.body) {
    res.status(400).send({success: false, message: 'Объект не передан'});
    return;
  }
  // принимаю объект новой задачи
  // добавить в строку БД
  // Создал объект одной задачи, которую надо пихнуть в БД
  let taskInDB = {id: null, text: '', description: '', completed: false, deadline: null};
  // req.body копируем в новый объект
  taskInDB = Object.assign(taskInDB, req.body);
  db.run(`INSERT INTO tasks (id, text, description, completed, deadline) VALUES (?, ?, ?, ?, ?)`,
  [taskInDB.id ,taskInDB.text, taskInDB.description, taskInDB.completed, taskInDB.deadline], (err) => {
    if (err) {
      console.error(err);
      res.send({success: false, error: err});
    } else {
      console.log("Задача добавлена в таблицу БД!");
      res.send(taskInDB);
    }
  });
});


app.get('/api/getTasks', (req, res) => {
  // взяли строки из БД и добавляю объекты (!) в массив - получаю массив объектов и передаю обратно клиенту
  // На клиенте логика ясна
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.send({success: false, error: err.message});
    } else {
      const tasks = rows.map(row => ({ // Метод `map()` используется для преобразования каждого элемента массива rows в объект
        id: row.id,
        text: row.text,
        description: row.description,
        completed: Boolean(row.completed),
        deadline: row.deadline
      }));
      res.send({success: true, data: tasks});
    }
  });
});


app.delete('/api/deleteTask/:taskId', (req, res) => {
  if (!req.params.taskId) {
    res.status(400).send({ message: 'Идентификатор задачи не был передан.'});
    return;
  }

  const id = req.params.taskId;
  db.run('DELETE FROM tasks WHERE id = ?', id, function(err) {
    if (err) {
      console.log(err.message);
      res.status(500).send({ message: 'Произошла ошибка удаления задачи.'});
      return;
    }
    console.log(`Задача с id ${id} успешно удалена из базы данных.`);
    res.sendStatus(200);
  // Нужно удалить задачу(объект) из БД по полученному на клиенте индексу и переданному сюда
  });
});


app.put('/api/toggle/:id', (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Идентификатор задачи не был передан.'});
    return;
  }

  // принимаю с клиента уникальный идентификатор и новый статус задачи из тела запроса, в строке по id в БД обновляю
  const id = req.params.id;
  const completed = req.body.completed;

  db.run('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Ошибка при обновлении статуса задачи'});
    } else {
      res.send({ message: 'Статус задачи успешно обновлен' });
    }
  })
})


app.put('/api/editTasks/:id', (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: 'Идентификатор задачи не был передан.'});
    return;
  }

  // принимаю с клиента объект и его индекс и объект в строке по индексу в БД обновляю
  const id = req.params.id;
  const newDescription = req.body.description;
  console.log(`id = ${id}`);
  console.log('req.body:', req.body);
  console.log(newDescription);

  db.run(`UPDATE tasks SET description = ? WHERE id = ?`, [newDescription, id], (err) => {
    if(err) {
      console.error(err.message);
      return res.status(500).send(err.message);
    }
    db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
      }

      const task = {
        id: row.id,
        text: row.text,
        description: row.description,
        completed: row.completed === 1, // привожу числовое значение в булевое
        deadline: row.deadline
      }

      console.log(`task = ${task}`);
      console.log(`row = ${row}`);
      res.send(task);
    });
  });
});





const PORT = 3000;
//запуск сервера
app.listen(PORT, ()=> {
    console.log(`Server started: http://localhost:${PORT}`)
});