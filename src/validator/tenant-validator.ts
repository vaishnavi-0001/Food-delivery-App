import { checkSchema } from 'express-validator/src/middlewares/schema';



export default checkSchema({
    name: {
        trim: true,
        errorMessage: "Tenant name is required!",
        notEmpty: true,
    },
    address: {
        trim: true,
        errorMessage: "Tenant address is required!",
        notEmpty: true,
    },
});