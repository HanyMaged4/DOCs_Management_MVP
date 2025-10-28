import {sanitizeInput} from './helper';

export const resetPasswordTemplate = (resetLink: string) => {
    const sanitizedLink = sanitizeInput(resetLink);
    return `
    <html>
    <body>
        <h1>Password Reset</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${sanitizedLink}">${sanitizedLink}</a>
    </body>
    </html>`;
};
