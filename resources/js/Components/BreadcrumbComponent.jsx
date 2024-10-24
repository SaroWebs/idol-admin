import { Anchor, Breadcrumbs } from '@mantine/core';

export default function BreadcrumbsComponent({ items }) {
    const breadcrumbItems = items.map((item, index) => (
        <Anchor
            href={item.href === '#' ? undefined : item.href}
            key={index}
            style={{
                color: item.href === '#' ? '#9ca3af' : 'inherit',
                pointerEvents: item.href === '#' ? 'none' : 'auto',
                textDecoration: item.href === '#' ? 'none' : 'underline',
            }}
        >
            {item.title}
        </Anchor>
    ));

    return (
        <Breadcrumbs separator="•" mt="xs">
            {breadcrumbItems}
        </Breadcrumbs>
    );
}
