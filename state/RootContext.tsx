import React, { FC, Context, createContext, useState } from 'react';

export const RootContext: Context<any> = createContext({});

type PropsWithChildren = {
	children: React.ReactNode;
}

export const Provider: FC<PropsWithChildren> = ({ children }) => {
	const [blogTitle, setBlogTitle] = useState<string | null>(null);
	return (
		<RootContext.Provider
			// TODO: Investigate useMemo for useState
			// eslint-disable-next-line react/jsx-no-constructed-context-values
			value={{
				blogTitle,
				setBlogTitle,
			}}
		>
			{children}
		</RootContext.Provider>
	);
};
