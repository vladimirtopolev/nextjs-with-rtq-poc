import '../styles/globals.css';
import type {AppProps} from 'next/app';
import type {NextPage} from 'next';
import {wrapper} from '../store';
import type {ReactElement, ReactNode} from 'react';
import Head from 'next/head'

export type PageMetaProps = {
    title: string,
    image: string,
    type: string,
    url: string,
    siteName?: string;
    description?: string,
    imageAlt?: string,
    renderOnServer: boolean
}

type SpecificAppProps = AppProps & {
    Component: NextPage<PageMetaProps> & {
        renderLayoutOnServer?: boolean | undefined;
    };
};

type HydradeContentLayoutProps = PageMetaProps & {
    children: ReactElement;
    renderLayoutOnServer: boolean | undefined;
}
const HydradeContentLayout = ({
                                  children,
                                  renderLayoutOnServer,
                                  ...pageMeta
                              }: HydradeContentLayoutProps): ReactElement | null => {
    const {title, description, image, type, url, siteName = 'Fearless', imageAlt} = pageMeta;
    const isServer = typeof window === 'undefined';
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta property='og:title' content={title}></meta>
                <meta property='og:type' content={type}/>
                <meta property='og:image' content={image}></meta>
                <meta property='og:url' content={url}></meta>

                {description && (
                    <>
                        <meta property='og:description' content={description}></meta>
                        <meta name='description' content={description}></meta>
                    </>
                )}
                {siteName && <meta property='og:site_name' content={siteName}></meta>}
                {imageAlt && <meta name='twitter:image:alt' content={imageAlt}></meta>}
            </Head>
            {(isServer && !renderLayoutOnServer) ? null : children}
        </>
    );
}

function MyApp({Component, pageProps}: SpecificAppProps) {
    return (
        <HydradeContentLayout
            renderLayoutOnServer={pageProps.renderOnServer}
            {...pageProps}
        >
            <Component {...pageProps} />
        </HydradeContentLayout>
    );
}

export default wrapper.withRedux(MyApp);
