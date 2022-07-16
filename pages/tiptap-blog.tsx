import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import axios from 'axios';
import { RootContext } from '../state/RootContext';

function TipTapBlog() {
	const { blogData, setBlogData } = useContext(RootContext);

	const getBlog = async () => {
		try {
			const res = await axios.get('api/blog/get-entry');
			console.log({ res });
			setBlogData(res.data.entry);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		getBlog();
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
		content: '',
	});

	editor?.commands.setContent(blogData);

	return (
		<div>
			{editor
				&& <EditorContent editor={editor} />}
			<Link href="/tiptap-edit">Go to edit blog</Link>
		</div>
	);
}
export default TipTapBlog;
