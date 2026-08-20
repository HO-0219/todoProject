import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { api, type MeResponse } from "../api";
import { WithdrawModal } from "../features/account/components/WithdrawModal";

type TodoOutletContext = { me?: MeResponse };

export function MyPage() {
  const navigate = useNavigate();
  const { me } = useOutletContext<TodoOutletContext>();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  async function withdraw() {
    setWithdrawing(true);
    try {
      await api.withdraw();
      localStorage.removeItem("accessToken");
      window.alert("회원 탈퇴가 완료되었습니다.");
      navigate("/login", { replace: true });
    } catch {
      window.alert("회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setWithdrawing(false);
    }
  }

  const fields = [
    ["이름", me?.name || "정보 없음"],
    ["아이디", me?.username || "정보 없음"],
    ["이메일", me?.email || "정보 없음"],
  ];

  return (
    <section className="mypage">
      <header className="mypage-intro">
        <p>MY PAGE</p>
        <h1>회원정보</h1>
        <span>계정 정보를 확인하고 관리할 수 있습니다.</span>
      </header>

      <section className="mypage-profile-card">
        <header>
          <div className="mypage-avatar">{me?.name?.charAt(0) || "–"}</div>
          <div className="mypage-profile-copy">
            <span>GEARVIA ME PROFILE</span>
            <h2>{me?.name ? `${me.name}님` : "회원정보 준비 중"}</h2>
            <p>나만의 일정과 계획을 한곳에서 관리하고 있습니다.</p>
          </div>
          <span className="mypage-account-badge">내 계정</span>
        </header>
        <div className="mypage-fields">
          {fields.map(([label, value]) => (
            <article key={label}>
              <div>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mypage-danger-zone">
        <div>
          <h2>회원 탈퇴</h2>
          <p>탈퇴하면 회원정보와 모든 일정이 영구적으로 삭제됩니다.</p>
        </div>
        <button type="button" onClick={() => setShowWithdrawModal(true)}>
          회원 탈퇴
        </button>
      </section>

      <WithdrawModal
        open={showWithdrawModal}
        pending={withdrawing}
        onClose={() => setShowWithdrawModal(false)}
        onConfirm={withdraw}
      />
    </section>
  );
}
