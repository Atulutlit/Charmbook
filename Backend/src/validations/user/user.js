const Joi = require("joi");
const Base = require("../base");

class User extends Base {
  getRegisterVS() {
    const schema = {
      first_name: this.isString(true),
      last_name: this.isString(true),
      phone_no: this.isPhone(false),
      email: this.isEmail(false),
      role: this.role(true),
      password: this.isString(true),
      confirm_password: this.isString(true),
      class_id: this.isNumber(false)
    };
    return Joi.object(schema);
  }

  getOtpVS() {
    const schema = {
      email: this.isEmail(true),
      role: this.role(true)
    };
    return Joi.object(schema);
  }

  getLoginVS() {
    const schema = {
      email: this.isEmail(false),
      password: this.isString(true),
      role: this.role(true),
    };
    return Joi.object(schema);
  }

  getEmailPassVS() {
    const schema = {
      email: this.isEmail(true),
      password: this.isString(true),
    };
    return Joi.object(schema);
  }

  getOtpVerifyVS() {
    const schema = {
      email: this.isEmail(true),
      otp: this.isString(true),
    };
    return Joi.object(schema);
  }

  getPassVS() {
    const schema = {
      password: this.isString(true),
      confirm_password: this.isString(true),
    };
    return Joi.object(schema);
  }

  getIdVS() {
    const schema = {
      id: this.isObjectId(true),
    };
    return Joi.object(schema);
  }
  
  getSetPassVS() {
    const schema = {
      password: this.isString(true),
      confirm_password: this.isString(true),
    };
    return Joi.object(schema);
  }

  getForgotOtpVerifyVS(){
    const schema = {
      email: this.isEmail(true),
      otp: this.isString(true),
    };
    return Joi.object(schema);
  }

  isGender(isRequired) {
    let schema = Joi.string().trim().valid(
      "MALE", 
      "FEMALE", 
      "BOTH"
    );
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  getHomeworkVS() {
    const schema = {
      class_id: this.isNumber(true),
      subject_id: this.isNumber(true),
      description: this.isString(true),
      date: this.isDate(true),
      file_url: this.isString(true),
    };
    return Joi.object(schema);
  }
}

module.exports = User;