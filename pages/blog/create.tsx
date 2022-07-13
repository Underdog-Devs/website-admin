import React, { useContext, useEffect } from 'react';
import { getSession, useSession } from 'next-auth/react';
import axios from 'axios';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor } from '@tiptap/react';
import { RootContext } from '../../state/RootContext';
import TipTapEdit from '../../components/blog/tiptapEditor/tiptap-edit';
import styles from './create.module.scss';
import Nav from '../../components/dashboard/nav';
import { Input } from '../../components/input';

// TODO: Refactor create and edit post pages and endpoints and make them dynamic/reusable
function CreatePost() {
	const { data: session } = useSession();
	const { blogTitle, setBlogTitle } = useContext(RootContext);
	useEffect(() => {
		setBlogTitle('');
	}, []);
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
	});

	const postBlog = async () => {
		try {
			const res = await axios.post('/api/blog/create-entry', {
				entry: editor?.getJSON(),
				user: session?.user,
				title: blogTitle });
			console.log(res);
		} catch (error) {
			console.error(error);
		}
	};

	const saveBlog = () => {
		postBlog();
		setBlogTitle('');
		editor?.commands.clearContent();
	};

	const eraseBlog = () => {
		console.log('clicked');
		editor?.commands.clearContent();
	};
	const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBlogTitle(e.target.value);
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

export async function getServerSideProps(context: { req: any; }) {
	const session = await getSession({ req: context.req });
	// Redirect if user isn't logged in
	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: { session },
	};
}

export default CreatePost;