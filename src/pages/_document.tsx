import Document, { Head, Html, Main, NextScript } from 'next/document';
import type { DocumentContext, DocumentInitialProps } from 'next/document';

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github-dark.min.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx: DocumentContext): Promise<DocumentInitialProps> => {
  const initialProps = await Document.getInitialProps(ctx);
  return initialProps;
};

export default MyDocument;
