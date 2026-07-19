import { environment } from "../../../environments/environment";

export class ApiUrlConstants {
    baseUrl: string = environment.apiUrl;
    public USERS = `${this.baseUrl}/Users/signup`;
}