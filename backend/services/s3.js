exports.uploadToS3 = async (data, filename, contentType = "application/json") => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
    ContentType: contentType,
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};
