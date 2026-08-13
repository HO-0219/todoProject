package com.teamproject.auth.token;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByTokenHash(String tokenHash);
    
    // 회원 탈퇴 시 해당 사용자의 모든 Refresh Token 삭제
    void deleteByUser_Id(Long userId);
}

