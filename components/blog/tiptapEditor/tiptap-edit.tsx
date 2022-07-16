import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useContext, useState } from 'react';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { AiOutlineBold, AiOutlineItalic, AiOutlineStrikethrough, AiOutlineOrderedList, AiOutlineAlignLeft, AiOutlineAlignCenter, AiOutlineAlignRight, AiOutlineUndo, AiOutlineRedo } from 'react-icons/ai';
import { BsCodeSlash, BsBlockquoteLeft, BsJustify, BsImage } from 'react-icons/bs';
import { BiCodeBlock, BiParagraph } from 'react-icons/bi';
import { FiRefreshCw } from 'react-icons/fi';
import { MdFormatListBulleted } from 'react-icons/md';
import { VscHorizontalRule, VscNoNewline } from 'react-icons/vsc';
import { FaHighlighter } from 'react-icons/fa';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { Session } from '@auth0/nextjs-auth0';
import styles from './tiptap-edit.module.scss';
import { RootContext } from '../../../state/RootContext';
import { Input } from '../../input';

type Props = {
	session: any;
}

type MenuProps = {
	editor: Editor | null;
}
function MenuBar(props: MenuProps) {
	const { editor } = props;
	if (!editor) {
		return null;
	}

	return (
		<div className={styles.menu}>
			<button
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={styles.editButton}
			>
				<AiOutlineBold />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={styles.editButton}
			>
				<AiOutlineItalic />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleStrike().run()}
				className={styles.editButton}
			>
				<AiOutlineStrikethrough />
			</button>
			<button
				onClick={() => editor.chain().focus().setParagraph().run()}
				className={styles.editButton}
			>
				<BiParagraph />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				className={styles.editButton}
			>
				h1
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				className={styles.editButton}
			>
				h2
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				className={styles.editButton}
			>
				h3
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
				className={styles.editButton}
			>
				h4
			</button>
			<button
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={styles.editButton}
			>
				<MdFormatListBulleted />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={styles.editButton}
			>
				<AiOutlineOrderedList />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				className={styles.editButton}
			>
				<BsBlockquoteLeft />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleCode().run()}
				className={styles.editButton}
			>
				<BsCodeSlash />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
				className={styles.editButton}
			>
				<BiCodeBlock />
			</button>
			<button className={styles.editButton} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
				<VscHorizontalRule />
			</button>
			<button className={styles.editButton} onClick={() => editor.chain().focus().setHardBreak().run()}>
				<VscNoNewline />
			</button>
			<button onClick={() => editor.chain().focus().toggleHighlight().run()} className={styles.editButton}>
				<FaHighlighter />
			</button>
			<button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={styles.editButton}>
				<AiOutlineAlignLeft />
			</button>
			<button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={styles.editButton}>
				<AiOutlineAlignCenter />
			</button>
			<button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={styles.editButton}>
				<AiOutlineAlignRight />
			</button>
			<button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={styles.editButton}>
				<BsJustify />
			</button>
			<button className={styles.editButton} onClick={() => editor.chain().focus().undo().run()}>
				<AiOutlineUndo />
			</button>
			<button className={styles.editButton} onClick={() => editor.chain().focus().redo().run()}>
				<AiOutlineRedo />
			</button>
			<button className={styles.editButton} onClick={() => editor.chain().focus().unsetAllMarks().run()}>
				<FiRefreshCw />
			</button>
		</div>
	);
}

function TipTapEdit(props: Props) {
	const { session } = props;
	const { _, setBlogData } = useContext(RootContext);
	const [blogTitle, setBlogTitle] = useState<string>('');

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

	const addImage = () => {
		const url = window.prompt('URL');

		if (url) {
			editor?.chain().focus().setImage({ src: url }).run();
		}
	};

	const postBlog = async () => {
		try {
			const res = await axios.post('/api/blog/create-entry', { entry: editor?.getJSON(), user: session.user, title: blogTitle });
			console.log(res);
		} catch (error) {
			console.error(error);
		}
	};

	const saveBlog = () => {
		setBlogData(editor?.getJSON());
		postBlog();
		setBlogTitle('');
		setBlogData(null);
	};
	const eraseBlog = () => {
		setBlogData(null);
	};

	const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBlogTitle(e.target.value);
	};

	return (
		<div className={styles.content}>
			<Input labelFor="title" labelText="Title">
				<input
					id="title"
					type="text"
					onChange={onTitleChange}
					value={blogTitle}
				/>
			</Input>

			<MenuBar editor={editor} />
			<div>
				<button onClick={addImage} className={styles.editButton}>
					<BsImage />
				</button>
				<EditorContent editor={editor} />
			</div>
			<EditorContent editor={editor} />
			<button onClick={postBlog}>Save</button>
			<button onClick={eraseBlog}>Clear</button>
		</div>
	);
}

export default TipTapEdit;
