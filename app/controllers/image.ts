import { Router, Request, Response } from 'express';
import * as multer from 'multer';
var fs = require('fs');
const router: Router = Router();

router.get('/profile/:id', (req: Request, res: Response) => {
    fs.readFile(`uploads/${req.params.id}`
        , (err, data) => {
            if (!err) {
                res.write(data);
                res.end();
            } else {
                res.end();
            }
        });
});


export const ImageController: Router = router;