'use server'
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from './s3client'; 
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import crypto from "crypto"
import { FILE_TYPE_NOT_ALLOWED, MAX_FILE_SIZE } from "../errors/post.errors";
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex")

const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "video/mp4",
    "video/quicktime"
]

const MAXFILESIZE = 1048576 * 20; // 20 MB

type GetSignedURLParams = {
    userId: string
    fileType: string
    fileSize: number
    checksum: string
}
export async function s3GenerateSignedURL({
    userId,
    fileType,
    fileSize,
    checksum,
}: GetSignedURLParams) {
    if (!allowedFileTypes.includes(fileType)) {
        return { failure: FILE_TYPE_NOT_ALLOWED }
    }

    if (fileSize > MAXFILESIZE) {
        return { failure: MAX_FILE_SIZE }
    }

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: generateFileName(),
        ContentType: fileType,
        ContentLength: fileSize,
        ChecksumSHA256: checksum,
        Metadata: {
            userId: userId
          },
    });
    const signedURL = await getSignedUrl(s3, putObjectCommand, {
        expiresIn: 60,
    });
    return { success: { url: signedURL } };
}