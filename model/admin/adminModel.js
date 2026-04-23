const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profile: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    minLength: 10,
    maxLength: 10,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});


adminSchema.methods.generatAuthtoken = async function () {
  try {
    let newtoken = jwt.sign({ _id: this._id }, "SECRET_KEY", {
      expiresIn: "31d"

    });

    this.tokens = this.tokens.concat({ token: newtoken });
    await this.save()
    return newtoken;
  
  }
  catch (error) {
    res. status (400).json({error:error})
}
}
const adminDB = new mongoose.model("admins", adminSchema);

module.exports = adminDB;
