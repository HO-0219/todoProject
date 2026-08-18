type WithdrawModalProps = {
  open: boolean;
  pending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function WithdrawModal({
  open,
  pending,
  onClose,
  onConfirm,
}: WithdrawModalProps) {
  if (!open) return null;
  return (
    <div
      className="account-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !pending) onClose();
      }}
    >
      <section
        className="account-withdraw-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="withdraw-modal-title"
      >
        <span className="account-warning-icon">!</span>
        <h2 id="withdraw-modal-title">회원 탈퇴</h2>
        <p>정말 GearVIa Me를 탈퇴하시겠습니까?</p>
        <small>
          회원정보와 등록한 일정이 모두 삭제되며 복구할 수 없습니다.
        </small>
        <div>
          <button type="button" onClick={onClose} disabled={pending}>
            취소
          </button>
          <button type="button" onClick={onConfirm} disabled={pending}>
            {pending ? "처리 중..." : "탈퇴하기"}
          </button>
        </div>
      </section>
    </div>
  );
}
