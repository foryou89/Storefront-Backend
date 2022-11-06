import bcrypt from 'bcrypt';
import config from '../config';

//- check if password is this hashed password
const passwordCompare = (password: string, hash_password: string): boolean => {
  return bcrypt.compareSync(password + config.bc_pass, hash_password);
};

export default passwordCompare;
