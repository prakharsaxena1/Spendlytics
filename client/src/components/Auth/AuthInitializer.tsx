import { useEffect } from 'react';
import { AuthApis } from '../../redux/services/auth';

const AuthInitializer = () => {
  const { refetch } = AuthApis.useGetCurrentUserQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return null;
};

export default AuthInitializer;
