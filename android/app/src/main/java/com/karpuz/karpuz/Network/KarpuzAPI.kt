package com.karpuz.karpuz.Network

import io.reactivex.Observable
import retrofit2.http.*

interface KarpuzAPI {

    @POST("api/user/auth/register")
    fun register(@Body register: KarpuzAPIModels.RegisterBody): Observable<KarpuzAPIModels.RegisterResponse>

    @POST("api/user/auth/login")
    fun login(@Body user: KarpuzAPIModels.LoginBody): Observable<KarpuzAPIModels.LoginResponse>

    @GET("api/project/get_all")
    fun getAllProjects(@Header("Authorization") auth: String): Observable<KarpuzAPIModels.ProjectsResponse>
}