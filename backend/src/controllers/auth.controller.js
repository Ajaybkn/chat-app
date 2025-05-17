export const signup = (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // Hashing Password
  } catch (error) {
    console.log("error in signup", error);
  }
};
export const login = (req, res) => {
  res.send("login route");
};
export const logout = (req, res) => {
  res.send("logout route");
};
