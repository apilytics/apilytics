import type { NextPage } from 'next';

import { NotFoundTemplate } from 'components/layout/NotFoundTemplate';
import { withUser } from 'hocs/withUser';

const NotFoundPage: NextPage = () => <NotFoundTemplate />;

export default withUser(NotFoundPage);
