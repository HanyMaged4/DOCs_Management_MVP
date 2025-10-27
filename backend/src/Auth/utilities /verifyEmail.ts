import {sanitizeInput} from './helper';

export const verifyEmailTemplate = (verificationLink: string)=> {
    const sanitizedLink = sanitizeInput(verificationLink);
    return 
    `<html>
    <body>
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${sanitizedLink}">${sanitizedLink}</a>
    </body>
    </html>`;
};
