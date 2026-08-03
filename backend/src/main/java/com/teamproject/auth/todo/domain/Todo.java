package com.teamproject.auth.todo.domain;


import com.teamproject.auth.user.User;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

// 이 클래스를 DB의 todos 테이블과 연결
@Entity
@Table(name = "todos")
public class Todo {

    // Todo의 고유 번호를 DB에서 자동으로 생성
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 여러 Todo가 한 명의 사용자에게 속하는 관계
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Todo의 기본 정보
    @Column(nullable = false, length = 100)
    private String title;
    @Column(length = 1000)
    private String description;

    // 처음 생성할 때는 미완료 상태
    @Column(nullable = false)
    private LocalDate todoDate;
    @Column(nullable = false)
    private boolean completed = false;

    // 완료 처리된 시간
    private LocalDateTime completedAt;

    // 생성 및 마지막 수정 시간
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // JPA가 Todo 객체를 생성할 때 사용하는 기본 생성자
    protected Todo(){ }

    // 새로운 Todo를 만들 때 전달받은 값으로 필드를 채움
    public Todo(
            User user,
            String title,
            String description,
            LocalDate todoDate

    ) {
        this.user = user;
        this.title = title;
        this.description =description;
        this.todoDate =todoDate;
    }
    // 기존 Todo의 내용을 수정
    public void update(
            String title,
            String description,
            LocalDate todoDate
    ){
        this.title = title;
        this.description = description;
        this.todoDate = todoDate;
    }

    // Todo를 완료 상태로 바꾸고 완료 시간을 기록
    public void complete() {
        this.completed = true;
        this.completedAt = LocalDateTime.now();

    }
    // 처음 DB에 저장되기 직전에 생성·수정 시간을 기록
    @PrePersist
    protected void onCreate(){
        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;
    }

    // DB의 Todo가 수정되기 직전에 수정 시간을 갱신
    @PreUpdate
    protected void onUpdate(){
        this.updatedAt = LocalDateTime.now();
    }

    // 외부에서 Todo의 값을 읽을 때 사용하는 메서드들
    public Long getId(){
        return id;
    }
    public User getUser(){
        return user;
    }
    public String getTitle(){
        return title;
    }
    public String getDescription(){
        return description;
    }
    public LocalDate getTodoDate(){
        return todoDate;
    }
    public boolean isCompleted(){
        return completed;
    }
    public LocalDateTime getCompletedAt(){
        return completedAt;
    }
    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
    public LocalDateTime getUpdatedAt(){
        return updatedAt;
    }

}
