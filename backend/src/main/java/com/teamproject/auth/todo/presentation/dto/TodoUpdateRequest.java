package com.teamproject.auth.todo.presentation.dto;

import java.time.LocalDate;

public class TodoUpdateRequest {

    private String title;
    private String description;
    private LocalDate todoDate;

    public TodoUpdateRequest(){}
    public String getTitle(){
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getTodoDate() {
        return todoDate;
    }
}
