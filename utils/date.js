/**
 * Formats a dayjs date object to Vietnamese format with day name
 * @param {dayjs.Dayjs} date - The dayjs date object to format
 * @returns {string} Formatted date string like "25/12/2023 (Thứ 2)"
 */
function formatDateWithVietnameseDay(date) {
    const dayName = date.day() === 0 ? 'Chủ Nhật' : `Thứ ${date.day() + 1}`;
    return `${date.format('DD/MM/YYYY')} (${dayName})`;
}

/**
 * Formats a dayjs date object to Vietnamese format with month name
 * @param {dayjs.Dayjs} date - The dayjs date object to format
 * @returns {string} Formatted date string like "25 tháng 12, 2023"
 */
function formatWithVietnameseMonth(date) {
    const vietnameseMonths = [
        'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
        'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'
    ];
    
    const month = vietnameseMonths[date.month()];
    const year = date.format('YYYY');
    
    return `${month}/${year}`;
}

module.exports = {
    formatDateWithVietnameseDay,
    formatWithVietnameseMonth
};