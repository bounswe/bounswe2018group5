package com.karpuz.karpuz.Network

import io.reactivex.Observable
import retrofit2.Retrofit
import retrofit2.adapter.rxjava2.RxJava2CallAdapterFactory
import retrofit2.converter.gson.GsonConverterFactory

class KarpuzAPIProvider(
    private val karpuzAPI: KarpuzAPI = Retrofit.Builder()
        .addCallAdapterFactory(RxJava2CallAdapterFactory.create())
        .addConverterFactory(GsonConverterFactory.create())
        .baseUrl(Config.baseUrl)
        .build().create(KarpuzAPI::class.java)
) : KarpuzAPI {

    companion object {
        val instance = KarpuzAPIProvider()
    }

    override fun register(registerBody: KarpuzAPIModels.RegisterBody): Observable<Void> {
        return karpuzAPI.register(registerBody)
    }

    override fun login(loginBody: KarpuzAPIModels.LoginBody): Observable<KarpuzAPIModels.LoginResponse> {
        return karpuzAPI.login(loginBody)
    }
}