package com.karpuz.karpuz.Network

import io.reactivex.Observable
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers

class KarpuzAPIService(private val authToken: String, private val provider: KarpuzAPI) {

    companion object NoAuth {

        private val provider: KarpuzAPI
            get() = if (Config.useMockNetwork) MockKarpuzAPIProvider.instance else KarpuzAPIProvider.instance

        fun register(registerBody: KarpuzAPIModels.RegisterBody): Observable<KarpuzAPIModels.RegisterResponse> {
            return provider.register(registerBody).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread())
        }

        fun login(loginBody: KarpuzAPIModels.LoginBody): Observable<KarpuzAPIModels.LoginResponse> {
            return provider.login(loginBody).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread())
        }
    }

    fun getAllProjects(): Observable<KarpuzAPIModels.ProjectsResponse> {
        return provider.getAllProjects(authToken).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread())
    }
}