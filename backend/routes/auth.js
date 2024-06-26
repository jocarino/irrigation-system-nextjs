var express = require("express");
const router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local");
var crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* Configure password authentication strategy.
 *
 * The `LocalStrategy` authenticates users by verifying a username and password.
 * The strategy parses the username and password from the request and calls the
 * `verify` function.
 *
 * The `verify` function queries the database for the user record and verifies
 * the password by hashing the password supplied by the user and comparing it to
 * the hashed password stored in the database.  If the comparison succeeds, the
 * user is authenticated; otherwise, not.
 */
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function verify(email, password, cb) {
      try {
        const user = await prisma.user.findFirst({
          where: { email: email },
        });
        if (!user) {
          return cb(null, false, {
            message: "Incorrect username or password.",
          });
        }
        // Convert the stored salt from base64 string to Buffer
        const salt = Buffer.from(user.salt, "base64");
        crypto.pbkdf2(
          password,
          salt,
          310000,
          32,
          "sha256",
          function (err, hashedPassword) {
            if (err) {
              return cb(err);
            }
            // Convert the stored hashedPassword from base64 string to Buffer
            const storedHashedPassword = Buffer.from(
              user.hashedPassword,
              "base64"
            );
            if (!crypto.timingSafeEqual(storedHashedPassword, hashedPassword)) {
              return cb(null, false, {
                message: "Incorrect username or password.",
              });
            }
            return cb(null, user);
          }
        );
      } catch (err) {
        return cb(err);
      }
    }
  )
);

/* Configure session management.
 *
 * When a login session is established, information about the user will be
 * stored in the session.  This information is supplied by the `serializeUser`
 * function, which is yielding the user ID and username.
 *
 * As the user interacts with the app, subsequent requests will be authenticated
 * by verifying the session.  The same user information that was serialized at
 * session establishment will be restored when the session is authenticated by
 * the `deserializeUser` function.
 *
 * Since every request to the app needs the user ID and username, in order to
 * fetch todo records and render the user element in the navigation bar, that
 * information is stored in the session.
 */
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, email: user.email });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

/** POST /login/password
 *
 * This route authenticates the user by verifying a email and password.
 *
 * A email and password are submitted to this route via an HTML form, which
 * was rendered by the `GET /login` route.  The email and password is
 * authenticated using the `local` strategy.  The strategy will parse the
 * email and password from the request and call the `verify` function.
 *
 * Upon successful authentication, a login session will be established.  As the
 * user interacts with the app, by clicking links and submitting forms, the
 * subsequent requests will be authenticated by verifying the session.
 *
 * When authentication fails, the user will be re-prompted to login and shown
 * a message informing them of what went wrong.
 *
 * @openapi
 * /login/password:
 *   post:
 *     summary: Log in using a email and password
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: number
 *     responses:
 *       "302":
 *         description: Redirect.
 */
router.post("/login/password", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info.message || "Authentication failed" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.header("Access-Control-Allow-Credentials", "true");
      return res.status(200).json({
        message: "Login successful",
        session: req.session,
      });
    });
  })(req, res, next);
});

/* POST /logout
 *
 * This route logs the user out.
 */
router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.header("Access-Control-Allow-Credentials", "true");
    return res.status(200).json({
      message: "Logout successful",
    });
  });
});

/* POST /signup
 *
 * This route creates a new user account.
 *
 * A desired username and password are submitted to this route via an HTML form,
 * which was rendered by the `GET /signup` route.  The password is hashed and
 * then a new user record is inserted into the database.  If the record is
 * successfully created, the user is logged in.
 */
router.post("/signup", function (req, res, next) {
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    32,
    "sha256",
    async function (err, hashedPassword) {
      if (err) {
        return next(err);
      }
      try {
        // TODO check that the user doesn't exist already
        const user = await prisma.user.create({
          data: {
            email: req.body.email,
            hashedPassword: hashedPassword.toString("base64"),
            salt: salt.toString("base64"),
          },
        });
        res.status(200);
      } catch (error) {
        res.status(500);
      }
    }
  );
});

/* GET /check-auth
 *
 * This route checks if the user is authenticated.
 *
 * If the user is authenticated, the user's ID and username are returned.
 * Otherwise, an error is returned.
 */
router.get("/check-auth", function (req, res, next) {
  console.log("Session during check:", req.session);
  if (req.session.passport.user) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

module.exports = router;
