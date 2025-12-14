// src/pages/admin/helpers.js

// src/admin/helpers.js
export const STORAGE_KEYS = {
  USERS: "users",
  ADMIN_LOGS: "adminLogs",
  ADMIN_NOTIFICATIONS: "adminNotifications",
  ADMIN_CREDENTIALS: "adminCredentials",
};

// -------- USERS ----------
export const getUsers = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]");

export const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  window.dispatchEvent(new Event("usersUpdated")); // triggers AdminUsers update
};

// -------- LOGS & NOTIFICATIONS ----------
export const addAdminLog = (action) => {
  const logs = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.ADMIN_LOGS) || "[]"
  );
  const fakeIP = "192.168.1." + Math.floor(Math.random() * 255);
  logs.push({
    id: Date.now(),
    action,
    time: new Date().toLocaleString(),
    ip: fakeIP,
  });
  localStorage.setItem(STORAGE_KEYS.ADMIN_LOGS, JSON.stringify(logs));
  window.dispatchEvent(new Event("logsUpdated"));
};

export const addAdminNotification = (msg) => {
  const notifications = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS) || "[]"
  );
  notifications.push({
    id: Date.now(),
    msg,
    time: new Date().toLocaleString(),
  });
  localStorage.setItem(
    STORAGE_KEYS.ADMIN_NOTIFICATIONS,
    JSON.stringify(notifications)
  );
  window.dispatchEvent(new Event("notificationsUpdated"));
};

// -------- ADMIN CREDENTIALS ----------
export const initAdmin = () => {
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_CREDENTIALS)) {
    localStorage.setItem(
      STORAGE_KEYS.ADMIN_CREDENTIALS,
      JSON.stringify({ email: "admin@site.com", password: "admin123" })
    );
  }
};
