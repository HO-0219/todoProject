import { useEffect, useState } from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { api, MeResponse } from '../api';

export function TodoLayout() {
  const navigate = useNavigate();
  const [me, setMe] = useState<MeResponse>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function authenticate() {
      try {
        if (!localStorage.getItem('accessToken')) {
          const token = await api.refresh();
          localStorage.setItem('accessToken', token.accessToken);
        }
        setMe(await api.me());
      } catch {
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    }
    authenticate();
  }, []);

  async function logout() {
    await api.logout().catch(() => undefined);
    localStorage.removeItem('accessToken');
    navigate('/login');
  }

  if (loading) return <main className="center-page">인증 상태 확인 중...</main>;
  if (!me) return <Navigate to="/login" replace />;

  return <div className="todo-app">
    <header className="todo-header">
      <NavLink to="/day" className="todo-logo"><span className="brand-mark">T</span><strong>TODO Calendar</strong></NavLink>
      <nav className="todo-nav" aria-label="TODO 보기 방식">
        <NavLink to="/month">월간</NavLink>
        <NavLink to="/week">주간</NavLink>
        <NavLink to="/day">일간</NavLink>
      </nav>
      <div className="todo-user"><span>{me.name}님</span><button className="secondary" onClick={logout}>로그아웃</button></div>
    </header>
    <main className="todo-main"><Outlet context={{ me }} /></main>
  </div>;
}
