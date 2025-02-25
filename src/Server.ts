import app from './App';

import connectMongo from './config/mongo';

(async () => {
  try {
    await connectMongo();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();