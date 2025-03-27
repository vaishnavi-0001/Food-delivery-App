const { checkSchema } = require("express-validator");

// import { body } from "express-validator";

// export default [body("email").notEmpty().withMessage("email is required")];
export default checkSchema({
    email: {
      errorMessage: "Email required",
      notEmpty: true,
      trim: true,
    },
    
  });
