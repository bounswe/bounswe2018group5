package com.karpuz.karpuz.Network

import io.reactivex.Observable

class KarpuzAPIService(private val authToken: String, private val provider: KarpuzAPI) {

    companion object NoAuth {

        private val provider: KarpuzAPI
            get() = if (Config.useMockNetwork) MockKarpuzAPIProvider.instance else KarpuzAPIProvider.instance

        fun register(registerBody: KarpuzAPIModels.RegisterBody): Observable<Void> {
            return provider.register(registerBody)
        }

        fun login(loginBody: KarpuzAPIModels.LoginBody): Observable<KarpuzAPIModels.LoginResponse> {
            return provider.login(loginBody)
        }
    }
}