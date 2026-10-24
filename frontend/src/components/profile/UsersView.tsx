'use client';
import { useEffect, useState } from 'react';
import Alert from '@/components/ui/Alert';
import PageHeader from '@/components/ui/PageHeader';
import Pagination from '@/components/ui/Pagination';
import { PageLoader } from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import * as userService from '@/services/userService';
import type { Pagination as PaginationData, User } from '@/types';

// Admin only: the backend also checks the role, this just avoids a useless request.
export default function UsersView() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ users: User[]; pagination: PaginationData } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    userService.listUsers({ page, limit: 10 })
      .then((result) => { setData(result); setError(''); })
      .catch((e) => setError(e.message));
  }, [page, isAdmin]);

  if (!isAdmin) return <Alert type="warning">You do not have permission to view this page.</Alert>;

  return (
    <>
      <PageHeader title="Users" subtitle={data ? `${data.pagination.total} registered users` : ' '} />
      <Alert>{error}</Alert>
      {!data && !error ? <PageLoader /> : data && (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light"><tr><th>Username</th><th>Email</th><th>Role</th></tr></thead>
              <tbody>
                {data.users.map((u) => (
                  <tr key={u._id}>
                    <td className="fw-medium">{u.username}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'text-bg-primary' : 'text-bg-light'}`}>{u.role}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {data && <Pagination pagination={data.pagination} onChange={setPage} />}
    </>
  );
}
