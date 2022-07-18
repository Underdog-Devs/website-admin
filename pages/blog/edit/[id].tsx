import React from 'react';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor } from '@tiptap/react';
import TipTapEdit from '../../../components/blog/tiptapEditor/tiptap-edit';
import styles from './edit.module.scss';
import Nav from '../../../components/dashboard/nav';

function EditPost(props: any) {
	const { post } = props;
	console.log('single:', post);

	const editor = useEditor({
		extensions: [
			StarterKit,
			Highlight,
			Typography,
			Image,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
		],
		content: post?.entry,
	});

	return (
		<div className={styles.container}>
			<TipTapEdit editor={editor} />
			<div>
				<Nav />
			</div>
		</div>
	);
}

// TODO: Figure out context type for params
export async function getServerSideProps(context: any) {
	const session = await getSession({ req: context.req });
	const { params } = context;
	const prisma = new PrismaClient();
	// Redirect if user isn't logged in
	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
	const post = await prisma.blog.findUnique({
		where: {
			id: params.id,
		},
	});

	return {
		props: {
			post: {
				...post,
				date: post?.date.toISOString(),
			},
		},
	};
}

export default EditPost;
