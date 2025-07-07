import AWS from "aws-sdk";

export const uploadToS3 = async (file: File) => {
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

    // unique file key
    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    // Progress bar
    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {})
      .promise();

    await upload.then((data) => {});

    return Promise.resolve({
      file_key,
      file_name: file.name,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getS3Url = (file_key: string) => {
  return `https://${process.env
    .NEXT_PUBLIC_S3_BUCKET_NAME!}.s3.us-east-2.amazonaws.com/${file_key}`;
};
