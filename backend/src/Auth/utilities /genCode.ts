
export const generateRandomNum = (length: number = 6): string => {
  const digits = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) 
    result += digits.charAt(Math.floor(Math.random() * digits.length));

  return result;    
}