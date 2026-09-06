package com.example.course_registration_system.config;

import com.example.course_registration_system.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                // ==============================
                // CORS
                // ==============================
                .cors(cors -> {})

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // ==============================
                        // PUBLIC APIs
                        // ==============================
                        .requestMatchers(
                                "/users/register",
                                "/users/verify-otp",
                                "/users/resend-otp",
                                "/auth/login",

                                // Swagger / OpenAPI
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()


                        // ==============================
                        // COURSE APIs
                        // ==============================

                        // Anyone logged in can view courses
                        .requestMatchers(
                                HttpMethod.GET,
                                "/courses",
                                "/courses/**"
                        ).authenticated()

                        // Only ADMIN can create
                        .requestMatchers(
                                HttpMethod.POST,
                                "/courses"
                        ).hasRole("ADMIN")

                        // Only ADMIN can update
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/courses/**"
                        ).hasRole("ADMIN")

                        // Only ADMIN can delete
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/courses/**"
                        ).hasRole("ADMIN")


                        // ==============================
                        // REGISTRATION APIs
                        // ==============================

                        // ADMIN can view registrations for a course
                        .requestMatchers(
                                HttpMethod.GET,
                                "/registrations/course/**"
                        ).hasRole("ADMIN")

                        // STUDENT can view their own courses
                        .requestMatchers(
                                HttpMethod.GET,
                                "/registrations/my-courses"
                        ).hasRole("STUDENT")

                        // STUDENT can register
                        .requestMatchers(
                                HttpMethod.POST,
                                "/registrations/**"
                        ).hasRole("STUDENT")

                        // STUDENT can drop
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/registrations/**"
                        ).hasRole("STUDENT")


                        // ==============================
                        // USER APIs
                        // ==============================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/users/profile"
                        ).authenticated()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/users/students"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/users/students/**"
                        ).hasRole("ADMIN")


                        // ==============================
                        // ADMIN DASHBOARD
                        // ==============================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/users/admin/dashboard"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/users/admin/dashboard/courses"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/users/admin/dashboard/most-popular-course"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/users/admin/dashboard/recent-students"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/users/admin/dashboard/recent-registrations"
                        ).hasRole("ADMIN")


                        // ==============================
                        // EVERYTHING ELSE
                        // ==============================

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }


    // ==============================
    // CORS CONFIGURATION
    // ==============================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:5173",
                        "http://localhost:5175"
                )
        );

        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                Arrays.asList("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // ==============================
    // AUTHENTICATION MANAGER
    // ==============================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }
}