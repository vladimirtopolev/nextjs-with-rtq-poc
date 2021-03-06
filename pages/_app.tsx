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
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
                <meta name="msvalidate.01" content="89BD029DD5EC8184F0505CBB28C0A7D8" />
                <meta name="google-site-verification" content="vaAaDH_-3EJGyAe78gu1ysTNYEhIkosQZytMoORLuvY" />
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
