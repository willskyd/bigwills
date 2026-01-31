import Breadcumb from '@/layouts/breadcumb';
import Layout from '@/layouts/layout';
import dynamic from 'next/dynamic';

export const metadata = {
    title: 'Projects',
}

const PortfolioList = dynamic(
    () => {
        return import("@/components/Portfolio/PortfolioList");
    },
    { ssr: false }
);

export default function page() {
    return (
        <Layout>

            <Breadcumb firstChild={"Projects"} />
            <PortfolioList />

        </Layout>
    )
}
