package com.example.test.dto;

import com.example.test.type.CertificateResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class SmsCertificate {
    @Getter
    @Setter
    public static class Request{
        private String phoneNumber;
        private String certNum;
    }

    @Getter
    @Setter
    @Builder
    public static class Response {
        private CertificateResponse certificateResponse;
    }
}
