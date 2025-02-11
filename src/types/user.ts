export interface User {
    id_user?: number;
    name_User: string;
    email_User: string;
    password_User: string;
    image?: Blob | null;
    registration_date?: Date;
}