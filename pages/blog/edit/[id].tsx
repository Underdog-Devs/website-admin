import React, { useContext, useEffect } from 'react';
import { getSession, useSession } from 'next-auth/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor } from '@tiptap/react';
import axios from 'axios';
import TipTapEdit from '../../../components/blog/tiptapEditor/tiptap-edit';
import styles from './edit.module.scss';
import Nav from '../../../components/dashboard/nav';
import { Input } from '../../../components/input';
import { RootContext } from '../../../state/RootContext';
import { prisma } from '../../../lib/prisma';

function EditPost(props: any) {
	const { post } = props;
	useEffect(() => {
		setBlogTitle(post.title);
	}, []);

	const { data: session } = useSession();

	const { blogTitle, setBlogTitle } = useContext(RootContext);

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

	const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBlogTitle(e.target.value);
	};

	const editBlog = async () => {
		console.log('editing');
		try {
			const res = await axios.post('/api/blog/edit-entry', {
				entry: editor?.getJSON(),
				user: session?.user,
				title: blogTitle,
				id: post.id });
			console.log(res);
		} catch (error) {
			console.error(error);
		}
	};

	const saveBlog = () => {
		editBlog();
		setBlogTitle('');
		editor?.commands.clearContent();
	};

	const eraseBlog = () => {
		editor?.commands.clearContent();
	};
	return (
		<div className={styles.container}>
			<div>
				<Input labelFor="title" labelText="Title">
					<input
						id="title"
						type="text"
						onChange={onTitleChange}
						value={blogTitle}
					/>
				</Input>
				<TipTapEdit editor={editor} />
			</div>
			<div>
				<Nav />
			</div>
			<div>
				<button onClick={saveBlog}>Save</button>
				<button onClick={eraseBlog}>Clear</button>
			</div>
		</div>
	);
}

// TODO: Figure out context type for params
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
