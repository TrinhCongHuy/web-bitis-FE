const FormatNumber = (num) => {
    return num.toLocaleString('vi-VN', {
        maximumFractionDigits: 0
    });
}

export default FormatNumber