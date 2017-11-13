import axios from 'axios';

export default (url, outputPath) => {

  const directory = outputPath ? outputPath : __dirname;
  console.log("URL given: ", url);
  console.log("Directory to save page: ", directory);


  axios.get(url)
    .then((response) => {
      console.log('PAGE RECEIVED: ', response.data);
    })
    .catch((error) => {
      console.log('Error: ', error);
    })


};
