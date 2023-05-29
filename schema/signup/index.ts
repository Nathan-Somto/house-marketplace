import {object, string, InferType, ref} from 'yup';
let signupSchema =object({
    firstName:string().required().min(2).max(255),
    email:string().email().required(),
    password:string().required().min(3,'Password must be at least 3 chars long.'),
    confirmPassword:string().required().oneOf([ref('password')],'Passwords must match') 
});
type signupType = InferType<typeof signupSchema>
export type {signupType};
export  default signupSchema;