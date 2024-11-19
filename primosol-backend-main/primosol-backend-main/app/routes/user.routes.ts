import express, { Request, Response } from 'express';
import passport from 'passport';
import path from 'path';
import { sendResponse } from '../utils/global_utils';
import * as db from '../models'; // Assuming db is structured correctly
import * as controller from '../controllers/user.controller';
import { UploadedFile } from 'express-fileupload';

const router = express.Router();

router.route("/user-infos").get(
    passport.authenticate('jwt', { session: false }), controller.getUserInfo
);

router.route("/txData").post(
    passport.authenticate('jwt', { session: false }), controller.getTxData
);

router.route("/holding").post(
    passport.authenticate('jwt', { session: false }), controller.getHoldingTokens
);


router.route("/update-user").post(
    passport.authenticate('jwt', { session: false }), controller.updateUserInfo
);


router.route("/upload").post(
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        console.log("File upload");

        // Assuming req.user is populated by `passport` and has a custom interface
        const userId = (req.user as any).id;
        const user = await db.getUserById(userId);

        if (!user || !req.files || Object.keys(req.files).length === 0) {
            return sendResponse(
                res,
                400,
                false,
                { error: "No files were uploaded." },
                "Upload failed due to no files."
            );
        }

        const wallet = user.wallet;
        const file: UploadedFile = req.files.file as UploadedFile
        const type = req.body.type;

        const uploadPath = path.join('uploads', type, wallet);

        console.log('uploadPath = ', uploadPath);
        file.mv(uploadPath, (err: Error) => {
            if (err) {
                console.log('Upload file move error');
                return sendResponse(
                    res,
                    400,
                    false,
                    { error: err.message },
                    "Upload file move failed"
                );
            }

            const url = `${req.protocol}://${req.get('host')}/${uploadPath}`;

            return sendResponse(
                res,
                200,
                true,
                { data: url },
                "Upload file success"
            );
        });
    }
);

export default router;