const express = require('express')
const app = express()
const fs = require('fs')
const bp = require("body-parser")
const path = require('path')
app.set('view engine' , 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(bp.urlencoded({extended: true}))
const { rejects } = require('assert')

const readFile = (filename) => {
    return new Promise((resolve, reject) =>{
        fs.readFile('./tasks.json', 'utf8', (err, data) => {

            if (err) {
                console.log(err);
                return;
            } 
            const tasks = JSON.parse(data)
            resolve(tasks)

        });
    })

} 
app.get('/delete-task/:taskId', (req, res) => {
    readFile('./tasks.json').then((tasks) => {
        const newTasks = tasks.filter((task) => task.id !== parseInt(req.params.taskId))
        data = JSON.stringify(newTasks, null, 2)
        fs.writeFile('./tasks.json', data, (err) => {
            if (err){
                console.log(err);
                return;
            } 
            res.redirect('/')

        })
    })
})

app.get('/', (req, res) =>{
    readFile('./tasks.json')
    .then((tasks) =>{

        res.render('index',{tasks: tasks} )
    }) 
    
        

    })

    


app.post('/', (req, res) =>{

    readFile('./tasks.json').then((tasks) => {
        let index
        if (tasks.length === 0){
            index = 1
        } else {
            index = tasks[tasks.length - 1].id + 1;
        }
        const newTask = {
            "id": index,
            "task": req.body.task
        }
        tasks.push(newTask)
        console.log('form sent data!')
        data = JSON.stringify(tasks, null, 2)
        console.log(data)
        fs.writeFile('./tasks.json', data, (err) => {
            if (err){
                console.log(err);
                return;
            } 
            res.redirect('/')

        })
    })

})

app.listen(3001, () =>{

    console.log('Started')

})