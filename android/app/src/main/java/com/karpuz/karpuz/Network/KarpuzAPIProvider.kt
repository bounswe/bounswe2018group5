package com.karpuz.karpuz.Network

import io.reactivex.Observable
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory

class KarpuzAPIProvider : KarpuzAPI {

    companion object {
        val instance = KarpuzAPIProvider()
    }

    private val karpuzAPI: KarpuzAPI = Retrofit.Builder()
        .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
        .addConverterFactory(GsonConverterFactory.create())
        .baseUrl(Config.baseUrl)
        .build().create(KarpuzAPI::class.java)

    override fun register(registerBody: KarpuzAPIModels.RegisterBody): Observable<KarpuzAPIModels.RegisterResponse> {
        return karpuzAPI.register(registerBody)
    }

    override fun login(loginBody: KarpuzAPIModels.LoginBody): Observable<KarpuzAPIModels.LoginResponse> {
        return karpuzAPI.login(loginBody)
    }

    override fun getProjects(auth: String, projectIds: String): Observable<KarpuzAPIModels.ProjectsResponse> {
        return karpuzAPI.getProjects(auth, projectIds)
    }

    override fun getAllProjects(auth: String): Observable<KarpuzAPIModels.ProjectsResponse> {
        return karpuzAPI.getAllProjects(auth)
    }

    override fun getUserProfile(auth: String): Observable<KarpuzAPIModels.UserResponse> {
        return karpuzAPI.getUserProfile(auth)
    }

    override fun getUserProfile(auth: String, userId: String): Observable<KarpuzAPIModels.UserResponse> {
        return karpuzAPI.getUserProfile(auth, userId)
    }

    override fun createProject(
        auth: String,
        project: KarpuzAPIModels.CreateProjectBody
    ): Observable<KarpuzAPIModels.CreateProjectResponse> {
        return karpuzAPI.createProject(auth, project)
    }
}