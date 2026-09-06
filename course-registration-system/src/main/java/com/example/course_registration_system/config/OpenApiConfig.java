package com.example.course_registration_system.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI courseRegistrationOpenAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("Course Registration System API")
                        .version("1.0")
                        .description(
                                "REST API documentation for the Course Registration System. "
                                        + "The application provides student registration, email OTP verification, "
                                        + "JWT authentication, course registration, course dropping, "
                                        + "and admin course and registration management."
                        )
                        .contact(new Contact()
                                .name("Mahavishnu")
                                .email("vishnujayabal06@gmail.com")
                        )
                );
    }
}