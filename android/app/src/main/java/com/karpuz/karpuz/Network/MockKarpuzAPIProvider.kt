package com.karpuz.karpuz.Network

import io.reactivex.Observable

class MockKarpuzAPIProvider : KarpuzAPI {

    companion object {
        val instance = MockKarpuzAPIProvider()
    }

    private val testToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDA4MTQyMTMsInJvbGUiOm51bGwsImlkIjoiNWJkNmQ1ZTkzZTRkZDIwMDBiODIxZTI0In0.WBUjmBNONbA0jw4-MwYXYKdqAjLCrmAgyDolzyhn-bM"

    private constructor()

    override fun register(register: KarpuzAPIModels.RegisterBody): Observable<KarpuzAPIModels.RegisterResponse> {
        return Observable.just(KarpuzAPIModels.RegisterResponse(true, testToken))
    }

    override fun login(user: KarpuzAPIModels.LoginBody): Observable<KarpuzAPIModels.LoginResponse> {
        return Observable.just(KarpuzAPIModels.LoginResponse(true, testToken, null))
    }
}