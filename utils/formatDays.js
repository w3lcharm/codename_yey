module.exports = function formatDays(days, lang) {
  const value = days < 365 && days > 30 ? Math.floor(days / 30) : days <= 30 ? days : Math.floor(days / 365);
  const unit = days < 365 && days > 30 ? "month" : days <= 30 ? "day" : "year";
  return new Intl.RelativeTimeFormat(lang).format(-value, unit);
}