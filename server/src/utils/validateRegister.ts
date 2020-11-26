import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (!options.email.includes("@")) {
    return {
      errors: [
        {
          field: "email",
          message: "Invalid Email",
        },
      ],
    };
  }

  if (options.username.length <= 2) {
    return {
      errors: [
        {
          field: "username",
          message: "Username must be longer than 2 characters",
        },
      ],
    };
  }

  if (options.username.includes("@")) {
    return {
      errors: [
        {
          field: "username",
          message: "Username cannot include @",
        },
      ],
    };
  }

  if (options.password.length <= 4) {
    return {
      errors: [
        {
          field: "password",
          message: "Password must be longer than 4 characters",
        },
      ],
    };
  }

  return null;
};
