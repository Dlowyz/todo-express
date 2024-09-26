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

app.get('/edit-task/:taskId', (req, res) => {
    let red = req.params.taskId
    
    readFile('./tasks.json')
    .then((tasks) =>{

        res.render('index',{tasks: tasks, error: null, red: red} )
    }) 
    
})

app.get('/delete-tasks/', (req, res) => {
        console.log('delete all tasks')
        
        data = JSON.stringify([], null, 2)
        fs.writeFile('./tasks.json', data, (err) => {
            if (err){
                console.log(err);
                return;
            } 
            res.redirect('/')

        
        })
})



app.get('/', (req, res) =>{
    readFile('./tasks.json')
    .then((tasks) =>{

        res.render('index',{tasks: tasks, error: null, red: null} )
    }) 
    
        

    })


    

app.post('/', (req, res) =>{
        let error = null
        if (req.body.action == "edit"){
            console.log(req.body.task)
            console.log(parseInt(req.body.taskId))
            readFile('./tasks.json').then(tasks => {
                tasks.forEach((taskItem) => {
                    if (taskItem.id == req.body.taskId) {
                        taskItem.task = req.body.task;
                    }
                })
                const data = JSON.stringify(tasks, null, 2);
            fs.writeFile('./tasks.json', data, (err) => {
                if (err) {
                    console.log(err);
                    return;
                }
                res.redirect('/');
            })
        })
        } else if (req.body.action == "Add Task"){
        if (req.body.task.trim().length === 0){
            
            error = 'Task cannot be empty'
            console.log(error)
            readFile('./tasks.json')
            .then(tasks => {
            res.render('index', {
                tasks: tasks,
                error: error,
                red: null
            })
        })
            
        } else {
            console.log('no error')
        readFile('./tasks.json')
        .then(tasks => {
            let index
        if (tasks.length === 0){
            index = 1
            console.log('2')
        } else {
            console.log('3')
            index = tasks[tasks.length - 1].id + 1 
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
        } 
            
    }
    })
    



app.listen(3001, () =>{

    console.log('Started')

})