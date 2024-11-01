import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import '@mantine/core/styles.css';
import TopHeader from '@/Components/Navigation/TopHeader';
import Sidebar from '@/Components/Navigation/Sidebar';
import Footer from '@/Components/Navigation/Footer';

export default function MasterLayout(props) {
	const { children } = props;

	const initialSidebarState = typeof window !== 'undefined' 
		? JSON.parse(localStorage.getItem('sidebarOpened')) ?? true 
		: true;

	const [sidebarOpened, { toggle: toggleSidebar }] = useDisclosure(initialSidebarState);

	// Update localStorage whenever the sidebar state changes
	useEffect(() => {
		localStorage.setItem('sidebarOpened', JSON.stringify(sidebarOpened));
	}, [sidebarOpened]);

	return (
		<AppShell
			padding="md"
			header={{ height: 60 }}
			footer={{ height: 30 }}
			navbar={{
				width: 300,
				breakpoint: 'sm',
				collapsed: { mobile: !sidebarOpened, desktop: !sidebarOpened },
			}}
		>
			<TopHeader sidebarOpened={sidebarOpened} toggleSidebar={toggleSidebar} {...props} />
			<Sidebar {...props} />
			<AppShell.Main>
				<div className="main">
					{children}
				</div>
			</AppShell.Main>
			<Footer sidebarOpened={sidebarOpened} />
		</AppShell>
	);
}
