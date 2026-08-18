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
    ["이름", me?.name ?? ""],
    ["아이디", me?.username ?? ""],
    ["이메일", me?.email ?? ""],
    ["회원 유형", me?.role ?? ""],
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
          <div>
            <h2>{me?.name ? `${me.name}님` : "회원정보 준비 중"}</h2>
            <p>백엔드 회원정보가 연결되면 자동으로 표시됩니다.</p>
          </div>
        </header>
        <div className="mypage-fields">
          {fields.map(([label, value]) => (
            <label key={label}>
              <span>{label}</span>
              <input value={value} readOnly placeholder=" " />
            </label>
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
