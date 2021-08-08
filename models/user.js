const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true
  },
  defaultName: {
    type: String,
    default: ""
  },
  avatar: {
    type: String,
    default: ""
  },
  uiColor: {
    type: String,
    default: "green"
  },
},{
createdAt:'createdAt',
updatedAt:'updatedAt'
});

userSchema.index({email:1, createdAt:1, updatedAt:1});

const User = mongoose.model("user",userSchema)
module.exports = User;
module.exports.hashPassword = async (password)=>{
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("hash failed", error.message);
  }
}
module.exports.comparePasswords = async (inputPassword, hashedPassword)=>{
  try { 
    return await bcrypt.compare(inputPassword, hashedPassword);
  } catch (error) {
    throw new Error("hash failed", error.message);
  }
}