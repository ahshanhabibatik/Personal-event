const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const port = process.env.PORT || 5004;


// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tqyfr7x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const userCollection = client.db("LifeEventDB").collection("users");
        const jobCollection = client.db("LifeEventDB").collection("JobInfo");
        const amountCollection = client.db("LifeEventDB").collection("AmountInfo");
        const costCollection = client.db("LifeEventDB").collection("costInfo");
        const readingCollection = client.db("LifeEventDB").collection("readingInfo");


        // jwt related api
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.send({ token });
        })

        // middlewares 
        const verifyToken = (req, res, next) => {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: 'unauthorized access' });
            }
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).send({ message: 'unauthorized access' })
                }
                req.decoded = decoded;
                next();
            })
        }

        // use verify admin after verifyToken
        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            const isAdmin = user?.role === 'admin';
            if (!isAdmin) {
                return res.status(403).send({ message: 'forbidden access' });
            }
            next();
        }

        // users related api
        app.get('/users', verifyToken, verifyAdmin, async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });

        app.get('/users/admin/:email', verifyToken, async (req, res) => {
            const email = req.params.email;

            if (email !== req.decoded.email) {
                return res.status(403).send({ message: 'forbidden access' })
            }

            const query = { email: email };
            const user = await userCollection.findOne(query);
            let admin = false;
            if (user) {
                admin = user?.role === 'admin';
            }
            res.send({ admin });
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // jobInfo route
        app.post('/jobInfo', verifyToken, async (req, res) => {
            const jobInfo = req.body;
            try {
                const result = await jobCollection.insertOne(jobInfo);
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Failed to create job event" });
            }
        });

        // jobInfo route for fetching job events of the current user
        app.get('/jobInfo', verifyToken, async (req, res) => {
            const email = req.decoded.email;
            const query = { email: email }; // Only fetch job events created by the current user
            try {
                const jobs = await jobCollection.find(query).toArray();
                res.send(jobs);
            } catch (error) {
                res.status(500).send({ message: "Failed to fetch job events" });
            }
        });

        // Delete job event by ID
        app.delete('/jobInfo/:id', verifyToken, async (req, res) => {
            const { id } = req.params;

            try {
                const result = await jobCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount === 0) {
                    return res.status(404).send({ message: 'Job event not found' });
                }

                res.send({ message: 'Job event deleted successfully' });
            } catch (error) {
                console.error("Error deleting job event:", error);
                res.status(500).send({ message: 'Failed to delete job event' });
            }
        });

        app.get('/jobInfo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobCollection.findOne(query);
            res.send(result)
        })

        // Update job event by ID
        app.put('/jobInfo/:id', verifyToken, async (req, res) => {
            const { id } = req.params;
            const updatedData = req.body;

            try {
                const result = await jobCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedData }
                );

                if (result.modifiedCount === 0) {
                    return res.status(404).send({ message: 'Job event not found or no changes made' });
                }

                res.send({ message: 'Job event updated successfully' });
            } catch (error) {
                console.error("Error updating job event:", error);
                res.status(500).send({ message: 'Failed to update job event' });
            }
        });

        app.post('/amountInfo', verifyToken, async (req, res) => {
            const jobInfo = req.body;
            try {
                const result = await amountCollection.insertOne(jobInfo);
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Failed to create job event" });
            }
        });

        app.get('/amountInfo', verifyToken, async (req, res) => {
            const email = req.decoded.email;
            const query = { email: email }; // Only fetch job events created by the current user
            try {
                const jobs = await amountCollection.find(query).toArray();
                res.send(jobs);
            } catch (error) {
                res.status(500).send({ message: "Failed to fetch job events" });
            }
        });


        // Delete job event by ID
        app.delete('/amountInfo/:id', verifyToken, async (req, res) => {
            const { id } = req.params;

            try {
                const result = await amountCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount === 0) {
                    return res.status(404).send({ message: 'Job event not found' });
                }

                res.send({ message: 'Job event deleted successfully' });
            } catch (error) {
                console.error("Error deleting job event:", error);
                res.status(500).send({ message: 'Failed to delete job event' });
            }
        });


        app.post('/costInfo', verifyToken, async (req, res) => {
            const jobInfo = req.body;
            try {
                const result = await costCollection.insertOne(jobInfo);
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Failed to create job event" });
            }
        });


        app.get('/costInfo', verifyToken, async (req, res) => {
            const email = req.decoded.email;
            const query = { email: email }; // Only fetch job events created by the current user
            try {
                const jobs = await costCollection.find(query).toArray();
                res.send(jobs);
            } catch (error) {
                res.status(500).send({ message: "Failed to fetch job events" });
            }
        });
        app.delete('/costInfo/:id', verifyToken, async (req, res) => {
            const { id } = req.params;

            try {
                const result = await costCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount === 0) {
                    return res.status(404).send({ message: 'Job event not found' });
                }

                res.send({ message: 'Job event deleted successfully' });
            } catch (error) {
                console.error("Error deleting job event:", error);
                res.status(500).send({ message: 'Failed to delete job event' });
            }
        });



        //reading time start

        app.post('/readingInfo', verifyToken, async (req, res) => {
            const jobInfo = req.body;
            try {
                const result = await readingCollection.insertOne(jobInfo);
                res.send(result);
            } catch (error) {
                res.status(500).send({ message: "Failed to create job event" });
            }
        });


        app.get('/readingInfo', verifyToken, async (req, res) => {
            const email = req.decoded.email;
            const query = { email: email }; // Only fetch job events created by the current user
            try {
                const jobs = await readingCollection.find(query).toArray();
                res.send(jobs);
            } catch (error) {
                res.status(500).send({ message: "Failed to fetch job events" });
            }
        });
        app.delete('/readingInfo/:id', verifyToken, async (req, res) => {
            const { id } = req.params;

            try {
                const result = await readingCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount === 0) {
                    return res.status(404).send({ message: 'Job event not found' });
                }

                res.send({ message: 'Job event deleted successfully' });
            } catch (error) {
                console.error("Error deleting job event:", error);
                res.status(500).send({ message: 'Failed to delete job event' });
            }
        });


        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Life Event is sitting')
})

app.listen(port, () => {
    console.log(`Life Event is sitting on port ${port}`);
})

