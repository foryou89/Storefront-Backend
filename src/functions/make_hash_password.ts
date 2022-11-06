import bcrypt from 'bcrypt';
import config from '../config';

//- make hash password using bcrypt
const makeHashPassword = (password: string): string => {
  return bcrypt.hashSync(
    `${password}${config.bc_pass}`,
    parseInt(config.bc_sr as string)
  );
};

export default makeHashPassword;
