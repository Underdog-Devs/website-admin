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
	// ! FIX THIS
	// eslint-disable-next-line no-unused-vars
	const [uploadingStatus, setUploadingStatus] = useState<boolean>(false);
	const [featuredImage, setFeaturedImage] = useState<string>('');
	const [firstParagraph, setFirstParagraph] = useState<string>();
	const [resizedImageFiles, setResizedImageFiles] = useState<any[any]>([]);
	const [uploadMessage, setUploadMessage] = useState<string>('');
	const router = useRouter();

	const MAX_WIDTH = 500;
	const MAX_HEIGHT = 500;

	useEffect(() => {
		if (resizedImageFiles.length === 2) {
			const uploadedFileDetail = async () => uploadMultipleImagesToS3();
			uploadedFileDetail();
		}
	}, [resizedImageFiles]);

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
					paragraph.length < 120
						? paragraph.substring(0, 120)
						: `${paragraph.substring(0, 120)}...`,
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
						router.push(`/blog/${blogTitle.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\s-]/g, '')}/${res.data.id}`);
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

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const uploadedFile = event.target.files?.[0];

		if (uploadedFile) {
			// Create a FileReader instance
			const reader = new FileReader();

			// Set a callback function to be called when the FileReader finishes loading the file
			reader.onload = (e) => {
				// Create an Image object to get the image's width and height
				const img = new Image();
				img.src = e.target?.result as string;

				// Wait for the image to load before getting the width and height
				img.addEventListener('load', () => {
					const { width, height } = img;
					let newWidth = width;
					let newHeight = height;
					let smallHeight;
					let smallWidth;
					const smallImageDimensions = 315;
					let isPortrait = false;

					// Determine if the image is portrait or landscape
					if (height > width) {
						isPortrait = true;
					}

					// If the image is portrait and the height is greater than the maximum height,
					// resize the image to the maximum height while maintaining the aspect ratio
					if (isPortrait && height > MAX_HEIGHT) {
						newHeight = MAX_HEIGHT;
						newWidth = (width * MAX_HEIGHT) / height;
					}

					// If the image is landscape and the width is greater than the maximum width,
					// resize the image to the maximum width while maintaining the aspect ratio
					if (!isPortrait && width > MAX_WIDTH) {
						newWidth = MAX_WIDTH;
						newHeight = (height * MAX_WIDTH) / width;
					}

					// Create a new canvas element and draw the uploaded image onto it
					const canvas = document.createElement('canvas');
					canvas.width = newWidth;
					canvas.height = newHeight;
					const ctx = canvas.getContext('2d');
					ctx?.drawImage(img, 0, 0, newWidth, newHeight);
					canvas.toBlob((blob) => {
						if (blob) {
							const resizedFile = new File([blob], 'resized-image.jpg', { type: 'image/jpeg' });

							// Set the state with the resized image file
							setResizedImageFiles(resizedImageFiles.push(resizedFile));
						}
					}, 'image/jpeg', 1);

					// Repeat the same process for the small image

					if (isPortrait) {
						smallHeight = smallImageDimensions;
						smallWidth = (width * smallImageDimensions) / height;
					} else {
						smallWidth = smallImageDimensions;
						smallHeight = (height * smallImageDimensions) / width;
					}

					const canvasSmall = document.createElement('canvas');
					canvasSmall.width = smallWidth;
					canvasSmall.height = smallHeight;
					const ctxSmall = canvasSmall.getContext('2d');
					ctxSmall?.drawImage(img, 0, 0, smallWidth, smallHeight);

					canvasSmall.toBlob((blob) => {
						if (blob) {
							const resizedSmallFile = new File([blob], 'resized-image-small.jpg', { type: 'image/jpeg' });

							// Set the state with the resized image file
							setResizedImageFiles([...resizedImageFiles, resizedSmallFile]);
						}
					}, 'image/jpeg', 1);
				});
				// Read the file as a data URL
			};
			reader.readAsDataURL(uploadedFile);
		}
	};

	const uploadMultipleImagesToS3 = async (): Promise<string[]> => {
		if (resizedImageFiles[0].size / 1024 > 2048) {
			setUploadMessage('File size is greater than maximum limit');
			return [];
		}
		setUploadingStatus(true);
		const datePrefix = Date.now();
		const uploadPromises = resizedImageFiles.map(async (imageFile: { name: any; type: any; }) => {
			const name = `media/${datePrefix}-${imageFile.name}`;

			const { data } = await axios.post('/api/s3/upload', {
				name,
				type: imageFile.type,
			});
			const { url } = data;
			// ! FIX THIS
			// eslint-disable-next-line no-unused-vars
			const upload = await axios.put(url, imageFile, {
				headers: {
					'Content-type': imageFile.type,
					'Access-Control-Allow-Origin': '',
				},
			});
			setFeaturedImage(`${process.env.NEXT_PUBLIC_S3_URL}${name}`);
		});

		setUploadingStatus(false);
		setResizedImageFiles([]);

		try {
			const uploadResults = await Promise.all(uploadPromises);
			return uploadResults;
		} catch (error) {
			console.error('Error uploading multiple images:', error);
			throw error;
		}
	};

	return (
		<div className={styles.container}>
			<div>
				<Nav />
			</div>
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
								onChange={handleImageChange}
							/>
						</Input>
						{uploadMessage ? <p className={styles.uploadMessage}>{uploadMessage}</p> : null}
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
				<div>
					<button onClick={postBlog}>Publish</button>
					<button onClick={eraseBlog}>Clear</button>
				</div>
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
