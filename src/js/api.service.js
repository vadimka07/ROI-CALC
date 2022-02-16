import axios from 'axios';

const BASE_URL = 'http://116.203.231.157:8081';
const PATH_GET = '/api/health_check/';
const PATH_POST = '/api/roi-calc/';

axios.defaults.baseURL = BASE_URL;

export async function calculateROI( data ) {
  try {
    const response = await axios.post(PATH_POST, data);
    const responseData = response.data;
    return responseData;
  }catch ( error ) {
    console.log(error);
  }
}

//PROD
// export async function calculateROI( data ) {
//   try {
//     // data['action'] = 'get_data_from_perception_point';
//     const response = await axios.post('https://perception-point.io/roi.php', data, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//     const responseData = response.data;
//     return responseData;
//   }catch ( error ) {
//     console.log(error);
//   }
// }
