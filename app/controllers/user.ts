import { Router, Request, Response } from 'express';
import { MongoClient, ObjectID } from 'mongodb';
import { mongodb } from '../helpers/mongoDB';
import * as auth from '../helpers/auth';
import * as multer from 'multer';
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, req.params.id)
    }
})

var upload = multer({ storage: storage })

const router: Router = Router();
const collectionName = 'user';

router.use(auth.authenticate());

router.get('/', (req: Request, res: Response) => {
    mongodb.collection(collectionName).find().toArray().then((data) => {
        res.json(data);
    });
});

router.get('/findById/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection(collectionName).findOne({ _id: id })
        .then((data) => {
            res.json(data);
        }
        );
});

router.post('/', (req: Request, res: Response) => {
    let data = req.body;
    mongodb.collection(collectionName).insertOne(data).then((data) => {
        res.json(data);
    });
});

router.delete('/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    mongodb.collection(collectionName).deleteOne({ _id: id }).then((data) => {
        res.json(data);
    });
});

router.put('/:id', (req: Request, res: Response) => {
    let id = new ObjectID(req.params.id);
    let data = req.body;
    mongodb.collection(collectionName).updateOne({ _id: id }, data).then((data) => {
        res.json(data);
    });
});

router.post('/search', (req: Request, res: Response) => {
    let ret = {
        rows: [],
        total: 0
    };
    let data = req.body;
    mongodb.collection(collectionName).find(
        {
            email: new RegExp(`${data.searchText}`)
        }
    ).skip(data.numPage * data.rowPerPage)
        .limit(data.rowPerPage)
        .toArray().then((rows) => {
            ret.rows = rows;
            mongodb.collection(collectionName).find(
                {
                    compName: new RegExp(`${data.searchText}`)
                }
            ).count().then((data) => {
                ret.total = data;
                res.json(ret);
            })
        });
});

router.post('/profile/:id', upload.single('uploads'), (req, res, next) => {
    res.json({
        success: true
    });
});

export const UserController: Router = router;