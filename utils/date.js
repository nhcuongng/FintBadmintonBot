/**
 * Formats a dayjs date object to Vietnamese format with day name
 * @param {dayjs.Dayjs} date - The dayjs date object to format
 * @returns {string} Formatted date string like "25/12/2023 (Thứ 2)"
 */
function formatDateWithVietnameseDay(date) {
    const dayName = date.day() === 0 ? 'Chủ Nhật' : `Thứ ${date.day() + 1}`;
    return `${date.format('DD/MM/YYYY')} (${dayName})`;
}

module.exports = {
    formatDateWithVietnameseDay
};