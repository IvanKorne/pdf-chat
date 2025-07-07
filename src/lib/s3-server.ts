import AWS from "aws-sdk";
import fs from "fs";

export const downloadFromS3 = async (fileKey: string) => {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      },
      region: "us-east-2",
    });
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: fileKey,
    };
    const obj = await s3.getObject(params).promise();
    const file_name = `/tmp/pdf-${Date.now()}.pdf`;
    fs.writeFileSync(file_name, new Uint8Array(obj.Body as Buffer));
    return file_name;
  } catch (err) {
    console.log(err);
  }
};
