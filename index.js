const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000


//middleware
app.use(cors({
    origin: 'http://localhost:5173'
}))
app.use(express.json())







const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hiz8ocw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const menuCollection = client.db('bistroDb').collection('menu')
        const reviewsCollection = client.db('bistroDb').collection('reviews')
        const cartCollection = client.db('bistroDb').collection('cart')
        const usersCollection = client.db('bistroDb').collection('users')

        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray()
            res.send(result)
        })
        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray()
            res.send(result)
        })
        app.get('/cart', async (req, res) => {
            const email = req.query.email
            console.log(email)
            const query = { email: email }
            console.log(query)
            const result = await cartCollection.find(query).toArray()
            res.send(result)
            // console.log(result)
        })
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
            res.send(result)
        })

        // app.get('/cart',async(req,res) => {
        //     const result = await cartCollection.find().toArray()
        //     res.send(result)
        // })
        app.post('/cart', async (req, res) => {
            const cart = req.body
            const result = await cartCollection.insertOne(cart)
            res.send(result)
        })


        // post users
        app.post('/user', async (req, res) => {
            const user = req.body
            const { email } = user
            try {
                const isExists = await usersCollection.findOne({ email: email })
                console.log(isExists)
                if (isExists) {
                    return res.status(400).send({ message: 'user already exists' })
                }
                const result = await usersCollection.insertOne(user)
                res.send(result)
            }
            catch {
                res.status(403).send({ message: 'something went wrong' })
            }
        })

        // get users
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })

        // make user admin
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(query,updatedDoc)
            res.send(result)
        })
        app.delete('/users/admin/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('server running successfully')
})


app.listen(port, () => {
    console.log('server is running on port :', port)
})