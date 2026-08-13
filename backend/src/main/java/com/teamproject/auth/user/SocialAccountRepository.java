package com.teamproject.auth.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {
    Optional<SocialAccount> findByProviderAndProviderSubject(String provider, String providerSubject);
    
    // 회원 탈퇴 시 해당 사용자의 소셜 계정 연결 정보 삭제
    void deleteByUser_Id(Long userId);
}

