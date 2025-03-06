import axios from 'axios';

const endpoint = '/api/uploads/files';

const getPreSignedUrl = async (fileKey: string) => {
  const options = {
    params: {
      key: fileKey,
    },
  };

  const response = await axios.post(endpoint, {}, options);
  return response.data;
};
export default getPreSignedUrl;
