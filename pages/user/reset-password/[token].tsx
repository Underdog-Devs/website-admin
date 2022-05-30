import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import PasswordReset from '../../../components/auth/password-reset';

export type User = {
	id: string;
	name?: string;
	email: string;
	image?: string;
	userType: string;
	password: string;
	token?: string;
	createdAt: string;
	updatedAt: string;
}

type Props = {
	token: string;
	user: User;
}

const resetPassword = (props: Props) => {
	const { token, user } = props;
	return (
		<div className="container">
			{user
				&& <PasswordReset token={token} email={user.email} />}
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const token = context.params?.token as string;
	const prisma = new PrismaClient();
	const user = await prisma.user.findUnique({
		where: {
			token,
		},
		select: {
			email: true,
		},
	});
	const processedUser = JSON.parse(JSON.stringify(user));
	return {
		props: {
			token,
			user: processedUser,
		},
	};
};

export default resetPassword;
