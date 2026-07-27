import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { api } from './api';
import { TodoLayout } from './layouts/TodoLayout';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { FindUsernamePage, ForgotPasswordPage, ResetPasswordPage } from './pages/RecoveryPages';
import { DailyPage } from './pages/todo/DailyPage';
import { MonthlyPage } from './pages/todo/MonthlyPage';
import { WeeklyPage } from './pages/todo/WeeklyPage';

function OAuthCallbackPage() {
  const navigate = useNavigate(); const [failed, setFailed] = useState(false);
  useEffect(() => { api.refresh().then(token => { localStorage.setItem('accessToken', token.accessToken); navigate('/'); }).catch(() => setFailed(true)); }, [navigate]);
  return <main className="center-page">{failed ? <section><p className="error">소셜 로그인을 완료하지 못했습니다.</p><Link to="/login">로그인으로 돌아가기</Link></section> : '소셜 로그인 처리 중...'}</main>;
}

export default function App() {
  return <BrowserRouter><Routes>
    <Route element={<TodoLayout />}>
      <Route path="/" element={<Navigate to="/day" replace />} />
      <Route path="/month" element={<MonthlyPage />} />
      <Route path="/week" element={<WeeklyPage />} />
      <Route path="/day" element={<DailyPage />} />
    </Route>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/find-username" element={<FindUsernamePage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>;
}

