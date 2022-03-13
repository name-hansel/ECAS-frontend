export const validateEmail = (email) => {
  return email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

export const validatePhoneNumber = (n) => {
  return n.match(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/);
}

export const validateDomain = (email, domain) => {
  const d = email.split("@")[1];
  return d === domain;
}