const mongoose = require('mongoose');

const uri = "mongodb+srv://adamjee_admin:adamjee_admin_gmail.com.confirmed@adamjeeadmin.bifxyk0.mongodb.net/adamjee-db?retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
    const products = mongoose.connection.collection('products');
    const count = await products.countDocuments();
    console.log(`Products in DB: ${count}`);
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await mongoose.disconnect();
  }
}
run();
