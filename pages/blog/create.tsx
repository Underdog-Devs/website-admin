import React, { useContext, useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import { Image as tiptapImage } from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor } from '@tiptap/react';
import { RootContext } from '../../state/RootContext';
import TipTapEdit from '../../components/blog/tiptapEditor/tiptap-edit';
import styles from './create.module.scss';
import Nav from '../../components/dashboard/nav';
import { Input } from '../../components/input';

// TODO: Refactor create and edit post pages and endpoints and make them dynamic/reusable
function CreatePost() {
	const [file, setFile] = useState<any>(null);
	// ! FIX THIS
	// eslint-disable-next-line no-unused-vars
	const [uploadingStatus, setUploadingStatus] = useState<boolean>(false);
	const [featuredImage, setFeaturedImage] = useState<string>('');
	const [firstParagraph, setFirstParagraph] = useState<string>();
	const router = useRouter();

	useEffect(() => {
		if (file) {
			const uploadedFileDetail = async () => uploadFile();
			uploadedFileDetail();
		}
	}, [file]);

	const { data: session } = useSession();
	const { blogTitle, setBlogTitle } = useContext(RootContext);
	useEffect(() => {
		setBlogTitle('');
	}, []);

	const tipTapEditor = useEditor({
		extensions: [
			StarterKit,
			Highlight,
			Typography,
			tiptapImage,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
		],
		onUpdate({ editor }) {
			if (!editor.getJSON().content![0].content) return;
			const paragraph = editor.getJSON().content![0].content![0].text;
			if (paragraph) {
				setFirstParagraph(
					paragraph.length < 180
						? paragraph.substring(0, 180)
						: `${paragraph.substring(0, 180)}...`,
				);
			}
		},
	});

	const postBlog = async () => {
		const user = {
			...session?.user,
			id: session?.id,
		};
		try {
			await axios
				.post('/api/blog/create-entry', {
					entry: tipTapEditor?.getJSON(),
					user,
					title: blogTitle,
					firstParagraph,
					image: featuredImage,
				})
				.then((res) => {
					if (res.status === 201) {
						router.push(`/blog/${res.data.id}`);
					}
				});
		} catch (error) {
			console.error(error);
		}
	};

	const eraseBlog = () => {
		tipTapEditor?.commands.clearContent();
	};

	const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBlogTitle(e.target.value);
	};

	const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFile(event.target.files![0]);
	};

	const uploadFile = async () => {
		if (file.size / 1024 > 2048) {
			// setErrorMsg('File size is greater than maximum limit');
			// setIsSuccess(false);
			console.log('FILE TOO LARGE');
			return;
		}
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

	return (
		<div className={styles.container}>
			<div>
				<div className={styles.topContainer}>
					<div>
						<Input labelFor="title" labelText="Title">
							<input
								id="title"
								type="text"
								className={styles.titleInput}
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
			</div>
			<div>
				<Nav />
			</div>
			<div>
				<button onClick={postBlog}>Publish</button>
				<button onClick={eraseBlog}>Clear</button>
			</div>
		</div>
	);
}

export async function getServerSideProps(context: { req: any }) {
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
