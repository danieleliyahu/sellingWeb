export const prices = [
  {
    name: "Any",
    min: 0,
    max: 0,
  },
  {
    name: "$1 to $10",
    min: 1,
    max: 10,
  },
  {
    name: "$10 to $100",
    min: 10,
    max: 100,
  },
  {
    name: "$100 to $1000",
    min: 100,
    max: 1000,
  },
];

export const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },
  {
    name: "3stars & up",
    rating: 3,
  },
  {
    name: "2stars & up",
    rating: 2,
  },
  {
    name: "1stars & up",
    rating: 1,
  },
  {
    name: "0stars & up",
    rating: 0,
  },
];
export const passwordValidate = (password) => {
  let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  let Validate = re.test(String(password));
  if (password.length < 8 || !Validate) {
    return false;
  } else {
    return true;
  }
};

export const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
