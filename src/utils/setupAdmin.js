export function setupAdminAccount() {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const adminExists = users.some((u) => u.email === "admin@site.com");

  if (!adminExists) {
    users.push({
      email: "admin@site.com",
      password: "admin123",
      isAdmin: true,
      emailVerified: true,
    });

    localStorage.setItem("users", JSON.stringify(users));
  }
}
