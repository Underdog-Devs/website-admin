import React, { FC, Context, createContext, useState } from 'react';

export const RootContext: Context<any> = createContext({});

type PropsWithChildren = {
	children: React.ReactNode;
}

export const Provider: FC<PropsWithChildren> = ({ children }) => {
	const [blogData, setBlogData] = useState<string | null>(null);

	return (
			<RootContext.Provider
			value={{
				blogData,
				setBlogData,
			}}
			>
				{children}
			</RootContext.Provider>
	);
};