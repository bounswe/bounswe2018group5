package com.karpuz.karpuz.Network

import io.reactivex.Observable

class MockKarpuzAPIProvider : KarpuzAPI {

    companion object {
        val instance = MockKarpuzAPIProvider()
    }

    override fun register(register: KarpuzAPIModels.RegisterBody): Observable<Void> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun login(user: KarpuzAPIModels.LoginBody): Observable<KarpuzAPIModels.LoginResponse> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
}