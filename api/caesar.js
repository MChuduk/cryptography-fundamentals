module.exports = async ({ message, key }) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const result = [];
  for (let i = 0; i < message.length; i++) {
    const char = message[i];
    const charCode = alphabet.indexOf(char);
    if (charCode < 0) {
      result.push(char);
      continue;
    }
    const encryptedCharCode = (charCode + key) % alphabet.length;
    const encryptedChar = alphabet[encryptedCharCode];
    result.push(encryptedChar);
  }
  return result.join('');
};
