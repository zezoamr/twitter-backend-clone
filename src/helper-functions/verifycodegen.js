
function generateVerificationCode(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; ++i) {
        const at = Math.floor(Math.random() * (charset.length + 1));
        code += charset.charAt(at);
    }
    return code;
}

module.exports = generateVerificationCode