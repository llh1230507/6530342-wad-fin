import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  DateofBirth: { type: Date, required: true },
  name: { type: String, required: true },
  MemberNumber: { type: Number, required: false },
  Interests: { type: String, required: true },
  
});

const Customer = mongoose.models.customer || mongoose.model("customer", customerSchema);

export default Customer;
