import type { NextPage } from 'next';

import { NotFoundTemplate } from 'components/layout/NotFoundTemplate';
import { withAccount } from 'hocs/withAccount';

const NotFoundPage: NextPage = () => <NotFoundTemplate />;

export default withAccount(NotFoundPage);
