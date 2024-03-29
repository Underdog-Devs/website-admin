import { useCallback, useRef, useState } from 'react';
import axios from 'axios';
// useInfiniteScroll.ts
export interface UseInfiniteScroll {
	isLoading: boolean;
	//! MUST FIX THIS
	// eslint-disable-next-line no-unused-vars
	loadMoreCallback: (el: HTMLDivElement) => void;
	hasDynamicPosts: boolean;
	dynamicPosts: BlogPost[];
	isLastPage: boolean;
}

interface BlogPost {
	id: string;
	image: string;
	title: string;
	name: string;
	text: string;
	firstParagraph:string;
	author: string;
	date: string;
	entry: any;
}

export const useInfiniteScroll = (posts: BlogPost[], authorId: string): UseInfiniteScroll => {
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [hasDynamicPosts, setHasDynamicPosts] = useState(false);
	const [dynamicPosts, setDynamicPosts] = useState<BlogPost[]>(posts);
	const [isLastPage, setIsLastPage] = useState(false);
	const observerRef = useRef<IntersectionObserver>();
	//! MUST FIX THIS
	// eslint-disable-next-line no-undef
	const loadMoreTimeout: NodeJS.Timeout = setTimeout(() => null, 500);
	//! MUST FIX THIS
	// eslint-disable-next-line no-undef
	const loadMoreTimeoutRef = useRef<NodeJS.Timeout>(loadMoreTimeout);

	const handleObserver = useCallback(
		(entries: any[]) => {
			const target = entries[0];
			if (target.isIntersecting) {
				setIsLoading(true);
				clearTimeout(loadMoreTimeoutRef.current);
				// this timeout debounces the intersection events
				loadMoreTimeoutRef.current = setTimeout(() => {
					axios({
						method: 'post',
						url: '/api/blog/authors-posts',
						headers: {},
						data: {
							skip: 6*page, // This is the body part
							take: 6,
							authorId,
						},
					}).then((resp) => {
						setPage(page + 1);
						const newPosts = resp?.data.posts;

						if (newPosts?.length) {
							const newDynamicPosts = [...dynamicPosts, ...newPosts];
							setDynamicPosts(newDynamicPosts);
							setIsLastPage(newDynamicPosts?.length === resp?.data.count);
							setHasDynamicPosts(true);
							setIsLoading(false);
						}
					});
				}, 500);
			}
		},
		[loadMoreTimeoutRef, setIsLoading, page, dynamicPosts],
	);

	const loadMoreCallback = useCallback(
		(el: HTMLDivElement) => {
			if (isLoading) return;
			if (observerRef.current) observerRef.current.disconnect();

			//! MUST FIX THIS
			// eslint-disable-next-line no-undef
			const option: IntersectionObserverInit = {
				root: null,
				rootMargin: '0px',
				threshold: 1.0,
			};
			observerRef.current = new IntersectionObserver(handleObserver, option);

			if (el) observerRef.current.observe(el);
		},
		[handleObserver, isLoading],
	);

	return {
		isLoading,
		loadMoreCallback,
		hasDynamicPosts,
		dynamicPosts,
		isLastPage,
	};
};
