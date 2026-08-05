package com.teamproject.auth.todo.presentation.dto;

import java.time.LocalDate;

public class TodoCreateRequest {

    
    private String title;
    private String description;
    private LocalDate todoDate;

    public TodoCreateRequest(){   }

    
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
