localStorage.setItem("token", res.data.token);
localStorage.setItem("role", res.data.role);

// localStorage.setItem("token", jwtToken);
// localStorage.setItem("role", "admin");

// // Initialize default admin if not existing
// export function initializeDefaults() {
//   let users = JSON.parse(localStorage.getItem("users"));

//   if (!users) {
//     users = [
//       {
//         email: "admin@site.com",
//         password: "admin123",
//         role: "admin",
//       },
//     ];

//     localStorage.setItem("users", JSON.stringify(users));
//   }
// }

// // Register new user
// export function registerUser(email, password) {
//   const users = JSON.parse(localStorage.getItem("users")) || [];

//   const exists = users.some((u) => u.email === email);
//   if (exists) return { success: false, message: "User already exists" };

//   users.push({ email, password, role: "user" });
//   localStorage.setItem("users", JSON.stringify(users));

//   return { success: true };
// }

// // LOGIN CHECK
// export function loginUser(email, password) {
//   const users = JSON.parse(localStorage.getItem("users")) || [];

//   const found = users.find((u) => u.email === email && u.password === password);

//   if (!found) return { success: false };

//   localStorage.setItem("loggedInUser", JSON.stringify(found));
//   return { success: true, user: found };
// }

// // GET LOGGED USER
// export function getLoggedInUser() {
//   return JSON.parse(localStorage.getItem("loggedInUser"));
// }

// // LOGOUT
// export function logoutUser() {
//   localStorage.removeItem("loggedInUser");
// }
