import React from 'react';
import { getSession } from 'next-auth/react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import BulletList from '@tiptap/extension-bullet-list';
import Typography from '@tiptap/extension-typography';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import { Image as TipTapImage } from '@tiptap/extension-image';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '../../lib/prisma';
import Nav from '../../components/dashboard/nav';
import styles from './post.module.scss';

function BlogPost(props: any) {
	const { post } = props;
	const editor = useEditor({
		editable: false,
		content: post.entry,
		extensions: [
			StarterKit,
			Highlight,
			Typography,
			TipTapImage,
			BulletList,
			OrderedList,
			CodeBlock,
			Blockquote,
			ListItem,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
		],
	});

	if (!editor) {
		return null;
	}
	return (
		<div className={styles.container}>
			<div>
				<h2>{post.title}</h2>
				{post.image ? (
					<img
						className={styles.img}
						src={post.image}
						alt="Featured"
						loading="lazy"
					/>
				) : (
					<Image
						src="/images/fallback.png"
						width="0"
						height="0"
						sizes="100vw"
						style={{ width: '100%', height: '100px' }}
					/>
				)}
				<p>{post.author.email}</p>
				<EditorContent editor={editor} />
			</div>
			<Nav />
			<Link href="/blog/create">Go to create blog</Link>
		</div>
	);
}

export async function getServerSideProps(context: any) {
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
