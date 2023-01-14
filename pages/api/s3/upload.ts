import { NextApiRequest, NextApiResponse } from 'next';
import S3 from 'aws-sdk/clients/s3';

const s3 = new S3({
  region: 'us-east-2',
  accessKeyId: 'AKIA527BGJO27EY5D4V6',
  secretAccessKey: '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',
  signatureVersion: 'v4',
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    let { name, type } = req.body;

    const fileParams = {
      Bucket: 'ud-blog-images',
      Key: name,
      Expires: 600,
      ContentType: type,
      ACL: 'bucket-owner-full-control',
    };

    const url = await s3.getSignedUrlPromise('putObject', fileParams);

    res.status(200).json({ url });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb', // Set desired value here
    },
  },
};
