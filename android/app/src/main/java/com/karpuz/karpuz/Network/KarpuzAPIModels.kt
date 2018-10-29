package com.karpuz.karpuz.Network

object KarpuzAPIModels {
    data class RegisterBody(val username: String, val password: String, val full_name: String, val email: String)
    data class RegisterResponse(val response: Boolean, val api_token: String?)

    data class LoginBody(val username: String, val password: String)
    data class LoginResponse(val response: Boolean, val api_token: String?, val error: String?)

    data class ProjectsResponse(val response: Boolean, val projects: Projects?)
    data class Projects(val projects: Array<Project>)
    data class Project(val project_id: String,
                       val title: String,
                       val created_at: String,
                       val updated_at: String,
                       val owner_id: String,
                       val description: String,
                       val deadline: String,
                       val budget: Double,
                       val status: Int)

    data class UserResponse(val response: Boolean, val user: User?)
    data class User(val username: String,
                    val profile_image: String?,
                    val created_at: String,
                    val updated_at: String,
                    val gender: String?,
                    val email: String,
                    val full_name: String,
                    val bio: String?,
                    val type: String?)
}

