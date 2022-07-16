import React, { useContext } from 'react';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import styles from './index.module.scss';
import Nav from '../../components/dashboard/nav';
import { RootContext } from '../../state/RootContext';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Link from 'next/link';


function BlogPost(props: any) {
	const { post } = props;
	// const { blogData, setBlogData } = useContext(RootContext);


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
		content: '',
	});
	console.log(post)
	editor?.commands.setContent(post.entry);
	return (
		<div className={styles.container}>

			<div>
				<h2>Title: {post.title}</h2>
				<p>{post.author.email}</p>
				{editor
					&& <><span>Content:</span><EditorContent editor={editor} /></>}			</div>
			<Nav />
			<Link href="/blog/create">Go to create blog</Link>
		</div>
	);
}



export async function getServerSideProps(context: { req: any; }) {
	const session = await getSession({ req: context.req });
	const { params } = context;
	// Redirect if user isn't logged in
	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const prisma = new PrismaClient();
	// Fetch all posted jobs and include related items from Company table
	const post = await prisma.blog.findUnique({
		where: {
			id: params.id,
		},
		include: {
			author: {
				select: {
					email: true,
				},
			},
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
export default BlogPost;