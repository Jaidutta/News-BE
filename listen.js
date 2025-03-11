const app = require("./app");

const PORT = 9090;

app.listen(PORT, (error)  => {
  if(error) {
    console.log(error);
    
  }
  else {
    console.log(`Server running on port ${PORT}`);
    
  }
})