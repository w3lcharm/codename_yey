module.exports = class PermissionError extends Error {
  constructor(message, missingPermission) {
    super(message);
    this.missingPermission = missingPermission;
    this.name = this.constructor.name;
  }
};
