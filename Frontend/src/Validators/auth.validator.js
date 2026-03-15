import isEmail from "validator/lib/isEmail";

export function validateUserLogin(user) {
  const errors = {};

  if (!user) {
    errors.form = "Email and password are required";
    return errors;
  }

  // Email
  if (!user.email) {
    errors.email = "Please enter a valid email address";
  } else if (
    !isEmail(user.email, {
      allow_utf8_local_part: false,
      require_tld: true,
    })
  ) {
    errors.email = "Please enter a valid email address";
  }

  // Password
  if (!user.password || user.password?.trim() === "") {
    errors.password = "Password is required";
  } else if (user.password?.length < 8) {
    errors.password = "Password should be at least 8 characters";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(user.password)
  ) {
    errors.password =
      "Password must include uppercase, lowercase, number, and special character";
  }

  return errors;
}

export function validateUserRegister(user) {
  const errors = {};

  if (!user) {
    errors.form = "All fields are required";
    return errors;
  }

  // Name
  if (!user.username || user.username.trim() === "") {
    errors.username = "Name is required";
  } else if (user.username?.length < 3) {
    errors.username = "Name must be at least 3 characters";
  }

  // Email
  if (!user.email) {
    errors.email = "Please enter a valid email address";
  } else if (
    !isEmail(user.email, {
      allow_utf8_local_part: false,
      require_tld: true,
    })
  ) {
    errors.email = "Please enter a valid email address";
  }

  // Password
  if (!user.password) {
    errors.password = "Password is required";
  } else if (user.password?.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(user.password)) {
    errors.password =
      "Password must include uppercase, lowercase, number, and special character";
  }

  // Confirm password
  if (!user.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (user.confirmPassword !== user.password) {
    errors.confirmPassword = "Passwords must match";
  }

  return errors;
}
