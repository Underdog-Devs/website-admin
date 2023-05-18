import React, { useContext, useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor } from '@tiptap/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import TipTapEdit from '../../../components/blog/tiptapEditor/tiptap-edit';
import styles from './edit.module.scss';
import Nav from '../../../components/dashboard/nav';
import { Input } from '../../../components/input';
import { RootContext } from '../../../state/RootContext';
import { prisma } from '../../../lib/prisma';

function EditPost(props: any) {
	const [file, setFile] = useState<any>(null);
	// ! FIX THIS
	// eslint-disable-next-line no-unused-vars
	const [uploadingStatus, setUploadingStatus] = useState<boolean>(false);
	const [featuredImage, setFeaturedImage] = useState<string>('');
	const [firstParagraph, setFirstParagraph] = useState<string>();
	const router = useRouter();

	const { post } = props;

	useEffect(() => {
		setBlogTitle(post.title);
		if (post.image) {
			setFeaturedImage(post.image);
		}
	}, []);

	useEffect(() => {
		if (file) {
			// ! FIX THIS
			// eslint-disable-next-line no-return-await
			const uploadedFileDetail = async () => await uploadFile();
			uploadedFileDetail();
		}
	}, [file]);

	const { data: session } = useSession();

	const { blogTitle, setBlogTitle } = useContext(RootContext);

	const tipTapEditor = useEditor({
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
		onUpdate({ editor }) {
			if (!editor.getJSON().content) {
				const paragraph = editor.getJSON().content![0].content![0].text;
				if (paragraph) {
					setFirstParagraph(
						paragraph.length < 180
							? paragraph.substring(0, 180)
							: `${paragraph.substring(0, 180)}...`,
					);
				}
			}
		},
	});

	const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBlogTitle(e.target.value);
	};

	const editBlog = async () => {
		try {
			const res = await axios.post('/api/blog/edit-entry', {
				entry: tipTapEditor?.getJSON(),
				user: session?.user,
				title: blogTitle,
				firstParagraph,
				id: post.id,
				image: featuredImage,
			});
			router.push(`/blog/${res.data.id}`);
		} catch (error) {
			console.error(error);
		}
	};

	const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFile(event.target.files![0]);
	};

	const uploadFile = async () => {
		setUploadingStatus(true);
		const datePrefix = Date.now();
		const name = `media/${datePrefix}-${file.name}`;

		const { data } = await axios.post('/api/s3/upload', {
			name,
			type: file.type,
		});

		const { url } = data;
		// ! FIX THIS
		// eslint-disable-next-line no-unused-vars
		const upload = await axios.put(url, file, {
			headers: {
				'Content-type': file.type,
				'Access-Control-Allow-Origin': '',
			},
		});
		setUploadingStatus(false);
		setFile(null);
		setFeaturedImage(`${process.env.S3_URL}${name}`);
	};

	const eraseBlog = () => {
		tipTapEditor?.commands.clearContent();
	};
	return (
		<div className={styles.container}>
			<div>
				<Nav />
			</div>

			<div className={styles.main}>
				<div className={styles.topContainer}>
					<div>
						<Input labelFor="title" labelText="Title">
							<input
								id="title"
								type="text"
								onChange={onTitleChange}
								value={blogTitle}
							/>
						</Input>
						<Input labelFor="featured-image" labelText="Featured Image">
							<input
								id="featured-image"
								type="file"
								accept="image/*"
								onChange={handleUploadChange}
							/>
						</Input>
					</div>
					<div>
						{featuredImage ? (
							<img
								className={styles.featuredImage}
								src={featuredImage}
								alt="Featured"
							/>
						) : null}
					</div>
				</div>
				<TipTapEdit editor={tipTapEditor} />
				<div className={styles.buttons}>
					<button onClick={editBlog}>Publish</button>
					<button className={styles.clearButton} onClick={eraseBlog}>Clear</button>
				</div>
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
