// import { useTranslation } from "react-i18next";

import { parsePhoneNumberFromString } from "libphonenumber-js";

export const phoneNumberValidation = (userData) => {
  let errors = {};
  let isValid = true;
  const phoneNumber = parsePhoneNumberFromString(`+${userData?.phone}`)
  if (userData?.phone_no !== undefined) {
    if (phoneNumber !== undefined && !phoneNumber) {
      errors.phone_no = "required";
      isValid = false;
    } else if (!phoneNumber?.isValid()) {
      errors.phone_no = "phone_number_is_not_valid";
      isValid = false;
    } else if (userData?.phone_no) {
      errors.phone_no = "";
    }
  }

  return { errors, isValid };
};

export const LoginFormValidation = (userData) => {
  let errors = {};
  let isValid = true;

  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/i;
  var PasswordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.{8,16})"
  );
  if (userData?.email !== undefined && !userData?.email) {
    errors.email = "required";
    isValid = false;
  } else if (
    userData?.email !== undefined &&
    !emailregex.test(userData?.email)
  ) {
    errors.email = "please_enter_valid_email";
    isValid = false;
  } else if (userData?.email) {
    errors.email = "";
  }

  if (userData.password !== undefined && !userData.password) {
    errors.password = "required";
    isValid = false;
  } else if (userData.password) {
    errors.password = "";
  }

  return { errors, isValid };
};

export const forgotValidation = (userData, t) => {
  let errors = {};
  let isValid = true;

  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/i;

  if (userData?.email !== undefined && !userData?.email) {
    errors.email = t("required");
    isValid = false;
  } else if (
    userData?.email !== undefined &&
    !emailregex.test(userData?.email)
  ) {
    errors.email = t("please_enter_valid_email");
    isValid = false;
  } else if (userData?.email) {
    errors.email = "";
  }

  return { errors, isValid };
};

export const SignUpFormValidation = (userData) => {
  let errors = {};
  let isValid = true;
  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/i;
  let capitalRegex = /^[a-zA-Z\s]*$/;
  var PasswordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-]).{8,16}$"
  );
  const phoneNumber = parsePhoneNumberFromString(`+${userData?.phone_no}`)

  if (userData.name !== undefined && !userData.name) {
    errors.name = "required";
    isValid = false;
  } else if (userData?.name) {
    errors.name = "";
  }

  if (userData.user_name !== undefined && !userData.user_name) {
    errors.user_name = "required";
    isValid = false;
  } else if (userData?.user_name) {
    errors.user_name = "";
  }

  if (userData?.email !== undefined && !userData?.email) {
    errors.email = "required";
    isValid = false;
  } else if (
    userData?.email !== undefined &&
    !emailregex.test(userData?.email)
  ) {
    errors.email = "please_enter_valid_email";
    isValid = false;
  } else if (userData?.email) {
    errors.email = "";
  }

  if (userData?.phone_no !== undefined) {
    if (phoneNumber !== undefined && !phoneNumber) {
      errors.phone_no = "Phone number is required.";
      isValid = false;
    } else if (!phoneNumber || !phoneNumber?.isValid()) {
      errors.phone_no = "This is not a valid phone_no number"
      isValid = false;
    } else if (userData?.phone_no) {
      errors.phone_no = "";
    }
  }

  if (userData.dob !== undefined && !userData.dob) {
    errors.dob = "required";
    isValid = false;
  } else if (userData?.dob) {
    errors.dob = "";
  }

  if (userData.gender !== undefined && !userData.gender) {
    errors.gender = "required";
    isValid = false;
  } else if (userData?.gender) {
    errors.gender = "";
  }

  if (userData.password !== undefined && !userData.password) {
    errors.password = "required";
    isValid = false;
  } else if (
    userData.password !== undefined &&
    !PasswordRegex.test(userData.password)
  ) {
    errors.password = "pmbetsclamcaloscauclcl";
    isValid = false;
  } else if (userData.password) {
    errors.password = "";
  }

  if (userData.confirm_password !== undefined && !userData.confirm_password) {
    errors.confirm_password = "required";
    isValid = false;
  } else if (
    userData.confirm_password !== undefined &&
    userData.confirm_password !== userData.password
  ) {
    errors.confirm_password = "passwords_do_not_match";
    isValid = false;
  } else if (userData.confirm_password) {
    errors.confirm_password = "";
  }

  return { errors, isValid };
};


export const MatchPasswordValidation = (userData) => {
  let errors = {};
  let isValid = true;
  var PasswordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.{8,16})"
  );

  if (userData.password !== undefined && !userData.password) {
    errors.password = "required";
    isValid = false;
  } else if (
    userData.password !== undefined &&
    !PasswordRegex.test(userData.password)
  ) {
    errors.password = "pmbetsclamcaloscauclcl";
    isValid = false;
  } else if (userData.password) {
    errors.password = "";
  }

  return { errors, isValid };
};


export const ChangePasswordValidation = (userData, t) => {
  let errors = {};
  let isValid = true;
  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/i;
  let capitalRegex = /^[a-zA-Z\s]*$/;
  var PasswordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-]).{8,16}$"
  );
  if (userData.new_password !== undefined && !userData.new_password) {
    errors.new_password = t("required");
    isValid = false;
  } else if (
    userData.new_password !== undefined &&
    !PasswordRegex.test(userData.new_password)
  ) {
    errors.new_password = t("pmbetsclamcaloscauclcl");
    isValid = false;
  } else if (userData.new_password) {
    errors.new_password = "";
  }

  if (userData.confirm_password !== undefined && !userData.confirm_password) {
    errors.confirm_password = t("required");
    isValid = false;
  } else if (
    userData.confirm_password !== undefined &&
    userData.confirm_password !== userData.new_password
  ) {
    errors.confirm_password = t("passwords_do_not_match");
    isValid = false;
  } else if (userData.confirm_password) {
    errors.confirm_password = "";
  }

  return { errors, isValid };
};


export const ProfileValidation = (userData, t) => {
  let errors = {};
  let isValid = true;
  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/i;
  let capitalRegex = /^[a-zA-Z\s]*$/;

  if (userData.profile_pic !== undefined && !userData.profile_pic) {
    errors.profile_pic = t("profile_is_required");
    isValid = false;
  } else if (userData?.profile_pic) {
    errors.profile_pic = "";
  }

  if (userData.full_name !== undefined && !userData.full_name) {
    errors.full_name = t("required");
    isValid = false;
  } else if (
    userData.full_name !== undefined &&
    !capitalRegex.test(userData?.full_name)
  ) {
    errors.full_name = t("full_name_cannot_contain_numbers");
    isValid = false;
  } else if (userData?.full_name) {
    errors.full_name = "";
  }

  return { errors, isValid };
};


export const ResandPasswordValidation = (userData, t) => {
  let errors = {};
  let isValid = true;

  var PasswordRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.{8,16})"
  );

  if (userData.password !== undefined && !userData.password) {
    errors.password = t("please_enter_valid_email");
    isValid = false;
  } else if (
    userData.password !== undefined &&
    !PasswordRegex.test(userData.password)
  ) {
    errors.password = t("pmbetsclamcaloscauclcl");
    isValid = false;
  } else if (userData.password) {
    errors.password = "";
  }

  if (userData.confirm_password !== undefined && !userData.confirm_password) {
    errors.confirm_password = t("please_confirm_password");
    isValid = false;
  } else if (userData.confirm_password !== userData.password) {
    errors.confirm_password = t("passwords_do_not_match");
    isValid = false;
  } else {
    errors.confirm_password = "";
  }

  return { errors, isValid };
};


export const HelpFormValidation = (formData, t) => {
  let errors = {};
  let isValid = true;
  const phoneNumber = parsePhoneNumberFromString(
    `+${formData?.phone}`
  );

  if (formData.name !== undefined && !formData.name.trim()) {
    errors.name = t("required");
    isValid = false;
  } else if (formData.name) {
    errors.name = "";
  }

  if (formData.email !== undefined && !formData.email.trim()) {
    errors.email = t("required");
    isValid = false;
  } else if (
    formData.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
  ) {
    errors.email = t("please_enter_valid_email");
    isValid = false;
  } else if (formData.email) {
    errors.email = "";
  }

  if (formData.message !== undefined && !formData.message.trim()) {
    errors.message = t("required");
    isValid = false;
  } else if (formData.message) {
    errors.message = "";
  }

  return { errors, isValid };
};


export const groupCreateValidation = (userData) => {
  let errors = {};
  let isValid = true;

  if (userData.groupName !== undefined && !userData.groupName) {
    errors.groupName = "required";
    isValid = false;
  } else if (userData?.groupName) {
    errors.groupName = "";
  }

  if (userData.invites !== undefined && userData?.invites?.length === 0) {
    errors.invites = "required";
    isValid = false;
  } else if (userData?.invites?.length >= 0) {
    errors.invites = "";
  }


  return { errors, isValid };

}