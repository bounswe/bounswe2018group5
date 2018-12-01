package com.karpuz.karpuz.Network

object KarpuzAPIModels {
    data class RegisterBody(val username: String, val password: String, val full_name: String, val email: String)
    data class RegisterResponse(val response: Boolean, val api_token: String?, val error: String?)

    data class LoginBody(val username: String, val password: String)
    data class LoginResponse(val response: Boolean, val api_token: String?, val error: String?)

    data class ProjectsResponse(val response: Boolean, val projects: List<Project>?, val error: String?)
    data class Ratings(val rater: List<Double>,
                       val rated: List<Double>)
    data class Wallet(val balance: Double)
    data class Portfolio(val title: String,
                         val project_id: String?,
                         val date: String?,
                         val id: String,
                         val description: String)
    data class User(val avg_rating: Double?,
                    val ratings: Ratings?,
                    val email: String?,
                    val profile_image: String?,
                    val username: String?,
                    val id: String?,
                    val wallet: Wallet?,
                    val type: Int?,
                    val full_name: String,
                    val bio: String?,
                    val gender: Int?,
                    val portfolios: List<Portfolio>)
    data class Bid(val status: Int,
                   val offer: Double,
                   val bid_id: String,
                   val freelancer: User)
    data class Project(val ratings: List<Double>,
                       val budget: Double,
                       val status: Int,
                       val description: String,
                       val freelancer: User?,
                       val owner: User,
                       val title: String,
                       val project_id: String,
                       val deadline: String,
                       val bids: List<Bid>,
                       val created_at: String)

    data class UserResponse(val response: Boolean, val user: User?, val error: String?)
}

