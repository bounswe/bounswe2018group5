package com.karpuz.karpuz.Network

object KarpuzAPIModels {
    data class RegisterBody(val email: String, val username: String, val password: String)

    data class LoginBody(val username: String, val password: String)
    data class LoginResponse(val statusCode: Int, val token: String, val errorMessage: String)
}

