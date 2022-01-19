import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
  openApiVersion: '3.0.0',
  title: 'Apilytics API docs',
  version: '1.1.0',
  apiFolder: 'src/pages/api',
});

export default swaggerHandler();
