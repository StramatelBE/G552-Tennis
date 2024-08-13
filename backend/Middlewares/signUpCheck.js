const db = require("../Database/db.js");

const checkDuplicateUsername = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT(*) as count FROM users WHERE username = ?`,
      [req],
      (err, row) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        const count = row.count;
        const isDuplicate = count > 0;

        if (isDuplicate) {
          resolve(isDuplicate);
          return;
        }

        resolve(isDuplicate);
      }
    );
  });
};
const checkPasswordRequirements = async (req) => {
  return new Promise((resolve, reject) => {
    if (req.length < 8) {
      resolve({
        message:
          "Échec ! Le mot de passe doit comporter au moins 8 caractères !",
        result: false,
      });
      return;
    }
    if (!/[a-zA-Z]/.test(req)) {
      resolve({
        message: "Échec ! Le mot de passe doit contenir au moins une lettre !",
        result: false,
      });
      return;
    }
    if (!/[0-9]/.test(req)) {
      resolve({
        message: "Échec ! Le mot de passe doit contenir au moins un chiffre !",
        result: false,
      });
      return;
    }
    resolve({
      message: "Les exigences du mot de passe sont satisfaites",
      result: true,
    });
  });
};

const verifyRoles = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    if (req !== "root" && req !== "admin" && req !== "user") {
      reject({
        message: "Échec ! Le rôle doit être soit 'root', 'admin' ou 'user' !",
        result: false,
      });
      return;
    }
    resolve();
  });
};

const signUpCheck = {
  checkDuplicateUsername,
  checkPasswordRequirements,
  verifyRoles,
};

module.exports = signUpCheck;
