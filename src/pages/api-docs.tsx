import 'swagger-ui-react/swagger-ui.css';

import SwaggerUI from 'swagger-ui-react';

const ApiDocs = (): JSX.Element => {
  return <SwaggerUI url="/api/openapi.json" />;
};

export default ApiDocs;
