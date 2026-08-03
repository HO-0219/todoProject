package com.teamproject.auth.todo.presentation.dto;

import java.time.LocalDate;

public class TodoCreateRequest {

    private Long userId;
    private String title;
    private String description;
    private LocalDate todoDate;

    public TodoCreateRequest(){   }

    public Long getUserId(){
        return userId;
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

}
