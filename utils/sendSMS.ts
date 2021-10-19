export const sendSMS = (text: string, apiKey: string) => `https://sms.ru/sms/send?api_id=${apiKey}&to=79157041508&msg=${text}`;
