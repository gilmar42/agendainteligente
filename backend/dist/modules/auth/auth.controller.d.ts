import { AuthService, RegisterDto } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            workspaceId: string;
            role: string;
        };
    }>;
    login(loginDto: Record<string, unknown>): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            workspaceId: string;
            role: string;
        };
    }>;
}
