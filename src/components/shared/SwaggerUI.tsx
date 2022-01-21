import 'swagger-ui-dist/swagger-ui.css';

import React, { useEffect } from 'react';
import { SwaggerUIBundle } from 'swagger-ui-dist';

export const SwaggerUI: React.FC = () => {
  useEffect(() => {
    SwaggerUIBundle({
      url: '/openapi.yaml',
      dom_id: '#swagger-ui',
      deepLinking: true,
      docExpansion: 'full',
    });
  }, []);

  return <div id="swagger-ui" />;
};
