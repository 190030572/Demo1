module.exports = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD:'password',
    DB: 'mani',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}





const db = require('../models')

const Branch = db.branch


// main work

// 1. create branch

const addBranch = async (req, res) => {

    let info = {
       
        name: req.body.name,
        branch_id: req.body.branch_id,
        
        
    }

    const branch = await Branch.create(info)
    res.status(200).send(branch)
    console.log(branch)

}



// 2. get all branches

const getAllBranches = async (req, res) => {

    let branches = await Branch.findAll({})
    res.status(200).send(branches)

}

// 3. get single branch

const getOneBranch = async (req, res) => {

    let id = req.params.id
    let branch = await Branch.findOne({ where: { id: id }})
    res.status(200).send(branch)

}

// 4. update branch

const updateBranch = async (req, res) => {

    let id = req.params.id

    const branch = await Branch.update(req.body, { where: { id: id }})

    res.status(200).send(branch)
   

}

// 5. delete branch by id

const deleteBranch = async (req, res) => {

    let id = req.params.id
    
    await Branch.destroy({ where: { id: id }} )

    res.status(200).send('Branch is deleted !')

}

const getBranchStudents =  async (req, res) => {

    const id = req.params.id

    const data = await Branch.findOne({
        include: [{
            model: Student,
            as: 'student'
        }],
        where: { id: id }
    })

    res.status(200).send(data)

}


module.exports = {
    addBranch,
    getAllBranches,
    getOneBranch,
    updateBranch,
    deleteBranch,
    getBranchStudents,    
}







const db = require('../models')

// model
const Student = db.students

// functions

//1. Add Student

const addStudent = async (req, res) => {

    const id = req.params.id

    let data = {
        student_id:id,
        student_name: req.body.student_name,
       
    }

    const student = await Student.create(data)
    res.status(200).send(student)
    console.log(student)

}

// 2. Get All Students

const getAllStudents= async (req, res) => {

    const students = await Student.findAll({})
    res.status(200).send(students)

}

module.exports = {
    addStudent,
    getAllStudents
}




module.exports = (sequelize, DataTypes) => {

    const Branch = sequelize.define("branch", {

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        branch_id: {
            type: DataTypes.INTEGER
        }
    
    })

    return Branch

}




















const dbConfig = require('../config/db.config');

const {Sequelize, DataTypes, STRING} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: STRING,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle

        }
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.branch = require('./branchModel')(sequelize, DataTypes)
db.students = require('./studentModel')(sequelize, DataTypes)


db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})

db.branch.hasMany(db.students, {
    foreignKey: 'student_id',
    as: 'student'
})

db.stu.belongsTo(db.branch, {
    foreignKey: 'student_id',
    as: 'branch'
})

module.exports = db














module.exports = (sequelize, DataTypes) => {

    const Student = sequelize.define("student", {
        branch_id: {
            type: DataTypes.INTEGER
        },
        student_name: {
            type: DataTypes.STRING
        }
    })

    return Student

}





// import controllers review, products
const branchController = require('../controllers/branchController')
const studentController = require('../controllers/studentController')


// router
const router = require('express').Router()


// use routers
router.post('/addBranch', branchController.addBranch)

router.get('/allBranches', branchController.getAllBranches)




// Review Url and Controller

router.get('/allStudents', studentController.getAllStudents)
router.post('/addStudent', studentController.addStudent)

// get branch students relation
router.get('/getBranchStudents/:id', branchController.getBranchStudents)




// Branch router
router.get('/:id', branchController.getOneBranch)

router.put('/:id', branchController.updateBranch)

router.delete('/:id', branchController.deleteBranch)

module.exports = router













const express = require('express')
const cors = require('cors')


const app = express()


app.use(express.json())

app.use(express.urlencoded({ extended: true }))


// routers
const router = require('./routes/branchRoutes')
app.use('/api/branch', router)

//port

const PORT = process.env.PORT || 7766

//server

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})






















































