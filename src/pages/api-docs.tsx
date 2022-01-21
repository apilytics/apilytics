import 'swagger-ui-react/swagger-ui.css';

import SwaggerUI from 'swagger-ui-react';
import type { NextPage } from 'next';

import { MainTemplate } from 'components/layout/MainTemplate';

const ApiDocs: NextPage = () => (
  <MainTemplate index>
    <div className="card rounded-lg shadow p-4 bg-white">
      <SwaggerUI url="/api/openapi.json" />
    </div>
  </MainTemplate>
);

export default ApiDocs;
