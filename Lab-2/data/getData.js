const Data = require('./data');

getById = ((id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // find project

                 let userData;
            
                for (let i = 0; i < Data.length; i++) {
                    if (Data[i].id == id) {
                      userData = Data[i];
                    }
                }

        if (userData) {
            resolve(userData);
        } else {
            reject(new Error("Please enter a proper ID"));
        }}, 5000);
      });
})

module.exports ={
  getById
}