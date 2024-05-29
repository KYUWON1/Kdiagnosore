package Dto;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document(collection="user")
public class UserDto {
    @Id
    private String id;

    private String name;
    private String email;
    private String password;

    private String phone_number;
    private String protector_name;
    private String protector_number;
}
