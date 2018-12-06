package com.karpuz.karpuz.Network

import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers

class KarpuzAPIService {

    companion object NoAuth {

        lateinit var instance: KarpuzAPIService

        fun create(authToken: String) {
            instance = KarpuzAPIService(authToken, provider)
        }

        private val provider = when {
            Config.useMockNetwork -> MockKarpuzAPIProvider.instance
            else -> KarpuzAPIProvider.instance
        }

        fun register(registerBody: KarpuzAPIModels.RegisterBody): Observable<KarpuzAPIModels.RegisterResponse> {
            return provider.register(registerBody).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread())
        }

        fun login(loginBody: KarpuzAPIModels.LoginBody): Observable<KarpuzAPIModels.LoginResponse> {
            return provider.login(loginBody).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread())
        }
    }

    private val authToken: String
    private val provider: KarpuzAPI

    private constructor(authToken: String, provider: KarpuzAPI) {
        this.authToken = authToken
        this.provider = provider
    }

    fun getUserProfile(userId: String?): Observable<KarpuzAPIModels.UserResponse> {
        return if (userId != null) {
            provider.getUserProfile(authToken, userId).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread())
        } else {
            provider.getUserProfile(authToken).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread())
        }
    }

    fun getAllProjects(): Observable<KarpuzAPIModels.ProjectsResponse> {
        return provider.getAllProjects(authToken).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread())
    }

    fun createProject(title: String, description: String, budget: Double, project_deadline: String): Observable<KarpuzAPIModels.CreateProjectResponse> {
        return provider.createProject(authToken, KarpuzAPIModels.CreateProjectBody(title, description, budget, project_deadline)).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread())
    }
}