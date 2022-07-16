import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { AiOutlineBold, AiOutlineItalic, AiOutlineStrikethrough, AiOutlineOrderedList, AiOutlineAlignLeft, AiOutlineAlignCenter, AiOutlineAlignRight, AiOutlineUndo, AiOutlineRedo } from 'react-icons/ai';
import { BsCodeSlash, BsBlockquoteLeft, BsJustify, BsImage } from 'react-icons/bs';
import { BiCodeBlock, BiParagraph } from 'react-icons/bi';
import { FiRefreshCw } from 'react-icons/fi';
import { MdFormatListBulleted } from 'react-icons/md';
import { VscHorizontalRule, VscNoNewline } from 'react-icons/vsc';
import { FaHighlighter } from 'react-icons/fa';
import styles from './tiptap-edit.module.scss';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { Session } from '@auth0/nextjs-auth0';
import { RootContext } from '../../../state/RootContext';


// export async function getServerSideProps(context: any) {
// 	const session = await getSession({ req: context.req });
// 	// Redirect if user isn't logged in
// 	if (!session) {
// 		return {
// 			redirect: {
// 				destination: '/',
// 				permanent: false,
// 			},
// 		};
// 	}
// 	return {
// 		props: { session },
// 	};
// }


type Props = {
	session: Session;
}

type MenuProps = {
	editor: Editor | null;
}
const MenuBar = (props: MenuProps) => {
	const { editor } = props;
	if (!editor) {
		return null
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
	)
}


const TipTapEdit = (props: Props) => {
	const { session } = props;
	console.log({ session })
	const [value, setValue] = useState('');
	const { blogData, setBlogData } = useContext(RootContext);

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
		// 		content: `
		//       <h2>
		//         Hi there,
		//       </h2>
		//       <p>
		//         this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
		//       </p>
		//       <ul>
		//         <li>
		//           That’s a bullet list with one …
		//         </li>
		//         <li>
		//           … or two list items.
		//         </li>
		//       </ul>
		//       <p>
		//         Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
		//       </p>
		//       <pre><code class="language-css">body {
		//   display: none;
		// }</code></pre>
		//       <p>
		//         I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
		//       </p>
		//       <blockquote>
		//         Wow, that’s amazing. Good work, boy! 👏
		//         <br />
		//         — Mom
		//       </blockquote>
		//     `,
	})

	const addImage = () => {
		const url = window.prompt('URL')

		if (url) {
			editor?.chain().focus().setImage({ src: url }).run()
		}
	}

	const postBlog = async () => {
		try {
			const res = await axios.post('api/blog/create', { entry: editor?.getJSON(), user: { email: 'jessbonanno@gmail.com' } })
			// const res = await axios.post('api/blog/create-entry', { entry: editor?.getJSON(), user: session.user })
			console.log(res)
		} catch (error) {
			console.error(error)
		}
	}

	const saveBlog = () => {
		setBlogData(editor?.getJSON());
		postBlog();
	}
	const eraseBlog = () => {
		setBlogData(null);
		setValue('')
	}

	console.log(blogData)
	return (
		<div className={styles.content} >
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
	)
}

export default TipTapEdit;
