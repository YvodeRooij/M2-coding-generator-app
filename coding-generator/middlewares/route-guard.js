const isLoggedIn = (req, res, next) => {
  console.log(req);
  if (req.session.userFromDatabase) {
    next();
    return;
  }
  res.redirect("/my-overview");
};

const isLoggedOut = (req, res, next) => {
  console.log(req);
  if (!req.session.userFromDatabase) {
    next();
    return;
  }
  res.redirect("/auth/login");
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
