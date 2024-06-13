require("dotenv").config();
const app = require("./server");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server Is Listening On Port : http://localhost:${PORT}`);
});
