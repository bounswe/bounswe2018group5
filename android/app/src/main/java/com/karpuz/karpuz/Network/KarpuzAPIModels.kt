package com.karpuz.karpuz.Network

object KarpuzAPIModels {
    data class RegisterBody(val username: String, val password: String, val full_name: String, val email: String)
    data class RegisterResponse(val response: Boolean)

    data class LoginBody(val username: String, val password: String)
    data class LoginResponse(val response: Boolean, val api_token: String, val error: String)
}

