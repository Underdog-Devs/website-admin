import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface Session {
		id: string;
		userType: string;
		accessToken?: string;
		email: string;
	}

	interface User {
		id: string;
		userType: string;
		accessToken?: string;
		email: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		userType: string;
		accessToken?: string;
		email: string;
	}
}
